import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { store } from './app/store';
import { Provider } from 'react-redux';

// creates a React root to manage the rendering of your application at DOM element with the ID of root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( // display your React component tree inside the root element
  <React.StrictMode> {/* tool for highlighting potential problems in an application. It activates additional checks and warnings for its descendants during development */}
    <Provider store={store}> {/*allowes nested comps. to access Redux store*/}
    <BrowserRouter> {/*allows your application to handle routing*/}
      <Routes> {/*container for all your route definitions*/}
        <Route path="/*" element={<App />} /> {/*on any path render App comp.*/}
      </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
