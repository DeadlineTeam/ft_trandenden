import React from 'react'

const AccessMode = ({ visibility, setAccessMode }: any) => {
    return (
        <div className="child4">
          <p>Access :</p>
          <div className="child4CheckBox">
            <input type="radio" id="Public" name="visibility" value="Public" checked={visibility === "Public"} onChange={(e) => setAccessMode(e.target.value)}/>
            <p>Public</p>
          </div>
          <div className="child4CheckBox">
            <input type="radio" id="Protected" name="visibility" value="Protected" checked={visibility === "Protected"} onChange={(e) => setAccessMode(e.target.value)}/>
            <p>Protected</p>
          </div>
          <div className="child4CheckBox">
            <input type="radio" id="Private" name="visibility" value="Private" checked={visibility === "Private"} onChange={(e) => setAccessMode(e.target.value)}/>
            <p>Private</p>
          </div>
        </div>
    )
}

export default AccessMode