import React from 'react';

import ProtectedLayout from './components/ProtectedLayout';
import {
  BrowserRouter ,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Rooms from './pages/Rooms';
import Myprofile from './pages/Myprofile';
import Settings from './pages/Settings';
import Searchbar from './components/Searchbar';
import Bookdata from "./data.json"
import Login from "./pages/Login"
import Sidebar2 from './components/Sidebar2';
import Sidelayout from './components/Sidelayout';
   /*   <ProtectedLayout body={<Searchbar placeholder="Enter usernaame" data={Bookdata}/>}/>
      <ProtectedLayout body={<Sidebar/>}/>*/

const App:React.FC = () => {
  return (  
    <div className="App">
      <BrowserRouter>
      <ProtectedLayout body={<Sidebar2  placeholder="Enter usernaame" data={Bookdata}/>}/>
         <Routes>
         <Route path="/" element={<Login />} />
          <Route path="/Home"element={<Home/>}/>
          <Route path="/DashBoard"element={<DashBoard/>}/>
          <Route path="/Rooms"element={<Rooms/>}/>
          <Route path="Chat/"element={<Chat/>}/>
          <Route path="/Myprofile"element={<Myprofile/>}/>
          <Route path="/Settings"element={<Settings/>}/>
        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
