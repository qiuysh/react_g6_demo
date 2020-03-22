/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { message, Layout } from 'antd';
import TopoFlow from '@components/Topo';
import classNames from 'classnames';
import { getTopo } from './service';
import './style.less';

const TIMERANGE = 5000;

/**
 * 点击事件
 * @param {} e 
 */
function handleNodeClick (e){
  const model = e.item.getModel();
  message.destroy();
  message.info(model.label);
}


function App() {
  let timer = null;
  let [ data, getData ] = useState({ nodes:[], edges: []});
  let [ isFullScreen, toggle ] = useState(false);
  let [ count, setCount ] = useState(0);

  // 切换全屏
  function handleToggle() {
    let isScreen = !isFullScreen;
    if (isScreen) {
      const doc = document.documentElement;
      const rqtFullScreen = doc.requestFullscreen ||
        doc.webkitRequestFullScreen ||
        doc.mozRequestFullScreen ||
        doc.msRequestFullscreen;
      rqtFullScreen.call(doc);
      setCount(count+1);
    } else {
      const exitFullScreen = document.exitfullscreen ||
        document.mozCancelFullScreen ||
        document.webkitCancelFullScreen ||
        document.cancelFullScreen;
      exitFullScreen.call(document);
    }
    toggle(isScreen);
  }

  async function fetchTopo () {
    const res = await getTopo();
    if (res.result_code === 1) {
      getData(res.data);
    } else {
      message.error(res.result_message);
    }
  }

  useEffect(() => {
    // 获取数据
    fetchTopo();

    if (isFullScreen) {
      timer = setInterval(() => {
        setCount(count + 1);
      }, TIMERANGE);
    }
    return () => timer && clearInterval(timer);
  }, [count]);


  return (
    <Layout
      className={classNames('', {
        "s-fullscreen": isFullScreen
      })}
    >
      <TopoFlow 
        isFullScreen={isFullScreen}
        data={data} 
        handleNodeClick={handleNodeClick}
        toggleScreen={handleToggle}
      />
    </Layout>
  );
}

export default App;
