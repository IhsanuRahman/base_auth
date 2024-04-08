import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../../features/user'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessages, setErrorMessages] = useState({})
  let [image, setImage] = useState(null)
  const { isAuthenticated, user, loading } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigator = useNavigate()
  useEffect(() => {
    console.log(loading);
    if (isAuthenticated && !loading) {
      setUsername(user.username)
      setEmail(user.email)
      setFirstname(user.first_name)
      setLastname(user.last_name)
    }
    if (!isAuthenticated && !loading && Object.keys(user).length ===0) {
      navigator('/')
    }
  }, [user])
  const savehandler = () => {
    let errors = {}
    if (username.trim() === '') {
      errors.username = 'username is required'
    }
    if (firstname.trim() === '') {
      errors.firstname = 'firstname is required'
    }
    if (lastname.trim() === '') {
      errors.lastname = 'lastname is required'
    }
    if (email.trim() === '') {
      errors.email = 'email is required'
    }
    if (!(email.trim().includes('.')&&email.trim().includes('@'))) {
      errors.email = 'enter a valid email'
    }
    if (Object.keys(errors).length ===0 ) {
      alert('need to save')
      dispatch(updateProfile({ username, firstname, lastname, email, image })).then(e => {
        alert(JSON.stringify(e.payload))
        setErrorMessages({...e.payload.message})
      })
      alert('saved')
    }else setErrorMessages(errors)
  }
  return (
    <div className='bg-slate-300 w-full h-screen p-0'>
      <header className='h-20 w-full p-5 flex '><a className='font text-3xl mr-4 ' onClick={_=>navigator('/')}>&lt; </a><p className='text-4xl text-gray-500 font-thin'>|</p><h1 className='font-bold text-3xl'>profile</h1> <button className='bg-red-600 h-7 w-20 fixed right-3 text-white  rounded' onClick={_ => {
        if (window.confirm('are sure to logout')) { return navigator('/logout') }
      }}>Logout</button></header>
      <div className='w-full h-full p-10  flex flex-col  items-center gap-4'>
        <div className=' h-36 rounded-full    w-36 ' style={image ? { backgroundImage: `url('${URL.createObjectURL(image)}')`, backgroundPosition: 'center', backgroundSize: 'contain' } : user.image != null ? { backgroundImage: `url('http://127.0.0.1:8000${user.image}')`, backgroundPosition: 'center', backgroundSize: 'contain' } : { backgroundColor: '#374151' }}>

          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className=' mt-36'
            required
            onChange={(e) => {
              setImage(e.target.files[0])
            }}

          />
        </div>
        <input type="text" id='username' className={`w-4/6 mt-5 pl-5  font-semibold text-2xl text-center h-7 bg-transparent focus:bg-white ${errorMessages.username ? 'border-red-700 border-2' : ''}`} placeholder='username' value={username}
          onChange={e => {
            setUsername(e.target.value)
          }}
        />
        {errorMessages.username ? <li className='mt-2 text-red-500'>{errorMessages.username}</li> : null}
        <div className='flex w-4/6 gap-3  h-7'>
          <input type="text" className={`w-1/2 pl-5 h-7  bg-transparent focus:bg-white ${errorMessages.firstname ? 'border-red-700 border-2' : ''}`} placeholder='firstname' aria-label='firstname'
            value={firstname} onChange={e => {
              setFirstname(e.target.value)
            }} />
          <input type="text" className={`w-1/2 pl-5 h-7 bg-transparent focus:bg-white ${errorMessages.lastname ? 'border-red-700 border-2' : ''}`} placeholder='lastname'
            value={lastname} onChange={e => {
              setLastname(e.target.value)
            }}
          /></div>
        <div className=' gap-2 flex w-4/6'>{errorMessages.firstname ? <li className='mt-2 text-red-500 w-1/2'>{errorMessages.firstname}</li> : null}
        {errorMessages.lastname ? <li className='mt-2 text-red-500 w-1/2'>{errorMessages.lastname}</li> : null}</div>
        <input type="email" className={`w-4/6 pl-5  h-7 bg-transparent focus:bg-white ${errorMessages.email ? 'border-red-700 border-2' : ''}`} placeholder='email'
          value={email} onChange={e => {
            setEmail(e.target.value)
          }} />
        {errorMessages.email ? <li className='mt-2 text-red-500'>{errorMessages.email}</li> : null}
        <button className='bg-yellow-500 rounded w-44 h-8 mr-auto ml-64 mt-10 text-white' onClick={_ => navigator('/change-password')}>change password</button>
        <button className='bg-green-800 w-20 h-10 rounded ml-auto mt-auto mb-20 mr-20 text-white' onClick={savehandler}>save</button>
      </div>

    </div>
  )
}

export default Profile
