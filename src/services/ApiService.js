import { auth } from "services/firebase";

class ApiService {
  hosts = {
    main_api: process.env.REACT_APP_API_HOST,
    comment_api: process.env.REACT_APP_COMMENT_API_HOST,
  };

  constructor(host = "main_api") {
    this.api_host = this.hosts[host];
  }

  async get(endpoint, isBlob) {
    const requestOptions = {
      method: "GET",
    };
    requestOptions.headers = await this.injectJWTIntoHeader({});
    return fetch(this.buildURL(endpoint), requestOptions).then((response) =>
      this.handleResponse(response, isBlob)
    );
  }

  async post(endpoint, body, headers = {}) {
    const requestHeaders = {
      ...headers,
      "Content-Type": headers["Content-Type"] || "application/json",
    };
    const requestBody =
      requestHeaders["Content-Type"] === "application/json"
        ? JSON.stringify(body)
        : body;

    // https://stackoverflow.com/questions/49692745/express-using-multer-error-multipart-boundary-not-found-request-sent-by-pos
    if (requestHeaders["Content-Type"] === "multipart/form-data")
      delete requestHeaders["Content-Type"];

    const requestOptions = {
      method: "POST",
      headers: requestHeaders,
      body: requestBody,
    };
    requestOptions.headers = await this.injectJWTIntoHeader(
      requestOptions.headers
    );
    return fetch(this.buildURL(endpoint), requestOptions).then(
      this.handleResponse
    );
  }

  async put(endpoint, body) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    requestOptions.headers = await this.injectJWTIntoHeader(
      requestOptions.headers
    );
    return fetch(this.buildURL(endpoint), requestOptions).then(
      this.handleResponse
    );
  }

  async patch(endpoint, body) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    requestOptions.headers = await this.injectJWTIntoHeader(
      requestOptions.headers
    );
    return fetch(this.buildURL(endpoint), requestOptions).then(
      this.handleResponse
    );
  }

  // prefixed with underscored because delete is a reserved word in javascript
  async _delete(endpoint) {
    const requestOptions = {
      method: "DELETE",
    };
    requestOptions.headers = await this.injectJWTIntoHeader(
      requestOptions.headers
    );
    return fetch(this.buildURL(endpoint), requestOptions).then(
      this.handleResponse
    );
  }

  // helper functions
  handleResponse(response, isBlob) {
    if (isBlob) return response.blob();

    return response.text().then((text) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
        return Promise.reject(data);
      }

      return {
        data,
      };
    });
  }

  buildURL(endpoint) {
    return `${this.api_host}${endpoint || ""}`;
  }

  async injectJWTIntoHeader(header) {
    try {
      const user = await auth.currentUser;

      const token = user && (await user.getIdToken());
      return {
        ...header,
        Authorization: `Bearer ${token}`,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default ApiService;
