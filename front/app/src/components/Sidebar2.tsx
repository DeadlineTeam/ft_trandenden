import React from 'react'
import * as FaIcons from 'react-icons/fa' 
import {Sidebardata} from './Sidebardata'
import {AiOutlineSearch} from 'react-icons/ai'
import styled from 'styled-components'
import { Link } from "react-router-dom";
import { useState } from 'react';
import './Sb.css'

const Navbar = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 3.5rem;
    background-color: #192125;
`
const MenuIconOpen = styled(Link)`
    display: flex;
    justify-content: start;
    font-size: 1.5rem;
    margin-left: 2rem;
    color: #ffffff;
`

const MenuIconClose = styled(Link)`
    display: flex;
    justify-content: end;
    font-size: 1.5rem;
    margin-top: 0.75rem;
    margin-right: 1rem;
    color: #ffffff;
`

const SidebarMenu = styled.div<{close: boolean}>`
    width: 200px;
    height: 100vh;
    background-color: #41474A;
    position: fixed;
    top: 0;
    left: ${({ close}) => close ? '0' : '-100%'};
    transition: .6s;
`

const MenuItems = styled.li`
    top: 20%;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 50px;
    padding:  0 0.255rem;
`

const MenuItemLinks = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-family: 'Montserrat Alternates', sans-serif;
    font-weight: 300;
    font-size: 12px;
    text-decoration: none;
    color: #ffffff;

    &:active {
        font-weight: 500;
        color:  #45999;
    }
    &:hover {
        background-color: #192125;
        color: #fff;
        width: 65%;
        height: 45px;
        text-align: center;
        font-weight: 300;
        border-radius: 5px;
        margin: 0 0;
    }

`
const LinkSpann = styled.span`
    marginLeft: '30px'
`
type props = {
    placeholder:string;
    data: Array<any>;
  }
const Sidebar2 = ({placeholder, data}:props) => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const [filtredData, setFiltredData] = useState(Array<any>()); 
    const len:Number = filtredData.length;
    let op:Number;
    const handleFilter = (event:React.FormEvent& { target: HTMLInputElement }) =>{
        const searchWord = event.target.value
        console.log(searchWord.length)

        const newfilter =  data.filter((value) => {
            return value.name.includes(searchWord)
        })
        if (Object.keys(newfilter).length == 0)
        {
            setFiltredData([]);
        }
        else
            setFiltredData(newfilter);

    }
    console.log(len);
    return (
    
    <>
    <Navbar>
    <MenuIconOpen to="#" onClick={showSidebar}>
            <FaIcons.FaBars/>
        </MenuIconOpen>
    <div className='searchbar'>
        
    <div className="searchInputs">
        <input type="text" placeholder={placeholder} onChange={handleFilter}/>
        <div className='searchicon'>
          <AiOutlineSearch/>
        </div>
      
      </div>

      { filtredData.length != 0 &&
        (
      <div className="dataInputs">
        { filtredData.map((value, key)=>{
            return <a className='dataitem' href={value.link}>
              <p>{value.name}</p>
              </a>;
        }) }
      </div>)}
      </div>
    </Navbar>

    <SidebarMenu close={close}>
                <MenuIconClose to="#" onClick={showSidebar}>
            <FaIcons.FaTimes/>
        </MenuIconClose>
        
        {Sidebardata.map((item, index) =>{
            return(
                <MenuItems key={index}>
                    <MenuItemLinks to={item.path}>
                        {item.icon}
                        <span style={{marginLeft: '30px'}}>{item.name}</span>
                    </MenuItemLinks>
                </MenuItems>
            )
        })

        }
    </SidebarMenu>
    </>
  )
}

export default Sidebar2