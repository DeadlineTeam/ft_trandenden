import React from 'react'
import './createRoom.css'

const SaveButton = ({ handleSubmit }: { handleSubmit: (e:any) => void}) => {
    return (
        <div className="child7Save">
            <button className="btn1" type="submit" onClick={handleSubmit}>
              <p>Save</p>
            </button>
        </div>
    )
}

export default SaveButton