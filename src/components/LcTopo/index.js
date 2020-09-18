import React, { useEffect, useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Icon, Button, Modal } from 'antd';
import G6 from '@antv/g6';
import ExtactHeader from './extactHeader';
import './custemEdge';
import './custemNode';
import './style.less';

// 声明全局global_graph对象
let global_graph = null;

const defultLableColor = '#21A675';
const MAX_ZOOM = 2;  // 缩放最大值
const MIN_ZOOM = 0.2; // 缩放最小值


/**
 * 拓扑组件入口
 * @param {*} param0 
 */
export default (props) => {

  const { data } = props;

  const ref = useRef(null);

  let refContainer = null;
  const [ canvas, changeCanvas ] = useState({
    width: 0,
    height: 0
  });


  const menu = new G6.Menu({
    className: "tool-util",
    offsetX: 16 + 10,
    offsetY: -26,
    itemTypes: ['node', 'edge'],
    container: document.body,
    getContent: (evt) => { // 自定义 menu 内容
      const type = evt.item.getType();
      const outDiv = document.createElement('div');
      outDiv.innerHTML = type === "node" ? `
        <ul class="node-menu">
          <li><a key="link">l</a></li>
          <li><a key="editor">m</a></li>
          <li><a key="delete">d</a></li>
        </ul>
      ` : 
      ` <ul class="edge-menu">
          <li><a key="editor">m</a></li>
          <li><a key="delete">d</a></li>
        </ul>
      `;
      return outDiv;
    },
    handleMenuClick(target, item) {
      const type = target.getAttribute("key");
      const model = item.getModel();
      if (type === "delete") {
        global_graph.removeItem(item, false);
      }
      if (type === "link") {
        console.log("连接");
      }
      if (type === "editor") {
        console.log("编辑");
      }
    },
  })


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

    if (!global_graph) {
      // 默认布局配置
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
              'create-edge',
            ],
            
          },
          plugins: [ menu ],
          fitView: true,
          renderer: 'svg',
          layout: {
            type: 'dagre',
            rankdir: 'TB',
            nodesep: 45,
            ranksep: 45,
            controlPoints: true,
          }
        });

        // 设置节点
        global_graph.node(node => {
          node.size = [70, 70]; // 节点大小
          node.type = "dom-node";  // 节点形状circle、rect
          node.style = {
            fill: defultLableColor,  // 节点背景颜色
            lineWidth: 2.3,                           // 节点边框粗细
            stroke: defultLableColor,                 // 节点边框颜色
            opacity: 1
          };
          node.labelCfg = {
            position: 'bottom',
            style: {
              fill: '#333',  // 节点文案颜色
              fontSize: 12,                             // 节点文案字体大小
            }
          };
          node.icon = {
            show: true,
            img: 'https://gw.alipayobjects.com/zos/basement_prod/012bcf4f-423b-4922-8c24-32a89f8c41ce.svg',
            width: 27,
            height: 27,
          };
          return node;
        });

        // 设置边配置
        global_graph.edge(edge => {
          edge.shape = 'line';  // 边的形状
          edge.style = {
            lineWidth: 2.3, // 边的粗细
            stroke: '#ccc',  // 边的颜色
            endArrow: {     // 箭头
              path: G6.Arrow.vee(8, 10, 3),
              d: 3
            },
          }
          return edge;
        });


        global_graph.on('node:click', e => {
          const node = e.item;
          console.log(node)
        });
        // 绑定节点hover事件
        global_graph.on('node:mouseenter', e => {
          const node = e.item;
          const model = node.getModel();
          model.oriLabel = model.label;
          global_graph.updateItem(node, {
            style: {
              stroke: defultLableColor,
            },
          });
        });

        global_graph.on('node:mouseleave', e => {
          const node = e.item;
          const model = node.getModel();
          model.oriLabel = model.label;
          global_graph.updateItem(node, {
            style: {
              stroke: defultLableColor,
            },
          });
        });

        // 监听节点鼠标事件
        global_graph.on('aftercreateedge', e => {
          const edges = global_graph.save().edges;
          G6.Util.processParallelEdges(edges);
          global_graph.getEdges().forEach((edge, i) => {
            global_graph.updateItem(edge, edges[i])
          })
        })
        // 渲染数据
        renderTopo();
      } catch (error) {
        console.log(error)
      }
    }
  }


  // 渲染数据
  function renderTopo() {
    // 改变画布大小
    setCanvas();
    // 非默认布局的渲染
    global_graph.changeData(data);
    // 移动到原点
    global_graph.fitCenter();
  }

  return (
    <div className="custopo-flow">
      <ExtactHeader 
        {...props}
        graph={global_graph}
      />
      <div className="flow-canvas"
        ref={ref} 
      >
        { data && Object.keys(data).length === 0 && <Loading />}
        { data && data.nodes && data.nodes.length === 0 && <div className="no-empty">暂无数据</div>}
      </div>
    </div>
  )
};


function Loading() {
  return <div className="m-loadingpage" style={{ position: 'absolute', top: '50%', left: '50%' }} >
    <div className="content" style={{ margin: '-50% auto auto -50%' }}>
        <Icon type="loading" style={{ fontSize: 78, color: '#999' }} />
    </div>
  </div>
}

