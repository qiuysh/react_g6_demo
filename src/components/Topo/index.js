import React, { useEffect, useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import G6 from '@antv/g6';
import MiniSilder from './miniSilder';
import ToolBar from './toolBar';

import './defaultLayout';
import './lineEdge';
import './style.less';

// 声明全局global_graph对象
let global_graph = null;

const MAX_ZOOM = 2;  // 缩放最大值
const MIN_ZOOM = 0.2; // 缩放最小值
const defultLableColor = '#128EE9';

// 缩放配置
const zooms = {
  min: MIN_ZOOM,
  max: MAX_ZOOM,
  step: 0.10,
  tipFormatter: null
};

TopoFlow.propTypes = {
  data: PropTypes.object,
  isFullScreen: PropTypes.bool, 
  handleNodeClick: PropTypes.func,
  toggleScreen: PropTypes.func,
}

/**
 * 拓扑组件入口
 * @param {*} param0 
 */
function TopoFlow({data, isFullScreen, handleNodeClick, toggleScreen}) {

  const ref = useRef(null);

  let refContainer = null;

  const localSize = JSON.parse(localStorage.getItem('topo-layout-size'))||{};

  const [ currentZoom, changeZoom ] = useState(1);

  const [ radius, changeRadius] = useState({
    TOPORADIUSX: localSize.x || 300,
    TOPORADIUSY: localSize.y || 300
  });

  const [ canvas, changeCanvas ] = useState({
    width: 0,
    height: 0
  });


  useEffect(() => {
    // 获取数据
    const topo = async () => {
      await resizeContainer();
      if (global_graph) {
        renderTopo();
      } else {
        initialConfig();
      }
    }
    topo();
  }, [data]);



  function resizeContainer() {
    refContainer = findDOMNode(ref.current);
    const { width, height } = refContainer.getBoundingClientRect();
    changeCanvas({ width, height });
  }


  function setCanvas() {
    if (global_graph) {
      const { width, height } = canvas;
      // 修改大小
      global_graph.changeSize(width, height);
    }
  }

  // 初始化拓扑配置
  function initialConfig () {
    const { TOPORADIUSX, TOPORADIUSY } = radius;

    if (!global_graph) {
      // 默认布局配置
      const defaultLayout = {
        type: 'default-layout',
        radiusX: TOPORADIUSX || 300, // 必须
        radiusY: TOPORADIUSY || 300, // 必须
        ordering: 'topology',
        angleRatio: 1,
      }

      try {
        global_graph = new G6.Graph({
          container: refContainer,
          animate: false,
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          modes: {
            default: [
              'drag-node',
              'drag-canvas',
            ],
          },
          fitView: false,
          layout: defaultLayout,
          nodeStateStyles: {
            hover: {
              lineWidth: 3,
              fillOpacity: 1
            },
            inhover: {
              opacity: 0.2
            }
          },
          edgeStateStyles: {
            hover: {
              lineWidth: 3
            }
          }
        });

        // 设置节点
        global_graph.node(node => {
          node.size = [70, 70]; // 节点大小
          node.shape = "circle";  // 节点形状circle、rect
          node.style = {
            fill: isFullScreen ? '#0D1731' : '#fff',  // 节点背景颜色
            lineWidth: 2.3,                           // 节点边框粗细
            stroke: defultLableColor,                 // 节点边框颜色
            radius: 20,           // 节点边框圆角
            opacity: 1
          }
          node.labelCfg = {
            style: {
              fill: isFullScreen ? '#f4f4f4' : '#333',  // 节点文案颜色
              fontSize: 12,                             // 节点文案字体大小
            }
          }
          return node;
        });

        // 设置边配置
        global_graph.edge(edge => {
          edge.shape = 'line-running';  // 边的形状
          if (edge.source === edge.target) {
            edge.shape = 'loop'
            edge.loopCfg = {
              dist: 30,
            }
          }
          edge.style = {
            lineWidth: 1.5, // 边的粗细
            stroke: '#ccc',  // 边的颜色
            endArrow: {     // 箭头
              path: 'M 4,0 L -4,-4 L -4,4 Z',
              d: 4
            },
          }
          edge.labelCfg = {
            autoRotate: true,  // 文案自动反转
            style: {
              fill: '#4fa2de',    // 文案颜色
            }
          }
          return edge;
        });


        // 绑定节点单击事件
        global_graph.on('node:click', handleNodeClick);

        // 监听节点鼠标事件
        global_graph.on('node:mouseenter', ev => {
          const node = ev.item;
          const edges = node.getEdges();
          edges.forEach(edge => global_graph.setItemState(edge, 'running', true));
        });

        global_graph.on('node:mouseleave', ev => {
          const node = ev.item;
          const edges = node.getEdges();
          edges.forEach(edge => global_graph.setItemState(edge, 'running', false));
        });

        // 渲染数据
        renderTopo();

      } catch (error) {
        console.log(error)
      }
      
    }
    
  }


  // 渲染数据
  function renderTopo() {
    const { TOPORADIUSX, TOPORADIUSY } = radius;
    const { width, height } = canvas;
    const x = width / 2; 
    const y = (height - 40) / 2;
    
    // 改变画布大小
    setCanvas();

    // 非默认布局的渲染
    global_graph.changeData(data);

    global_graph.updateLayout({
      radiusX: TOPORADIUSX,
      radiusY: TOPORADIUSY
    })
     // 中心定位
    global_graph.zoomTo(currentZoom, { x: 0, y: 0 });
    // 移动到原点
    global_graph.moveTo(x, y);
  }

  // 缩放
  function handleZoom(v) {
    changeZoom(v);
    global_graph.zoomTo(v)
  }

  function handleRaduisChange(e, value) {
    let x = radius.TOPORADIUSX, 
      y = radius.TOPORADIUSY;

    if (e === 'x') {
      x = value;
    } else {
      y = value;
    }

    changeRadius({
      TOPORADIUSX: x, 
      TOPORADIUSY: y
    });

    global_graph.updateLayout({
      radiusX: x, // 必须
      radiusY: y
    })

    localStorage.setItem('topo-layout-size', JSON.stringify({ x, y }));
  }

  const toolBarProps = {
    xR: radius.TOPORADIUSX,
    yR: radius.TOPORADIUSY,
    handleChange: handleRaduisChange
  };

  return (
    <div className="gg-flow">
      <MiniSilder
        handleZoom={handleZoom}
        config={zooms}
      />
      <ToolBar 
        {...toolBarProps}
      />
      <Button className="screen-button"
        type="link"
        onClick={toggleScreen}
      >
        <Icon type={!isFullScreen ? "fullscreen" : "fullscreen-exit"} />
      </Button>
      <div className="flow-canvas"
        ref={ref} 
      >
        { data && Object.keys(data).length === 0 && <Loading />}
        { data && data.nodes && data.nodes.length === 0 && <div className="no-empty">暂无数据</div>}
      </div>
    </div>
  )
}

export default TopoFlow;


function Loading() {
  return <div className="m-loadingpage" style={{ position: 'absolute', top: '50%', left: '50%' }} >
    <div className="content" style={{ margin: '-50% auto auto -50%' }}>
        <Icon type="loading" style={{ fontSize: 78, color: '#999' }} />
    </div>
  </div>
}

