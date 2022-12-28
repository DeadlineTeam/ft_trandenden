import React from 'react'
import './createRoom.css'

const CancelButton = ({ handleCancel }: { handleCancel: (e:any) => void }) => {
    
    return (
        <div className="child7Cancel">
            <button className="btn" onClick={handleCancel}>
              <p>Cancel</p>
            </button>
        </div>
    )
}

export default CancelButton