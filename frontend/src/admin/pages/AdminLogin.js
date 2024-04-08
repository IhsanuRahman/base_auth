import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../features/user';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const { loading, isAuthenticated,user, registered } = useSelector(
		state => state.user
	);
    const dispatch = useDispatch()
    const navigator =useNavigate()
    useEffect(() => {
        if (isAuthenticated && user.is_admin){
         navigator('/admin')
        }
       
         
       }, [isAuthenticated,user])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const loginHandler = async () => {
    
        dispatch(adminLogin({username,password}))
        
       
      }
  return (
    <>

      <div className='h-screen  w-full bg-slate-900 flex text-white' >
        <div className='container mt-auto h-4/6 w-96 m-auto rounded-md border-white border-2  flex flex-col align-middle  p-14'>
          <h4 className='justify-center flex text-3xl'>Admin Login</h4>
          <input type="text" value={username} className='mt-10 h-8 rounded-sm pl-5 bg-stone-800' placeholder='username' onChange={e => setUsername(e.target.value)} />
          <input type="password" value={password} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='password' onChange={e => setPassword(e.target.value)} />
          <button className=' mb-auto bg-green-700 text-black rounded mx-5 mt-10 ' onClick={loginHandler}>login</button>
        </div>
      </div></>
  )
}

export default AdminLogin
