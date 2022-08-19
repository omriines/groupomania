import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Header from './components/Header'
import Footer from './components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import Posts from './pages/Posts'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import MyPosts from './pages/MyPosts'
import Edit from './pages/MyPosts/edit'
import Create from './pages/MyPosts/create'
import { UserProvider } from './utils/context/user'

const root = ReactDOM.createRoot(document.getElementById('root'))
const GlobalStyle = createGlobalStyle`
* {
font-family: 'Trebuchet MS', Helvetica, sans-serif;
}
body {
margin: 0;
}
.card-body img {
width: 100%;
height: 160px;
margin-bottom:15px
}
.margin-top-30 {
margin-top:30px
}
.margin-left-20 {
margin-left:20px
}

@media screen and (max-width: 576px) {
margin-left-20 : 0px !important;
margin-top 10px !important;
}

`

root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/posts" exact element={<Posts />} />
          <Route path="/myposts">
            <Route path="" element={<MyPosts />} />
            <Route path=":message" element={<MyPosts />} />
          </Route>
          <Route path="/myposts/edit/:idPost" exact element={<Edit />} />
          <Route path="/myposts/create" exact element={<Create />} />
          <Route path="/signin" exact element={<Signin />} />
          <Route path="/signup" exact element={<Signup />} />
        </Routes>
        <Footer />
      </UserProvider>
    </Router>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
