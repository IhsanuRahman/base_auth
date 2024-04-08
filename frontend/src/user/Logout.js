import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/user';

function Logout() {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    console.log(useSelector(state => state.user));
    const navigate = useNavigate();
    const dispatch =useDispatch()
    useEffect(() => {
      dispatch (logout())
     navigate('/login')
    
      
    }, [])
    
    if (!isAuthenticated && !loading && Object.keys(user).length === 0)
        return navigate('/login')
    else{
      return(<div></div>)}
  
}

export default Logout
