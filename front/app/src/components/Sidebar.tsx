import {AiOutlineHome} from 'react-icons/ai'
import {MdOutlineLeaderboard} from 'react-icons/md'
import {MdOutlineGroups} from 'react-icons/md' 
import {RiAccountCircleLine} from 'react-icons/ri'
import {BsChatLeftText} from 'react-icons/bs' 
import {AiOutlineSetting} from 'react-icons/ai'
import {AiOutlineBars} from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import {useState} from 'react'


type ButtonProps = {
    children: React.ReactNode;
    
}
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () =>setIsOpen(!isOpen);
    const menuItem=[
        {
            path:"/Home",
            name:"Home",
            icon:<AiOutlineHome/>
        },
        {
            path:"/DashBoard",
            name:"DashBoard",
            icon:<MdOutlineLeaderboard/>
        },
        {
            path:"/Rooms",
            name:"Rooms",
            icon:<MdOutlineGroups/>
        },
        {
            path:"/Chat",
            name:"Chat",
            icon:<BsChatLeftText/>
        },
        {
            path:"/Myprofile",
            name:"Myprofile",
            icon:<RiAccountCircleLine/>
        }, 
        {
            path:"/Settings",
            name:"Settings",
            icon:<AiOutlineSetting/>
        }, 
    ];
  return (
        <div  style = {{width: isOpen ? "15vw" : "3vw"}}className="sidebar">
            <div className="top-section">
                <h1 style = {{display: isOpen ? "block" : "none"}} className="logo"></h1>
                <div style = {{marginLeft: isOpen ? "80%" : "0%"}}className="bars">
                    <AiOutlineBars onClick={toggle}/>
                </div>
            </div>
            {
            menuItem.map((item, index) => (
                <NavLink to={item.path} key={index} className="link" >
                        <div className='icon'>{item.icon}</div>
                        <div style = {{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                </NavLink>

            ))
}
        </div>
  )
}

export default Sidebar