import React, { useState } from 'react'
import "../App.css"
import "./Settings.css"
import myimage from './ds.jpg'
import styled from 'styled-components'
import { LanguageVariant } from 'typescript'

const StyledLabel = styled.label<{ checked: boolean }>`  
cursor: pointer;  
text-indent: -9999px;  
width: 250px;  
height: 125px;  
background-color: ${({ checked }) => (checked ? "#192125" :  "#9da2b3")};  
display: block;  
border-radius: 100px;  
position: relative;
&:after {    
content: "";    
position: absolute;    
left: ${({ checked }) => (checked ? "14px" : "calc(55% - 5px)")};    top: 12px;    
width: 100px;    
height: 100px;    
background-color: #fff;    
border-radius: 90px;    
transition: 0.3s;  
}`;
const Settings = () => {
  const [name, setName] = useState('');
  const [switchState, setSwitchState] = useState(true); 
  let username:string = "Flen ben Flen"
  const handlename = (event:React.FormEvent& { target: HTMLInputElement }) =>{
    setName(event.target.value);
  }
  const handleSubmit = (event:React.FormEvent) =>{
    username = name;
  }
  const handleonChange = (event:React.FormEvent) =>{
    setSwitchState(!switchState)
  }
  return (
    <div>        <h1 style={{padding:"20px 20px", fontSize:"25px" ,color: "white", fontFamily:"'Montserrat Alternates', sans-serif", fontWeight:"400"}}>Settings</h1>
    <div className="milieu">
        <img className="img" src={myimage} alt="sqdqs" width="50vw" height="50vh" />
        <input type='file'  accept='.jpg' className='imagechange'/>
        <p className='username' >{username}</p>
        <form onSubmit={handleSubmit}>
            <div  className="User" >username :</div>
            <input type='text' value={name} onChange={handlename} placeholder={username}className="settingsinput"/>
          

            <button type='submit' className='input-submit'> Sauvegarder</button>
            
        </form>
    </div>
    <p>{name}</p>
    </div>
  )
}

export default Settings