import React from 'react';
import { findDOMNode } from 'react-dom';
import { Icon, Button } from 'antd';
import G6 from '@antv/g6';
import isEqual from 'lodash/isEqual';
import MiniSilder from './miniSilder';
import ToolBar from './toolBar';
import PropTypes from 'prop-types';

import './defaultLayout';
import './lineEdge';
import './style.less';

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


export default class GGFlow extends React.Component{

  static propTypes = {
    data: PropTypes.object,
    height: PropTypes.number,
    handleNodeClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.graph = null;
    const size = JSON.parse(localStorage.getItem('topo-layout-size'))||{};
    this.state = {
      currentZoom: 1,
      TOPORADIUSX: size.x || 300,
      TOPORADIUSY: size.y || 300,
      width: null,
      height: null
    }
  }

  componentDidMount() {
    this.initialTopo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps, this.props)) {
      // console.log(prevProps, this.props)
      if (isEqual(prevProps.isFullScreen, this.props.isFullScreen)) {
        this.resizeCanvas();
      }
      this.renderTopo();
    }
  }

  resizeCanvas = () => {
    const $g6flow = findDOMNode(this.$flow);
    const { width, height } = $g6flow.getBoundingClientRect();
    this.setState({
      width,
      height
    }, () => {
      // console.log(width, height)
      // 修改大小
      this.graph.changeSize(width, height);
      
    })
  }

  // 初始化拓扑配置
  initialTopo = () => {
    const { isFullScreen, handleNodeClick } = this.props;
    const { TOPORADIUSX, TOPORADIUSY } = this.state;
    const $g6flow = findDOMNode(this.$flow);
    const { width, height } = $g6flow.getBoundingClientRect();
    if (!this.graph) {
      // 默认布局配置
      const defaultLayout = {
        type: 'default-layout',
        radiusX: TOPORADIUSX || 300, // 必须
        radiusY: TOPORADIUSY || 300, // 必须
        ordering: 'topology',
        angleRatio: 1,
      }
      
      this.graph = new G6.Graph({
        container: this.$flow,
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
      this.graph.node(node => {
        // node.size = [170, 42]; // 节点大小
        node.size = [70, 70]; // 节点大小
        // node.shape = "rect";  // 节点形状
        node.shape = "circle";  // 节点形状
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
      this.graph.edge(edge => {
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

      // 修改大小
      this.graph.changeSize(width, height);

      // 绑定节点单击事件
      this.graph.on('node:click', handleNodeClick);

      // 监听节点鼠标事件
      this.graph.on('node:mouseenter', ev => {
        const node = ev.item;
        const edges = node.getEdges();
        edges.forEach(edge => this.graph.setItemState(edge, 'running', true));
      });

      this.graph.on('node:mouseleave', ev => {
        const node = ev.item;
        const edges = node.getEdges();
        edges.forEach(edge => this.graph.setItemState(edge, 'running', false));
      });

      // 渲染数据
      this.renderTopo();
    }
    
  }

  refreshDragedNodePosition = (e) => {
    const model = e.item.getModel();
    model.fx = e.x;
    model.fy = e.y;
  }

  // 渲染数据
  renderTopo = () => {
    const { currentZoom, width, height, TOPORADIUSX, TOPORADIUSY } = this.state;
    const { data } = this.props;
    // 非默认布局的渲染
    this.graph.changeData(data);
    this.graph.updateLayout({
      radiusX: TOPORADIUSX,
      radiusY: TOPORADIUSY
    })
    // console.log(width, height)
     // 中心定位
    this.graph.zoomTo(currentZoom, { x: width / 2, y: height / 2});
  }

  // 缩放
  handleZoom = (v) => {
    this.setState({
      currentZoom: v
    }, () => {
      this.graph.zoomTo(v)
    })
  }

  handleChange = (e, value) => {
    let { TOPORADIUSX, TOPORADIUSY } = this.state;
    if (e === 'x') {
      TOPORADIUSX = value;
    } else {
      TOPORADIUSY = value;
    }
    this.setState({
      TOPORADIUSX,
      TOPORADIUSY,
    }, () => {
      this.graph.updateLayout({
        radiusX: TOPORADIUSX, // 必须
        radiusY: TOPORADIUSY
      })
      localStorage.setItem('topo-layout-size', JSON.stringify({x: TOPORADIUSX, y: TOPORADIUSY}))
    })
  }

  render () {
    const { data, toggleScreen, isFullScreen } = this.props;
    const { TOPORADIUSX, TOPORADIUSY } = this.state;
    const toolBarProps = {
      xR: TOPORADIUSX,
      yR: TOPORADIUSY,
      handleChange: this.handleChange
    };
    return (
    <div className="gg-flow">
      <MiniSilder 
        handleZoom={this.handleZoom}
        config={zooms}
      />
      <ToolBar {...toolBarProps} />
      <Button className="screen-button" type="link" onClick={toggleScreen}><Icon type={!isFullScreen ? "fullscreen": "fullscreen-exit" } /></Button>
      <div className="flow-canvas"
        ref={ e => this.$flow = e} 
      >
        { data && Object.keys(data).length === 0 && <Loading />}
        { data && data.nodes && data.nodes.length === 0 && <div className="no-empty">暂无数据</div>}
      </div>
    </div>)
  }
}


function Loading() {
  return <div className="m-loadingpage" style={{ position: 'absolute', top: '50%', left: '50%' }} >
    <div className="content" style={{ margin: '-50% auto auto -50%' }}>
        <Icon type="loading" style={{ fontSize: 78, color: '#999' }} />
    </div>
  </div>
}

