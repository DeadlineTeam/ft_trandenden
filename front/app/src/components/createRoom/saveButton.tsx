import React from 'react'
import './createRoom.css'

const SaveButton = ({ handleSubmit, formIsFilled }: { handleSubmit: (e:any) => void, formIsFilled: () => boolean}) => {
    const handleSave = (e:any) => {
        e.preventDefault();
        if (formIsFilled()) {
            handleSubmit(e);
        } else {
            console.log("form not fully filled");
        }
    }
    return (
        <div className="child7Save">
            <button className="btn" type="submit" onClick={handleSave}>
              <p>Save</p>
            </button>
        </div>
    )
}

export default SaveButton