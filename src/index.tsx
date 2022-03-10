import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Page1 } from './pages/Page1';
import { Page2 } from './pages/Page2';

export var MyServiceContext = React.createContext<(() => string) | null>(null);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <h1>Dependency Injection</h1>
        <nav
          style={{
            borderBottom: 'solid 1px',
            paddingBottom: '1rem',
          }}
        >
          <Link to="/">Home</Link> | <Link to="/page1">Page1</Link> | <Link to="/page2">Page2</Link>
        </nav>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="page1"
            element={
              <MyServiceContext.Provider value={() => 'Hello page 1'}>
                <Page1 />
              </MyServiceContext.Provider>
            }
          />
          <Route
            path="page2"
            element={
              <MyServiceContext.Provider value={() => 'Hello page 2'}>
                <Page2 />
              </MyServiceContext.Provider>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
