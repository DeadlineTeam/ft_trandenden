import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import Bookdata from "../data.json"
import React from 'react'
type ButtonProps = {
    children: React.ReactNode;
    
}
const Sidelayout = () => {
  return (
    <>

    <Searchbar placeholder="Enter usernaame" data={Bookdata}/>
    <Sidebar/>
    <Outlet />
  </>
  )
}
export default Sidelayout

