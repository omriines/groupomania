import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import {createGlobalStyle} from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import Posts from "./pages/Posts";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

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
            <Route path="/signin" exact element={<Signin />} />
            <Route path="/signup" exact element={<Signup />} />
          </Routes>
          <Footer />
      </Router>
  </React.StrictMode>
);


reportWebVitals();
