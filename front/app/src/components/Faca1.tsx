import React, { useEffect, useState } from 'react'
import "./faca1.css"
import ReactInputVerificationCode from 'react-input-verification-code';
import axios from 'axios';
interface props{
    closemodel : React.Dispatch<React.SetStateAction<boolean>>
    settoggled: React.Dispatch<React.SetStateAction<boolean>>;
    openmodel2 :React.Dispatch<React.SetStateAction<boolean>>;
    ssucces: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  
const Faca1 = ({closemodel,openmodel2 ,ssucces, settoggled}:props) => {
    const [value, setValue] = useState("");
    const [complete, isComplete] = useState(false);
    const handlecomplete = () =>
    {
        isComplete(true)
    }
    useEffect(()=>{
        if(value.length == 6)
            isComplete(true)
    })
    const handlevalue = (data:string) =>{
        setValue(data);
        isComplete(false)
      }
    const handlecode = (event:any) =>{
      event.preventDefault();
      console.log("valuuuuuue", value) 
      openmodel2(true)
	    axios.post("http://localhost:3001/2fa/turn-on",{"twofasecret": value},{withCredentials: true})
      .then((response) =>{
        console.log(response.data)
        ssucces(true)
        closemodel(false)
        settoggled(true)
        })
      .catch(error=>{
        if (error.response)
          settoggled(false)
        closemodel(false)
      })  
    }
  return (
    <div className='faBackground'>
        <div className='facontainer'>
        <div className='Tp'>
          <h1 className='title'>Enter Password
            </h1>
              <div className="custom-style">
                <ReactInputVerificationCode autoFocus={true} placeholder='' value={value} onChange={handlevalue}  length={6} />
              </div>
              </div>
            <div className='footer'>
              <button className='cancelButton'  onClick={() => {closemodel(false);settoggled(false)}}>Cancel </button>
              <button className='continueButton' disabled={complete ? false:true} onClick={handlecode}>Continue </button>
            </div>
        </div>
    </div>
  )
}

export default Faca1