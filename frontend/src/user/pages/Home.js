import axios from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'universal-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { reducers } from '../../features/user'
function Home() {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    console.log(useSelector(state => state.user));
    const navigate = useNavigate();
    const dispatch = useDispatch()
    if (!isAuthenticated && !loading && Object.keys(user).length === 0)
        return navigate('/login')
    return (
        <div>
            <header className='h-20 w-full p-5 flex justify-between border-b-4 mb-3'>
                <h1 className='font-bold text-3xl'>Home</h1>
                {Object.keys(user).length ===0  ?<span className='flex items-center'><h4 className='text-2xl cursor-pointer' onClick={_=>navigate('/login')}>login</h4>&nbsp; or &nbsp;
                <h4 className='text-2xl cursor-pointer' onClick={_=>navigate('/signup')}>signup</h4></span>
             :<h4 className='text-2xl cursor-pointer' onClick={_=>navigate('/profile')}>profile</h4>}
             </header>
            <center><h1>hello {user.username ? user.username : ''}</h1>
            
            </center>
        </div>
    )
}

export default Home
