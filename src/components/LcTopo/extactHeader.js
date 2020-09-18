import React, { useEffect, useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Icon, Button, Modal } from 'antd';
import G6 from '@antv/g6';
import MiniSilder from './miniSilder';

const MAX_ZOOM = 2;  // 缩放最大值
const MIN_ZOOM = 0.2; // 缩放最小值

// 缩放配置
const zooms = {
  min: MIN_ZOOM,
  max: MAX_ZOOM,
  step: 0.10,
  tipFormatter: null
};

/**
 * 拓扑组件入口
 * @param {*} param0 
 */
export default (props) => {
  const { hasZoom, hasScreen, graph } = props;
  const toolsExtract = [];
  const [ currentZoom, changeZoom ] = useState(1);
  const [ isScreen, toggle ] = useState(false);

  // 缩放
  function handleZoom(v) {
    changeZoom(v);
    graph.zoomTo(v)
  }

  // 全屏切换
  function toggleScreen() {
    if (isScreen) {
      const doc = document.documentElement;
      const rqtFullScreen = doc.requestFullscreen ||
        doc.webkitRequestFullScreen ||
        doc.mozRequestFullScreen ||
        doc.msRequestFullscreen;
      rqtFullScreen.call(doc);
    } else {
      const exitFullScreen = document.exitfullscreen ||
        document.mozCancelFullScreen ||
        document.webkitCancelFullScreen ||
        document.cancelFullScreen;
      exitFullScreen.call(document);
    }
    toggle(!isScreen);
  }

  if (hasZoom) {
    toolsExtract.push(
      <li key="mini">
        <MiniSilder
          handleZoom={handleZoom}
          config={zooms}
        />
      </li>
    );
  }

  if (hasScreen) {
    toolsExtract.push(
      <li key="l">
        <Button className="screen-button"
          type="link"
          onClick={toggleScreen}
        >
          <Icon type={!isScreen ? "fullscreen" : "fullscreen-exit"} />
        </Button>
      </li>
    );
  }
  
  return (
    <div className="custopo-header">
      <ul>
        {toolsExtract}
      </ul>
    </div>
  )
};