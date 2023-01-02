import React from 'react';
import ProtectedLayout from './components/ProtectedLayout';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Rooms from './pages/Rooms';
import Myprofile from './pages/Myprofile';
import Settings from './pages/Settings';
import Login from "./pages/Login"
import GameComponent from './components/game/game';
import './App.css';


const App:React.FC = () => {

  return (  
    <div className="App">
      <BrowserRouter>
         <Routes>
        	<Route path="/login" element={<Login />} />
			
			<Route path="/" element={<ProtectedLayout />} >
        		<Route index={true} element={<Home/>}/>
        		<Route path="/DashBoard"element={<DashBoard/>}/>
				<Route path="/Home"element={<Home/>}/>
        		<Route path="/Rooms"element={<Rooms/>}/>
        		<Route path="/Chat"element={<Chat/>}/>
        		<Route path="/profile/:id"element={<Myprofile/>}/>
        		<Route path="/Settings"element={<Settings/>}/>
				<Route path="/Game" element= {<GameComponent/>}/>
			</Route>
			{/* we neeed a 404 page */}
			{/* <Route path="*" element={<div>404</div>} /> */}
        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;


