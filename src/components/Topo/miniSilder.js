import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Slider, Row, Col, Input, Button } from 'antd';


function MiniSilder({ config, handleZoom }) {

  let [value, setValue] = useState(1);
  let [options, changeZoomValue ] = useState({
    min: 0,
    max: 1,
    step: 0.01,
  });

  let percent;


  useEffect(() => {
    
    if (config) {
      options = {...options, ...config};
    }
    changeZoomValue(options)
  }, []);


  async function onChange(v) {
    let { step } = options;
    // 处理拖拽过快的问题
    let rang = Math.abs(v - value).toFixed(2) - 0;
    let len = (rang / step).toFixed(0) - 0;
    console.log(value, 'value')
    console.log(v, 'v')
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
    console.log(lastValue)
    onChange(lastValue);
  }
  
  percent = Math.round(value * 10000) / 100 + '%';
  
  return (
    <div className="gg-slider">
      <Row>
        <Col span={3}>
          <Button type="link" 
            className="command"
            onClick={ () => handleCommand('minus')} size="small"  
          >
            <Icon type="minus" />
          </Button>
        </Col>
        <Col span={13}>
          <Slider 
            {...options} 
            onChange={onChange} 
            value={value} 
          />
        </Col>
        <Col span={3}>
          <Button type="link" 
            className="command"
            onClick={() => handleCommand('plus')} size="small"  
          >
            <Icon type="plus" />
          </Button>
        </Col>
        <Col span={5}>
          <Input readOnly value={percent} />
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