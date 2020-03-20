import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Slider, Row, Col, Input, Button } from 'antd';

class MiniSilder extends React.PureComponent {

  static propTypes = {
    value: PropTypes.number,
    config: PropTypes.object,
    onChange: PropTypes.func,
  }

  state = {
    value: 1,
    options: {
      min: 0,
      max: 1,
      step: 0.01,
    }
  }

  componentDidMount() {
    let { options } = this.state;
    const { config } = this.props;
    if (config) {
      options = {...options, ...config};
    }
    this.setState({
      options
    })
  }

  onChange = async (v) => {
    const { value, options } = this.state;
    const { handleZoom } = this.props;
    // 处理拖拽过快的问题
    let rang = Math.abs(v - value).toFixed(2) - 0;
    let len = (rang / options.step).toFixed(0) - 0;
    for(let i = 0; i < len; i++) {
      await handleZoom(v);
    }
    this.setState({
      value: v
    })
  }

  handleCommand = (e) => {
    let { value, options } = this.state;
    const max = options.max;
    const min = options.min;
    const step = options.step;
    if (e === 'minus') {
      value = (value === min) ? value : (value - step);
    } else {
      value = (value === max) ? value : (value + step);
    }
    value = value.toFixed(2) - 0;
    this.onChange(value);
  }
  
  render () {
    const { value, options } = this.state;
    const percent = Math.round(value * 10000) / 100 + '%';
    return (
      <div className="gg-slider">
        <Row>
          <Col span={3}>
            <Button type="link" 
              className="command"
              onClick={ e => this.handleCommand('minus')} size="small"  
            >
              <Icon type="minus" />
            </Button>
          </Col>
          <Col span={13}>
            <Slider 
              {...options} 
              onChange={this.onChange} 
              value={value} 
            />
          </Col>
          <Col span={3}>
            <Button type="link" 
              className="command"
              onClick={ e => this.handleCommand('plus')} size="small"  
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
}

export default MiniSilder;