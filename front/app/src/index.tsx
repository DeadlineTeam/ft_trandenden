import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
	// problem in developement mode 
	// components keep rerendring
	//   <React.StrictMode>
    <App />
//   </React.StrictMode>
);

reportWebVitals();
