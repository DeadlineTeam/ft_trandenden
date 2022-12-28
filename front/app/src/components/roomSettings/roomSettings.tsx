import React from 'react'
import './roomSettings.css'
import SaveButton from '../createRoom/saveButton'
import CancelButton from '../createRoom/cancelButton'
import {useNavigate} from 'react-router-dom'

const RoomSettings = () => {

    const navigate = useNavigate();
  const handleCancel = (e:any) => {
    navigate('/Chat');
  };
    return (
        <form className="container">
            <div className="child1">
                <div className="child1Title">Room Settings</div>
            </div>
            <div className="child3">
                <p>Members :</p>
                <div className="child3SelectMembers">
                    <div className="member">
                        <img className="memberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="memberName">Solid Snake</span>
                    </div>
                    <div className="member">
                        <img className="memberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="memberName">Solid Snake</span>
                    </div>
                    <div className="member">
                        <img className="memberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="memberName">Solid Snake</span>
                    </div>
                    <div className="member">
                        <img className="memberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="memberName">Solid Snake</span>
                    </div>
                    <div className="member">
                        <img className="memberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="memberName">Solid Snake</span>
                    </div>
                </div>
            </div>
            <div className="child4">
                <p>Add Members :</p>
                <div className="child4SelectMembers">
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                    <div className="addMember">
                        <img className="addMemberImg" src={require('../../SolidSnake.png')} alt="Snake"/>
                        <span className="addMemberName">Solid Snake</span>
                        <button><img src={require('../../addIcon.png')} alt="" /></button>
                    </div>
                </div>
            </div>
            <div className="child5">
                <CancelButton handleCancel={handleCancel}/>
                <div className="child5Save">
                    <button className="btn">
                        <p>Save</p>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default RoomSettings