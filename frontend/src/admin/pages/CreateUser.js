import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../../features/user'
import { useNavigate } from 'react-router-dom';

function CreateUser() {
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [conformpassword, setConformPassword] = useState('')
    const [email, setEmail] = useState('')
    const [superuser, setSuperUser] = useState(false)
    let [image, setImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const savehandler = () => {
        if (password.trim() === conformpassword.trim()) {
            dispatch(createUser({ username, firstname, lastname, email, image, superuser, password }))
        }else{
            alert('paswords are not match')
        }
    }
    return (
        <div className='bg-slate-300 w-full h-screen p-0'>
            <header className='h-20 w-full p-5 flex '><a className='font text-3xl mr-4 ' onClick={_=>navigate('/admin')}>&lt; </a><p className='text-4xl text-gray-500 font-thin'>|</p><h1 className='font-bold text-3xl'>Detials</h1> </header>
            <div className='w-full h-full p-10  flex flex-col  items-center gap-4'>
                <div className=' h-36 rounded-full    w-36 ' style={image ? { backgroundImage: `url('${URL.createObjectURL(image)}')`, backgroundPosition: 'center', backgroundSize: 'contain' } : { backgroundColor: '#374151' }}>

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
                <input type="text" id='username' className='w-4/6 mt-5 pl-5 mb-10 font-semibold text-2xl text-center h-7 ' placeholder='username' value={username}
                    onChange={e => {
                        setUsername(e.target.value)
                    }}
                />
                <div className='flex w-4/6 gap-3  h-7'>
                    <input type="text" className='w-1/2 pl-5 h-7 ' placeholder='firstname' aria-label='firstname'
                        value={firstname} onChange={e => {
                            setFirstname(e.target.value)
                        }} />
                    <input type="text" className='w-1/2 pl-5 h-7 ' placeholder='lastname'
                        value={lastname} onChange={e => {
                            setLastname(e.target.value)
                        }}
                    /></div>
                <input type="email" className='w-4/6 pl-5  h-7 ' placeholder='email'
                    value={email} onChange={e => {
                        setEmail(e.target.value)
                    }} /><input type="password" className='w-4/6 pl-5  h-7 ' placeholder='password'
                        value={password} onChange={e => {
                            setPassword(e.target.value)
                        }} />
                <input type="password" className='w-4/6 pl-5  h-7 ' placeholder='conform password'
                    value={conformpassword} onChange={e => {
                        setConformPassword(e.target.value)
                    }} />
                <div className='flex gap-1'>is_superuser:<input type="checkbox" checked={superuser} onClick={e => {

                    setSuperUser(e.target.checked)
                }} /></div>

                <button className='bg-green-800 w-20 h-10 rounded ml-auto mt-auto mb-20 mr-20' onClick={savehandler}>create</button>
            </div>

        </div>
    )
}

export default CreateUser
