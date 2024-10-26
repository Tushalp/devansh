// import logo from './logo.svg';
import './App.css';
// import { Button} from '@chakra-ui/react'
import { Homepage } from './Component/Homepage';
import { Chatapage } from './Component/Chatapage';
import { Addmember } from './Component/Addmember';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { Login } from './Authentications/Login';


function App() {

  return (
    <div className="App">
         <Routes>
          <Route path="/" element={<Homepage/>} exact ></Route>
          <Route path="/chats" element={<Chatapage></Chatapage>}></Route>
          <Route path="/Addmember" element={<Addmember/>}></Route>
          <Route path="/login" element={<Login/>}/>
          
          
       </Routes>
    </div>
  );
}

export default App;
