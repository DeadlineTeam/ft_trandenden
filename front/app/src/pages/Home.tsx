import React from 'react'
import "../App.css"
import "./Home.css"
import img1 from "../15Z_2102.w015.n001.349B.p15.349.jpg"
import img2 from "../2201_w026_n002_1311b_p1_1311.jpg"
const Home = () => {
  console.log("i m hereee");
  return (
      <div className='fullhome'> 
        <h1 className='Headannounce'>
        IT S TIME TO SHOW UR SELF THE TALENT U HAVE ON PLAYING PING PONG
        </h1>
        <div className='gamechoose'>
          <h1 style={{margin:"auto",fontStyle:"italic", marginTop:"3%", color:"white", fontSize:"large"}}>
            Choose ur mode and enjoy it
          </h1>
          <div className='gamechoice'>
            <div className='normal'>
              <img className='normimage' src={img1} alt="azezae" width={"100%"} height={"100%"} />
              <div className='bg'>
                <p className='modename'> Normal Mode</p>
                </div>
            </div>
            <div className='ultimate'>
            <img className='normimage' src={img2} alt="azezae1" width={"100%"} height={"100%"} />
            <div className='bg'>
            <p className='modename'> Ultimate Mode</p>
            </div>
            </div>
          </div>
        </div>
       </div>
              

  )
}

export default Home