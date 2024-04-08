import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetPassword } from '../../features/user'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [conformpassword, setConformPassword] = useState('')
    const [oldpassword, setOldPassword] = useState('')
    const dispatch = useDispatch()
    const navigate =useNavigate()
    const savehandler = () => {
        {if (password.trim() == conformpassword.trim()) {

            console.log(dispatch(resetPassword({ oldpassword, password })))
            
        }else{
            alert('password not match')
        }}
    }
    return (
        <div className='bg-slate-300 w-full h-screen p-0'>
            <header className='h-20 w-full p-5 flex '><a className='font text-3xl mr-4 ' onClick={_=>navigate('/')}>&lt; </a><p className='text-4xl text-gray-500 font-thin'>|</p><h1 className='font-bold text-3xl'>profile</h1> </header>
            <div className='w-full h-full p-10  flex flex-col justify-center  items-center gap-14'>

                <input type="password" className='w-4/6 pl-5 h-10' placeholder='old password'
                    value={oldpassword} onChange={e => {
                        setOldPassword(e.target.value)
                    }}
                />

                <input type="password" className='w-4/6 pl-5  h-10 ' placeholder='new password'
                    value={password} onChange={e => {
                        setPassword(e.target.value)
                    }} />
                <input type="password" className='w-4/6 pl-5  h-10 ' placeholder='conform password'
                    value={conformpassword} onChange={e => {
                        setConformPassword(e.target.value)
                    }} />

                <button className='bg-green-800 w-20 h-10 rounded ml-auto mt-10 mb-20 mr-20' onClick={savehandler}>save</button>
            </div></div>

    )
}

export default ResetPassword
