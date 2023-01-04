import ApiService from "../ApiService";

export default class CommentApiService extends ApiService {
  commentEndpoint = "/comment";
  commentVideoEndpoint = "/comment/entity";
  commentApprovalEndpoint = "/comment/approve";

  constructor() {
    super("comment_api");
  }

  buildCommentUrl(commentId) {
    let baseUri = this.commentEndpoint;
    if (!commentId) return baseUri;
    return `${baseUri}/${commentId}`;
  }

  buildCommentVideoUrl(commentId) {
    let baseUri = this.commentVideoEndpoint;
    if (!commentId) return baseUri;
    return `${baseUri}/${commentId}`;
  }

  buildCommentApprovalUrl(commentId) {
    let baseUri = this.commentApprovalEndpoint;
    if (!commentId) return baseUri;
    return `${baseUri}/${commentId}`;
  }

  async getComments() {
    return await this.get(this.commentEndpoint);
  }

  async getCommentById(commentId) {
    const url = this.buildCommentUrl(commentId);
    return await this.get(url);
  }

  async getCommentByVideoId(videoId) {
    const url = this.buildCommentVideoUrl(videoId);
    return await this.get(url);
  }

  async createComment(data) {
    return await this.post(this.commentEndpoint, data);
  }

  async updateCommentStatus(commentId, data) {
    const url = this.buildCommentApprovalUrl(commentId);
    return await this.post(url, data);
  }

  async deleteComment(commentId) {
    const url = this.buildCommentUrl(commentId);

    return await this._delete(url);
  }
}
