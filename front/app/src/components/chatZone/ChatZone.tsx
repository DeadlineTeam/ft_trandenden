import './ChatZone.css'


const Message = ({own, message}:any) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img alt="Snake" loading="lazy" className="messageImg" src={message.senderAvatar}  />
                <p className="messageText">
                    {message.content}
                </p>
            </div>
        </div>
    )
}

export default Message