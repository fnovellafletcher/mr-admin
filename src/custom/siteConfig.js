import {
  EnvironmentOutlined,
  LinkOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const siteConfig = {
  demoMode: false,
  initURL: "/video",
  defaultLanguage: {
    languageId: "spanish",
    locale: "es",
    name: "Español",
    icon: "es",
  },
  auth: {
    thirdParties: {
      googleEnabled: false,
      facebookEnabled: false,
      twitterEnabled: false,
      githubEnabled: false,
    },
    registrationEnabled: false,
  },
  sidebar: {
    groups: [
      {
        path: "/video/",
        key: "video",
        code: "sidebar.videos",
        title: "Videos",
        icon: <VideoCameraOutlined />,
      },
      {
        path: "/links/",
        key: "links",
        code: "sidebar.links",
        title: "Enlaces",
      },
    ],
    single: [
      {
        path: "/video/",
        key: "video",
        code: "sidebar.videos",
        title: "Video",
        icon: <VideoCameraOutlined />,
      },
      {
        path: "/video/link/",
        key: "video.link",
        code: "sidebar.video.links",
        title: "Video links",
        icon: <VideoCameraOutlined />,
      },
      {
        path: "/links/",
        key: "links",
        code: "sidebar.links",
        title: "Links",
        icon: <LinkOutlined />,
      },
    ],
  },
};

export default siteConfig;
