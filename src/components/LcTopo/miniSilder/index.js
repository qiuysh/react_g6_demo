import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col, Button } from 'antd';
import './style.less';

function MiniSilder({ config, handleZoom }) {

  let [value, setValue] = useState(1);
  let [options, changeZoomValue ] = useState({
    min: 0,
    max: 1,
    step: 0.01,
  });


  useEffect(() => {
    if (config) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      options = {...options, ...config};
    }
    changeZoomValue(options)
  }, []);


  async function onChange(v) {
    let { step } = options;
    // 处理拖拽过快的问题
    let rang = Math.abs(v - value).toFixed(2) - 0;
    let len = (rang / step).toFixed(0) - 0;
    for(let i = 0; i < len; i++) {
      await handleZoom(v);
    }
    setValue(v)
  }

  function handleCommand(e) {
    // debugger
    let { max, min, step } = options;
    let lastValue = value;
    if (e === 'minus') {
      lastValue = (lastValue === min) ? lastValue : (lastValue - step);
    } else {
      lastValue = (lastValue === max) ? lastValue : (lastValue + step);
    }
    lastValue = lastValue.toFixed(2) - 0;
    onChange(lastValue);
  }
  
  return (
    <div className="custopo-slider">
      <Row>
        <Col span={12}>
          <Button type="link" 
            className="command"
            onClick={() => handleCommand('plus')} size="small"  
          >
            <Icon type="plus" />
          </Button>
        </Col>
        <Col span={12}>
          <Button type="link" 
            className="command"
            onClick={ () => handleCommand('minus')} size="small"  
          >
            <Icon type="minus" />
          </Button>
        </Col>
      </Row>
    </div>
  )
}

MiniSilder.propTypes = {
  config: PropTypes.object,
  handleZoom: PropTypes.func,
}


export default MiniSilder;