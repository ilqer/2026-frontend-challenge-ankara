import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML += '<div style="background: red; color: white; padding: 20px; z-index: 9999; position: fixed; top: 0; left: 0; width: 100%; word-break: break-all;"><b>Error:</b> ' + msg + '<br><b>URL:</b> ' + url + '<br><b>Line:</b> ' + lineNo + '<br><b>Column:</b> ' + columnNo + '<br><b>Stack:</b> ' + (error ? error.stack : '') + '</div>';
  return false;
};
try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (e) {
  document.body.innerHTML += '<div style="background: black; color: red;">CATCH: ' + e.message + '</div>';
}
