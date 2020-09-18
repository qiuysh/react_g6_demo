import React, { useState, useEffect } from 'react';
import { message, Layout } from 'antd';
import Lctopo from '@components/LcTopo';
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


function LcTopo() {
  let timer = null;
  let [ data, getData ] = useState({ nodes:[], edges: []});
  let [ isFullScreen, toggle ] = useState(false);
  let [ count, setCount ] = useState(0);
  async function fetchTopo () {
    const res = await getTopo();
    if (res.resultCode === 1) {
      getData(res.data);
    } else {
      message.error(res.resultMessage);
    }
  }

  useEffect(() => {
    // 获取数据
    fetchTopo();
  }, []);


  return (
    <Layout>
      <Lctopo 
        data={data}
        handleNodeClick={handleNodeClick}
        hasZoom={true}
        hasScreen={true}
      />
    </Layout>
  );
}

export default LcTopo;
