import Header from './Header';
import Footer from './Footer';
import Signin from './Signin';
import Signup from './Signup';
import Post from './Post';
import {Routes , Route} from 'react-router-dom'

function App() {
    return (
    <div>
      <Header />
      <Routes>  
        <Route path="/" element={<Signin />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/post" element={<Post />}/>
      </Routes>
      <Footer />
      </div>
      )
}

export default App