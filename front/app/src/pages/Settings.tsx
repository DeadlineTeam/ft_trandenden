import React, { useEffect, useState } from 'react'
import "../App.css"
import "./Settings.css"
import myimage from './ds.jpg'
import styled from 'styled-components'
import { LanguageVariant } from 'typescript'
import Switcher from '../components/Switcher'
import Faca from '../components/Faca';
import Faca1 from '../components/Faca1'
import axios from 'axios'
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

const dataUrlToBlob = (dataurl: string): Blob => {
  // Split the data URL into two parts: the header and the base64 image data
  const parts = dataurl.split(',');
  const header = parts[0];
  const base64 = parts[1];

  // Decode the base64 image data
  const decodedData = atob(base64);

  // Convert the decoded data to a Uint8Array
  const uInt8Array = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Get the content type from the data URL header
  const contentTypeMatch = header.match(/:(.*?);/);
  const contentType = contentTypeMatch ? contentTypeMatch[1] : '';

  // Create a blob from the Uint8Array
  const blob = new Blob([uInt8Array], { type: contentType });

  return blob;
}

const Settings = () => {
 
  // useEffect(()=>
    const url4 = "http://localhost:3001/profile/iconInfo/"
    axios.post(url4, {username: "me"},{withCredentials: true}).then((response3) =>{
      console.log(response3.data)
      setAvatarurl(response3.data.avatar_url)
      setImg(avatarurl)
      setUsername(response3.data.username)
  
    })
  
 
  var [username1, setUsername] = useState("");
  const [avatarurl,setAvatarurl] = useState("")
  var file1:string
  const  [img, setImg] = useState("");
  const  [openmodel, setOpenmodel] = useState(false)
  let file:FileList ;
  const [name, setName] = useState('');
  let username:string = "Flen ben Flen"

  function handleFileChange(event: any|null) {
    const file: File = event.target.files[0];
  
    const reader: FileReader = new FileReader();
    reader.onload = function(event:any) {
      const dataUrl:string = event.target.result;
      const img1 = dataUrlToBlob(dataUrl)
      console.log(img1)
     // const url4 = "http://localhost:3001/users/Avatar"
     // axios.post(url4, {img1},{withCredentials: true}).then((response3) =>{
      //})
    }
    reader.readAsDataURL(file);
  }
  const handlename = (event:React.FormEvent& { target: HTMLInputElement }) =>{
    setName(event.target.value);
  }
 
  const [openmodel1,setOpenmodel1] = useState(false)

  const uploadfile= () =>{
    var e = document.getElementById('inputfile')
  }
  const [toggled, setToggled] = useState(true)
  const handletoggled = () =>{
    if(toggled == false)
      setOpenmodel(!openmodel)

    setToggled(!toggled)
  }

  const handlesubmit = () =>{
    const url3 = "http://localhost:3001/users/username"
    axios.post(url3, {username: name},{withCredentials: true}).then((response2) =>{

    })
  }
  console.log(openmodel)
  console.log("im here")
  console.log(openmodel1)
  return (
    <div>        <h1 style={{padding:"20px 20px", fontSize:"25px" ,color: "white", fontFamily:"'Montserrat Alternates', sans-serif", fontWeight:"400"}}>Settings</h1>
    <div className="milieu">
        <img className="img" id='img' src={img} alt="sqdqs" width="50vw" height="50vh" />
        <input type='file' id='inputfile' accept='.jpg' onChange={handleFileChange} className='imagechange'/>
        <p className='username' >{username1}</p>
        <form className='fm' onSubmit={handlesubmit}>
            <div  className="User" >username :</div>
            <input type='text' value={name} onChange={handlename} placeholder={username}className="settingsinput"/>
            <div className='switchee'>
            <p className='tfa'>two factor authentication</p>

            <Switcher toggled = {toggled} onToggled={handletoggled} />
            </div>    
            {openmodel && <Faca closemodel ={setOpenmodel} openmodel1={setOpenmodel1}/> }
            {openmodel1 && <Faca1 closemodel = {setOpenmodel1} />}
            <button type='submit' onSubmit={handlesubmit} className='input-submit'> Sauvegarder</button>
            
        </form>
    </div>
    </div>
   
  )
}

export default Settings