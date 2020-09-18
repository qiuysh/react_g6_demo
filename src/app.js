import React from "react";
import { Layout } from "antd";
import { Link } from "react-router";

export default (props) => {
  return (
    <div>
      <div>
        <Link to="/topo" >拓扑1</Link>
        <Link to="/custopo" >拓扑2</Link>
      </div>
      <Layout>
        {props.children}
      </Layout>
    </div>
  )
}