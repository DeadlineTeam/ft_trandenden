import React, { useEffect, useState } from 'react'
import "./faca1.css"
import ReactInputVerificationCode from 'react-input-verification-code';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa'


interface props{
    closemodel : React.Dispatch<React.SetStateAction<boolean>>
    ssucces :boolean
  }
  
const Faca2 = ({closemodel, ssucces}:props) => {
  const handlecode = (event:any) =>{
      closemodel(false)
      event.preventDefault();
  }
  return (

    <div className='faBackground'>
        <div className='facontainer'>
          <h1 className='title'>Enter Password</h1>
          <div >
              <FaIcons.FaLockOpen/>
          </div>
          <div className='footer'>
            <button className='continueButton' onClick={handlecode}>Close </button>
          </div>
        </div>
    </div>
  )
}

export default Faca2