import React from 'react'
import { useState} from 'react'
import axiosApi from '../api/axiosApi';
import axios from 'axios'
import './faca.css'

interface props{
  closemodel : React.Dispatch<React.SetStateAction<boolean>>
  openmodel1 : React.Dispatch<React.SetStateAction<boolean>>;
}


const Faca = ({closemodel,openmodel1}:props) => {
  const [qrcode, setGrcode] = useState("")
  const handlemodel1 = () =>{
    closemodel(false)
    openmodel1(true)
  }
    const url3 = "http://localhost:3001/2fa/generate"
      axios.post(url3,{withCredentials: true}).then((response2) =>{
        console.log(response2.data)
      })

  return (
    <div className='faBackground'>
        <div className='facontainer'>
            
        <h1 className='title'>scan the Qr code to recieve the code to enable 2FA
          </h1>
          <div className='footer'>
          
          <button className='cancelButton' onClick={() => closemodel(false)}>Cancel </button>
          <button className='continueButton' onClick={handlemodel1}>Continue </button>
          </div>
        </div>

    </div>
  )
}

export default Faca
