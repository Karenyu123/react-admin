import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import zhCN from 'antd/es/locale/zh_CN'
import store from './redux/store'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
  ,
  document.getElementById('root'));


serviceWorker.unregister();
