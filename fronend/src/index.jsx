import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import {createGlobalStyle} from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer.index";
import 'bootstrap/dist/css/bootstrap.min.css';
import Posts from "./pages/Posts";

const root = ReactDOM.createRoot(document.getElementById('root'));
const GlobalStyle = createGlobalStyle`
    * {
      font-family: 'Trebuchet MS', Helvetica, sans-serif;
    }
    body {
      margin: 0;
    }
`

root.render(
  <React.StrictMode>
      <Router>
          <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/posts" exact element={<Posts />} />
          </Routes>
          <Footer />
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
