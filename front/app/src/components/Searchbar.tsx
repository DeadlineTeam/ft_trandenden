import React ,{useState} from 'react'
import {AiOutlineHome} from 'react-icons/ai'
import "./styles.css"
import {AiOutlineSearch} from 'react-icons/ai'
import "./Sb.css"
type props = {
  placeholder:string;
  data: Array<any>;
}
const Searchbar = ({placeholder, data}:props) => {
  const [filtredData, setFiltredData] = useState([]); 
  const len:Number = filtredData.length;
  return (
    <div className='searchbar'>
      <div className="searchInputs">
        <input type="text" placeholder={placeholder}/>
        <div className='searchicon'>
          <AiOutlineSearch/>
        </div>
      
      </div>

      {
      filtredData.length != 0 &&
        (
      <div className="dataInputs">
        { data.map((value, key)=>{
            return <a className='dataitem' href={value.link}>
              <p>{value.index}</p>
              </a>;
        }) }
      </div>)}

    </div>
  )
}

export default Searchbar