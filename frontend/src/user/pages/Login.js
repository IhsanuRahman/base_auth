import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    const cookies = new Cookies()
    const cookie = cookies.get('csrftoken')
    
    const user = JSON.stringify({
      "username": username,
      "password": password,
      'csrfmiddlewaretoken':cookie
    });
    console.log(cookie);
    const {data} = await axios.post('http://127.0.0.1:8000/api/login',
      user,
       {
      headers: { 'Content-Type': 'application/json'},
      credentials: "same-origin", 
    }
    ).catch(err=>alert(err.response))
      localStorage.clear()
      localStorage.setItem('access_token',data.access)
      localStorage.setItem('refresh_token',data.refresh)
       alert('login success')
   
  }
  return (
    <>

      <div className='h-screen  w-full bg-slate-900 flex text-white' >
        <div className='container mt-auto h-4/6 w-96 m-auto rounded-md border-white border-2  flex flex-col align-middle  p-14'>
          <h4 className='justify-center flex text-3xl'>Login</h4>
          <input type="text" value={username} className='mt-10 h-8 rounded-sm pl-5 bg-stone-800' placeholder='username' onChange={e => setUsername(e.target.value)} />
          <input type="password" value={password} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='password' onChange={e => setPassword(e.target.value)} />
          <button className=' mb-auto bg-green-700 text-black rounded mx-5 mt-10 ' onClick={loginHandler}>login</button>
        </div>
      </div></>
  )
}

export default Login
