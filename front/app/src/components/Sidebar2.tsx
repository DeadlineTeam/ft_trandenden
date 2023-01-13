import React from 'react'
import { Link } from "react-router-dom";
import * as FaIcons from 'react-icons/fa'
import { Sidebardata } from './Sidebardata'
import { AiOutlineSearch } from 'react-icons/ai'
import styled from 'styled-components'
import { useState, useEffect } from 'react';
import axios from 'axios'
import './Sb.css'
import { useNavigate } from 'react-router-dom';
import {BiLogOut} from 'react-icons/bi'
import {GrClose} from 'react-icons/gr'


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

const SidebarMenu = styled.div<{ close: boolean }>`
    width: 200px;
    height: 100vh;
    background-color: #41474A;
    position: fixed;
    top: 0;
    left: ${({ close }) => close ? '0' : '-100%'};
    transition: .6s;
    z-index:1000;
    @media(max-width : 700px)
    {
        width:100%;
    }

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
    placeholder: string;
    data: Array<any>;
}
const Sidebar2 = ({ placeholder, data }: props) => {
    const [truedata, setTrudata] = useState(Array<any>())
    const [search, setSerach] = useState(false);
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const [filtredData, setFiltredData] = useState(Array<any>());
    const len: Number = filtredData.length;
    const [value, setValue]= useState("");
    const navigate = useNavigate ();
    let op: Number;
     const clearfilter =() =>{
        setFiltredData([])
        setValue("");
        setSerach(false);

     }
    const handleFilter = (event: React.FormEvent & { target: HTMLInputElement }) => {   
        const url3 = `${process.env.REACT_APP_BACK_URL}/users/all`
        setValue(event.target.value);
        axios.get(url3, { withCredentials: true }).then((response2) => {
            setTrudata(response2.data)
        })
            let searchWord: string;
            searchWord = event.target.value

            const newfilter = truedata.filter((value) => {
                return value.username.includes(searchWord)
            })
            if (searchWord.length == 0) {
                setFiltredData([]);
                setSerach(false);
            }
            else
            {
                setSerach(true);
                setFiltredData(newfilter);
            }
    }
    const handlLogOut = () =>{
        axios.get(`${process.env.REACT_APP_BACK_URL}/profile/logout`, {withCredentials: true}).then((response) =>{
            navigate ('/login');
      	})
    

    }
    const handlesearch = ()=>{
        setValue("");
        setSerach(false);
        setFiltredData([])
    }
    return (

        <>
            <Navbar>
                <MenuIconOpen to="#" onClick={showSidebar}>
                    <FaIcons.FaBars />
                </MenuIconOpen>
                <div className='searchbar'>

                    <div className="searchInputs">
                        <input type="text" value={value} placeholder={placeholder} onChange={handleFilter} />
                        {search ==false &&(<div className='searchicon'>
                            <AiOutlineSearch />
                        </div>)}
                        {
                            search == true &&(
                                <div className='searchicon'>
                            <GrClose onClick={clearfilter} />
                         </div>
                            )
                        }
                    </div>

                    {filtredData.length != 0 &&
                        (
                            <div className="dataInputs">
                                {filtredData.map((value, key) =>
                                <Link to={"profile/"+value.username} key={key}>
                                    <p onClick={handlesearch}  className='dataitem'>
                                        {value.username}
                                    </p>
                                </Link>
                                )}
                            </div>)}
                </div>
            </Navbar>

            <SidebarMenu close={close}>
                <MenuIconClose to="#" onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </MenuIconClose>
                {Sidebardata.map((item, index) => {
                    return (
                        <MenuItems  key={index}>
                            <MenuItemLinks to={item.path}>
                                {item.icon}
                                <span  style={{ marginLeft: '30px' }}>{item.name}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })
                }
                <button className='ButtonLogOut' onClick={handlLogOut}>
                    <BiLogOut className='Logouticon'/>  
                </button>
            </SidebarMenu>
        </>
    )
}

export default Sidebar2