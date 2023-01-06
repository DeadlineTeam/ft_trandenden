import '../../pages/Chat.css'
import {GiGamepad} from 'react-icons/gi'

const TopBar = (data:any) => {
    return (
        <>
            <div className='roomfriendinfo'>
                <img className='chatimg' src={require('../../SolidSnake.png')}/>
                <p className='friendroomusername'> Flen Ben Flen</p>
                <button className='gamebutton'>
                    <GiGamepad className='gameicon'/>
                </button>
            </div>
            <hr className='usernameline'></hr>
        </>
    )
}

export default TopBar
