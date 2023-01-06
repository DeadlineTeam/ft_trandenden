import './ChatZone.css'


const Message = ({own, message}:any) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={message.senderAvatar} alt="Snake" />
                <p className="messageText">
                    {message.content}
                </p>
            </div>
            <div className="messageBottom">
                Sometimes Ago
            </div>
        </div>
    )
}

export default Message