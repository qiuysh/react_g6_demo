import React from 'react';
import { action } from '@storybook/addon-actions';
import MiniSilder from '../components/Topo/miniSilder';
import 'antd/dist/antd.css';

const zooms = {
  min: 0.3,
  max: 2,
  step: 0.10,
  tipFormatter: null
};

export default {
  title: '缩放组件',
  component: MiniSilder,
};

export const Text = () => <MiniSilder handleZoom={action('clicked')} config={zooms}/>;
