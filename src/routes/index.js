import React from "react";
import { Route, Switch } from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const App = ({ match }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      {/* <Route
        path={`${match.url}`}
        component={asyncComponent(() => import("./SamplePage"))}
      /> */}
      <Route
        path={`${match.url}video/link`}
        component={asyncComponent(() => import("../pages/VideoLink"))}
      />
      <Route
        path={`${match.url}video`}
        component={asyncComponent(() => import("../pages/Video"))}
      />
      <Route
        path={`${match.url}links`}
        component={asyncComponent(() => import("../pages/Link"))}
      />
    </Switch>
  </div>
);

export default App;
