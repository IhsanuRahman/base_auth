import axios from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'universal-cookie'

function Home() {
    const getUser= async()=>{
 const cookies = new Cookies()
        const cookie = cookies.get('csrftoken')
      await axios.post('http://127.0.0.1:8000/api/',JSON.stringify({}),{
        headers: { 'Content-Type': 'application/json',
        'Authorization':`Bearer ${localStorage.getItem('access_token')}`,

        },
        
      }).then(response=>{
        console.log(response);
      })
    }
    useEffect(() => {
       getUser()
    
     
    }, [])
    
    return (
        <div>
            <center><h1>hello</h1></center>
                
        </div>
    )
}

export default Home
