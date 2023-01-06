import '../../pages/Chat.css'
import {GiGamepad} from 'react-icons/gi'

const TopBar = (props:any) => {
    return (
        <>
            <div className='roomfriendinfo'>
                <img className='chatimg' src={props.data.senderAvatar}/>
                <p className='friendroomusername'>{props.data.senderUserName}</p>
                <button className='gamebutton'>
                    <GiGamepad className='gameicon'/>
                </button>
            </div>
            <hr className='usernameline'></hr>
        </>
    )
}

export default TopBar
