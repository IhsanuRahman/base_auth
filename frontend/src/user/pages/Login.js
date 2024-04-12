import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetRegistered } from '../../features/user';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
function Login() {
  const { loading, isAuthenticated, registered } = useSelector(
    state => state.user
  );

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const [error,setError]=useState({isError:false,message:''})
  const [errorMessages,setErrorMessages]=useState({username:'',password:''})
  if (isAuthenticated) {
    navigator('/')
  }
  useEffect(() => {
    if (registered) dispatch(resetRegistered());
  }, [registered]);


  const loginHandler = async () => {
    if (username.trim() === ''){
      errorMessages.username='username is required'
      setErrorMessages({...errorMessages})
    }else{
      errorMessages.username=''
      setErrorMessages({...errorMessages})
    }
    if (password.trim() === ''){
      errorMessages.password='password is required'
      setErrorMessages({...errorMessages})
    }else if (!(username.trim() === '')){
      errorMessages.password=''
      setErrorMessages({...errorMessages})
    dispatch(login({ username, password })).then(e => {
      if (e.meta.requestStatus === 'rejected'){
        let message=''
        for (var attr in e.payload){
          message=e.payload[attr]+','+message
        }
      setError({isError:true,message:message})}
      else if (e.meta.requestStatus==='fulfilled')
      navigator('/')
    })}else{
      errorMessages.password=''
      
      setErrorMessages({...errorMessages})

    }


  }
  return (
    <>

      <div className='h-screen p-2  w-full bg-slate-900 flex-col content-center  text-white ' >
        <Alert error={error} setState={setError} />
        <div className='  h-4/6 w-96 m-auto rounded-md border-white border-2  flex flex-col align-middle  p-14'>
          <h4 className='justify-center flex text-3xl'>Login</h4>
          <input type="text" value={username} className='mt-10 h-8 rounded-sm pl-5 bg-stone-800' placeholder='username' onChange={e => setUsername(e.target.value)} />
            {errorMessages.username?<li className='mt-2 text-red-500'>{errorMessages.username}</li>:null}
          <input type="password" value={password} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='password' onChange={e => setPassword(e.target.value)} />
          {errorMessages.password?<li className='mt-2 text-red-500'>{errorMessages.password}</li>:null}
          
          <a className='underline cursor-pointer text-blue-800 mt-3' onClick={e =>
            navigator('/signup')
          }>need signup?</a>
          <button className=' mb-auto bg-green-700 text-black rounded mx-5 mt-10 ' onClick={loginHandler}>login</button>
        </div>
      </div></>
  )
}

export default Login
