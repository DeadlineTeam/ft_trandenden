import React from 'react'
import ReactInputVerificationCode from 'react-input-verification-code';
import { useState , useEffect } from 'react';
import "../components/faca.css"
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
    const handlecancel = () =>{
      navigate("/login")
    }
      const handlecode = (event:any) =>{
        event.preventDefault();
        
        axios.post("http://localhost:3001/2fa/authenticate",{"twofasecret": value},{withCredentials: true})
        .then((response) =>{
          navigate("/Home")
          })
        .catch(error=>{
            navigate("/login")
        })  
      }
    useEffect(()=>{
        if(value.length == 6)
            isComplete(true)
    })
    useEffect(()=>{
      async function  Ciali() {
        // const axiosapi = axiosApi ();
        axios.get('http://localhost:3001/getUser', {
          withCredentials: true,
        }).then((data)=> {
          navigate("/Notfound");
          // navigate("/");
        }).catch((err) => {
          
        });
      }
      Ciali();
    })
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
                  <button className='cancelButton' onClick={handlecancel}>Cancel </button>
                  <button className='continueButton' disabled={complete ? false:true} onClick={handlecode} >Continue </button>
                </div>
            </div>
        </div>
      )
  
}

export default TwoFaCode