import React from 'react'
import "./Switcher.css"
interface props{
  toggled : boolean;
  onToggled : ()=>void;
}

const Switcher = ({toggled, onToggled}:props) => {
  return (
    <label className='switch'>
        <input type="checkbox" checked={toggled} onChange={onToggled}/>
        <span className='slider'/>
    </label>
  )
}

export default Switcher