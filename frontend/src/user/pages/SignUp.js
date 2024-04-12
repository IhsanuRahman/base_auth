import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../features/user';
import { useDispatch, useSelector } from 'react-redux';



function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('')
    const [conformPassword, setConformPassword] = useState('');
    const dispatch = useDispatch();
    const navigator = useNavigate()
    const { registered } = useSelector(state => state.user);
    const [errorsMessages, setErrors] = useState({})
    const signUpHandler = async () => {
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
        } else if (!(email.includes('.') || email.includes('@'))) {
            errors.email = 'enter a valid email'
        }
        if (password.trim() === '') {
            errors.password = 'password is required'
        }
        else if (password.length <6) {
            errors.password = 'password need atleast 6 characters'
        }
        if (conformPassword.trim() === '') {
            errors.conformpassword = 'conform password is required'
        }

        if (!(password.trim() === conformPassword.trim())) {
            errors.conformpassword = 'passwords are not match'
        }

        if (errors == {}) {
            dispatch(register({ username, firstname, lastname, email, password })).then(
                e => {
                    if (e.meta.requestStatus === 'rejected') {
                        setErrors({ ...e.payload })
                    }
                    else if (e.meta.requestStatus === 'fulfilled')
                        navigator('/login')
                }
            );
        }
        else {
            setErrors(errors)
        }


    }
    if (registered) return navigator('/login')
    return (
        <div className='h-screen  w-full bg-slate-900 flex text-white ' >
            <div className='container mt-auto h-auto w-96 m-auto rounded-md border-white border-2  flex flex-col align-middle  p-14'>
                <h4 className='justify-center flex text-3xl'>Sign Up</h4>
                <input type="text" value={username} className='mt-10 min-h-8 rounded-sm pl-5 bg-stone-800' placeholder='username' onChange={e => setUsername(e.target.value)} />
                {errorsMessages.username ? <li className='mt-2 text-red-500'>{errorsMessages.username}</li> : null}
                <div className='flex mt-5 gap-2'>
                    <input type="text" value={firstname} className=' pl-5 min-h-8 rounded-sm  bg-stone-800 w-1/2' placeholder='firstname' onChange={e => setFirstname(e.target.value)} />
                    <input type="text" value={lastname} className='pl-5 min-h-8 rounded-sm bg-stone-800 w-1/2' placeholder='lastname' onChange={e => setLastname(e.target.value)} />
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/2'>
                        {errorsMessages.firstname ? <li className='mt-2 text-red-500'>{errorsMessages.firstname}</li> : null}
                    </div>
                    <div className='pl-5'>
                        {errorsMessages.lastname ? <li className='mt-2 text-red-500'>{errorsMessages.lastname}</li> : null}
                    </div>
                </div>
                <input type="email" value={email} className='mt-5 min-h-8 rounded-sm bg-stone-800 pl-5' placeholder='email' onChange={e => setEmail(e.target.value)} />
                {errorsMessages.email ? <li className='mt-2 text-red-500'>{errorsMessages.email}</li> : null}
                <input type="password" value={password} className='mt-5 min-h-8 rounded-sm bg-stone-800 pl-5' placeholder='password' onChange={e => setPassword(e.target.value)} />
                {errorsMessages.password ? <li className='mt-2 text-red-500'>{errorsMessages.password}</li> : null}
                <input type="password" value={conformPassword} className='mt-5 min-h-8 rounded-sm bg-stone-800 pl-5' placeholder='conform password' onChange={e => setConformPassword(e.target.value)} />
                {errorsMessages.conformpassword ? <li className='mt-2 text-red-500'>{errorsMessages.conformpassword}</li> : null}
                <a className='underline cursor-pointer text-blue-800 mt-3' onClick={e =>
                    navigator('/login')
                }>already have account?</a>
                <button onClick={signUpHandler} className=' mb-auto bg-green-700 text-white h-8 rounded mx-5 mt-10 '>Sign Up</button>
            </div>
        </div>
    )
}

export default SignUp
