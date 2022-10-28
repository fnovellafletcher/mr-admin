import { CheckOutlined, CloseOutlined, UsbFilled } from "@ant-design/icons";
import { Button, Progress, Row, Col, Typography } from "antd";
import Text from "antd/lib/typography/Text";
import { CrudBuilder } from "components/custom/Crud/CrudBuilder";
import VideoService from "services/video";
import CommentService from "services/comment";

const textKeys = {
  createRecordTextKey: "crud.videoComment.create.new.record",
  updateRecordTextKey: "crud.videoComment.update.record",
  deleteRecordTextKey: "crud.videoComment.delete.record",
};
const idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
const pageSize = 50; // page size
const position = "both"; // paginator location

const find = async ({ page, limit }) => {
  const videos = await VideoService.getVideos(page, limit);
  const allCommentsByVideo = await Promise.all(
    videos.data.map((video) => CommentService.getCommentByVideoId(video.id))
  );

  const allCommentsFlat = allCommentsByVideo
    .map((commentsByVideo) => commentsByVideo.data)
    .flat();

  const allComments = allCommentsFlat.map((comment) => ({
    ...comment,
    videoTitle: videos.data.find((video) => video.id === comment.entity_id)
      .title,
  }));
  //   const comments = await CommentService.getComments();

  return {
    // data: videos.data
    //   .map((video) =>
    //     (video.comment || []).map((comment) => ({
    //       ...comment,
    //       id: `${video.id}-${comment.id}`,
    //       videoId: video.id,
    //       videoTitle: video.title,
    //     }))
    //   )
    //   .flat(),
    data: allComments,
  };
};

const findOne = async ({ id }) => {
  const commentResponse = await CommentService.getCommentById(id);
  const comment = commentResponse.data;

  const videoResponse = await VideoService.getVideoById(comment.entity_id);
  const video = videoResponse.data;

  return {
    data: {
      id: id,
      video: video.id,
      videoTitle: video.title,
      ...comment,
    },
  };
};

const insert = async ({ _data }) => {
  const videoToEditResponse = await VideoService.getVideoById(_data.video);
  const videoToEdit = videoToEditResponse.data;

  const cleanData = { ..._data };
  delete cleanData.video;

  cleanData.entity_id = videoToEdit.id;

  //   videoToEdit.link = [...(videoToEdit.link || []), cleanData];

  return await CommentService.createComment(cleanData);
};

const update = async ({ id, _data }) => {
  console.log(id, _data);
  //   const info = idSplitter(id);

  //   const videoToEditResponse = await VideoService.getVideoById(info.videoId);
  //   const videoToEdit = videoToEditResponse.data;
  //   const indexOfEditedLink = videoToEdit.link.findIndex(
  //     (link) => link.href === info.href
  //   );

  //   const cleanData = { ..._data };
  //   delete cleanData.id;

  //   videoToEdit.link[indexOfEditedLink] = cleanData;

  return await CommentService.updateComment(id, _data);
};

const toggleCommentApproval = async ({ id, _data }) => {
  console.log(id, _data);
  //   const info = idSplitter(id);

  //   const videoToEditResponse = await VideoService.getVideoById(info.videoId);
  //   const videoToEdit = videoToEditResponse.data;
  //   const indexOfEditedLink = videoToEdit.link.findIndex(
  //     (link) => link.href === info.href
  //   );

  //   const cleanData = { ..._data };
  //   delete cleanData.id;

  //   videoToEdit.link[indexOfEditedLink] = cleanData;

  return await CommentService.updateCommentStatus(id, _data);
};

const remove = async ({ id }) => {
  //   const info = idSplitter(id);

  //   const videoToEditResponse = await VideoService.getVideoById(info.videoId);
  //   const videoToEdit = videoToEditResponse.data;

  //   videoToEdit.link = videoToEdit.link.filter((link) => link.href !== info.href);

  //   return await VideoService.updateVideo(videoToEdit.id, videoToEdit);

  return await CommentService.deleteComment(id);
  console.log(id);
  // return await VideoService.deleteVideo(id);
};

const idSplitter = (id) => {
  const split = id.split("-");
  return {
    videoId: split[0],
    commentId: split[1],
  };
};
const formFieldsCrudBuilder = (videosCatalog) => [
  {
    name: "id",
    label: "ID",
    type: "input",
    value: "",
    hidden: "add, edit", // add, edit, all
    readonly: "all", // add, edit, all
    validation: null, // validation function
    props: {
      type: "text",
      placeholder: "ID",
    },
  },
  {
    label: "forms.video",
    name: "video",
    type: "select",
    readonly: "edit",
    value: "", //  single
    rules: [{ required: true, message: "Cannot be empty!" }],
    options: videosCatalog.map((x) => ({
      value: x.id,
      label: x.title,
    })),
    idName: "id",
    props: {
      placeholder: "forms.video",
      mode: "default",
    },
  },
  //   {
  //     label: "forms.approved",
  //     // validation: null, // validation function
  //     name: "approved",
  //     type: "switch",
  //     // rules: [{ required: true, message: "Cannot be empty!" }],
  //     props: {
  //       type: "switch",
  //       placeholder: "forms.approved",
  //     },
  //   },
  {
    label: "forms.nick",
    // validation: null, // validation function
    name: "nick",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.nick",
    },
  },
  {
    label: "forms.comment",
    // validation: null, // validation function
    name: "comment",
    type: "input",
    rules: [{ required: true, message: "Cannot be empty!" }],
    value: "",
    props: {
      type: "text",
      placeholder: "forms.comment",
    },
  },
];

const tableColumns = [
  //   {
  //     title: "forms.id",
  //     dataIndex: "id",
  //     render: (id, record) => id,
  //   },
  {
    title: "forms.video",
    dataIndex: "videoTitle",
    render: (videoTitle, record) => videoTitle,
  },
  {
    title: "forms.approved",
    dataIndex: "approved",
    render: (approved, record) => (approved ? "SI" : "NO"),
  },
  {
    title: "forms.nick",
    dataIndex: "nick",
    render: (nick, record) => nick,
  },
  {
    title: "forms.comment",
    dataIndex: "comment",
    render: (comment, record) => comment,
  },
];

const customUpdate = (record) => ({
  icon: record.approved ? <CloseOutlined /> : <CheckOutlined />,
  onClick: (e) =>
    toggleCommentApproval({
      id: record.id,
      _data: { approved: !record.approved },
    }),
});

const commentCrud = new CrudBuilder({
  textKeys,
  idName,
  pageSize,
  position,
  find,
  findOne,
  //   update,
  customUpdate,
  insert,
  remove,
  tableColumns,
  // formFieldsFilter,
  formFieldsCrudBuilder,
  showIdOnUpdate: false,
});
export default commentCrud;
