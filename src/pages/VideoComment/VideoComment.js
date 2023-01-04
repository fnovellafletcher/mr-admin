import React, { useCallback, useEffect, useState } from "react";

import IntlMessages from "util/IntlMessages";
import Crud from "components/custom/Crud";
import VideoService from "services/video";

import videoLinkCrud from "./crudBuilder";
import { useHistory } from "react-router-dom";

const VideoComment = () => {
  const [crudModel, setCrudModel] = useState();
  const history = useHistory();

  const loadCrudBuilder = useCallback(async () => {
    try {
      const videos = await VideoService.getVideos();

      // const videoLinks = videos.data
      //   .map((video) =>
      //     (video.links || []).map((link) => ({
      //       ...link,
      //       videoId: video.id,
      //       videoTitle: video.title,
      //     }))
      //   )
      //   .flat();

      videoLinkCrud.buildFormFieldsCrud(videos.data);
      setCrudModel(videoLinkCrud);
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadCrudBuilder();
  }, [loadCrudBuilder]);

  return (
    <div>
      <h2 className="title gx-mb-4">
        <IntlMessages id="sidebar.video.comments" />
      </h2>

      {crudModel && <Crud {...crudModel}></Crud>}
    </div>
  );
};

export default VideoComment;
