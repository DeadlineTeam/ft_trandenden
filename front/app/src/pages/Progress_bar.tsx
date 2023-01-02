interface props1  {
    progress: Number
  }
  const Progress_bar = ({progress}: props1) => {
       
      const Parentdiv = {
          height:'100%',
          width: '100%',
          backgroundColor: '#D9D9D9',
          borderRadius: 40, 
        }
        
        const Childdiv = {
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#192125',
         borderRadius:40,
        }
        
      return (
      <div style={Parentdiv}>
        <div style={Childdiv}>
        </div>
      </div>
      )
    }
    export default Progress_bar;
  
    