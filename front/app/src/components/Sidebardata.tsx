import {AiOutlineHome} from 'react-icons/ai'
import {MdOutlineLeaderboard} from 'react-icons/md'
import {MdOutlineGroups} from 'react-icons/md' 
import {RiAccountCircleLine} from 'react-icons/ri'
import {BsChatLeftText} from 'react-icons/bs' 
import {AiOutlineSetting} from 'react-icons/ai'

export const Sidebardata=[
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