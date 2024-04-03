import axios from 'axios';
import React, {  useState } from 'react'
import Cookies from "universal-cookie";



function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState()
    const [conformPassword, setConformPassword] = useState('');

    const signUpHandler = async () => {
        const cookies = new Cookies()
        const cookie = cookies.get('csrftoken')
        const user = JSON.stringify({
            "username": username,
            "password": password,
            'firstname':firstname,
            'lastname':lastname,
            'email':email,
        })

        axios.post('http://127.0.0.1:8000/api/signup',
            user, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':cookie
            },
            credentials: "same-origin",                                                                                                                             

        }).then((response) => {
            alert('signup success')
        }).catch(e=>
            {
                alert(e.response.data.message.non_field_errors)
            })
       
    }

    return (
        <div className='h-screen  w-full bg-slate-900 flex text-white ' >
            <div className='container mt-auto h-4/6 w-96 m-auto rounded-md border-white border-2  flex flex-col align-middle  p-14'>
                <h4 className='justify-center flex text-3xl'>Sign Up</h4>
                <input type="text" value={username} className='mt-10 h-8 rounded-sm pl-5 bg-stone-800' placeholder='username' onChange={e => setUsername(e.target.value)} />
                <div className='flex mt-5 gap-2'>
                    <input type="text" value={firstname} className=' pl-5 h-8 rounded-sm  bg-stone-800 w-1/2' placeholder='firstname' onChange={e => setFirstname(e.target.value)} />
                    <input type="text" value={lastname} className='pl-5 h-8 rounded-sm bg-stone-800 w-1/2' placeholder='lastname' onChange={e => setLastname(e.target.value)} />
                </div>
                <input type="email" value={email} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='email' onChange={e => setEmail(e.target.value)} />
                <input type="password" value={password} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='password' onChange={e => setPassword(e.target.value)} />
                <input type="password" value={conformPassword} className='mt-5 h-8 rounded-sm bg-stone-800 pl-5' placeholder='conform password' onChange={e => setConformPassword(e.target.value)} />
                <button onClick={signUpHandler} className=' mb-auto bg-green-700 text-white h-8 rounded mx-5 mt-10 '>Sign Up</button>
            </div>
        </div>
    )
}

export default SignUp
