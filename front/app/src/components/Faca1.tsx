import React, { useEffect, useState } from 'react'
import "./faca1.css"
import ReactInputVerificationCode from 'react-input-verification-code';
import axios from 'axios';
interface props{
    closemodel : React.Dispatch<React.SetStateAction<boolean>>
  }
  
  
const Faca1 = ({closemodel}:props) => {
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
    const clearValue = () => setValue("");
    const handlecode = (event:any) =>{
      event.preventDefault();
      axios.post("http://localhost:3001/2fa/turn-on",{value},{withCredentials: true}).then((response) =>{
        console.log(response.data)
        closemodel(false)
      }).catch(error=>{
        if (error.response)
        closemodel(false)
      })  
    }
    console.log(complete);
    console.log(value.length)
    console.log(value)
  return (

    <div className='faBackground'>
        <div className='facontainer'>
            
        <h1 className='title'>Enter Password
          </h1>
            <div className="custom-style">
            <ReactInputVerificationCode autoFocus={true} placeholder='' value={value} onChange={handlevalue}  length={6} />
            </div>
          <div className='footer'>
          <button className='cancelButton'  onClick={() => closemodel(false)}>Cancel </button>
            <button className='continueButton' disabled={complete ? false:true} onClick={handlecode}>Continue </button>
          </div>
        </div>

    </div>
  )
  
}

export default Faca1