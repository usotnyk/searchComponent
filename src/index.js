import "@babel/polyfill";
import 'core-js';
import 'raf/polyfill';
// import 'js-polyfills/polyfill';
import Search from './components/search.js';
import ReactDOM from 'react-dom';
import React from 'react';

const showSearchTemplate = (element, langExt) => {
  ReactDOM.render(<Search lang={langExt}/>,
    element);
};

module.exports = showSearchTemplate;