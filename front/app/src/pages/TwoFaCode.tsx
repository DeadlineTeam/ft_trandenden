import React from 'react'
import ReactInputVerificationCode from 'react-input-verification-code';
import { useState , useEffect } from 'react';
import "../components/faca1.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

  
const TwoFaCode = () => {
    const [value, setValue] = useState("");
    const [complete, isComplete] = useState(false);
    const navigate = useNavigate()
    const handlevalue = (data:string) =>{
        setValue(data);
        isComplete(false)
        console.log(value)
      }
      const handlecode = (event:any) =>{
        event.preventDefault();
        console.log("valuuuuuue", value) 
        axios.post("http://localhost:3001/2fa/authenticate",{"twofasecret": value},{withCredentials: true})
        .then((response) =>{
          console.log("respooooone");
          navigate("/Home")
          })
        .catch(error=>{
          console.log("errrrrroooor");
          
            navigate("/login")
        })  
      }
    useEffect(()=>{
        if(value.length == 6)
            isComplete(true)
    })
  return (
    
        <div className='faBackground'>
            <div className='facontainer'>
              <h1 className='title'>Enter Password
                </h1>
                  <div className="custom-style">
                    <ReactInputVerificationCode autoFocus={true} placeholder='' value={value} onChange={handlevalue}  length={6} />
                  </div>
                <div className='footer'>
                  <button className='cancelButton'>Cancel </button>
                  <button className='continueButton' disabled={complete ? false:true} onClick={handlecode} >Continue </button>
                </div>
            </div>
        </div>
      )
  
}

export default TwoFaCode