import React from "react";
import { Route } from "react-router";
import App from "./app";
import Topo from "./pages/Topo";
import CusTopo from "./pages/CusTopo";

const Routers = (
 <Route path="/" component={App}>
    <Route path="topo" component={Topo} />
    <Route path="custopo" component={CusTopo} />
  </Route>
);

export default Routers;