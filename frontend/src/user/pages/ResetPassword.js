import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetPassword } from '../../features/user'
import { useNavigate } from 'react-router-dom'
import Alert from '../../components/Alert'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [conformpassword, setConformPassword] = useState('')
    const [oldpassword, setOldPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState({ isError: false, message: '' })
    const [errorMessages, setErrorMessages] = useState({})
    const savehandler = () => {
        let errors = {}
        if (oldpassword.length === 0) {
            errors.oldpassword = 'old password is required'
        }
        if (password.length === 0) {
            errors.password = 'new password is required'
        }
        if (password.length <6) {
            errors.password = 'new password need atleast 6 characters'
        }
        if (conformpassword.length === 0) {
            errors.conformpassword = 'conform password is required'
        }
        if (password.trim() != conformpassword.trim()) {
            errors.conformpassword = 'passwords are not match'

        }
        if (errors == {}) {
            dispatch(resetPassword({ oldpassword, password }))

        } else {
            setErrorMessages(errors)
        }
    }
    return (
        <div className='bg-slate-300 w-full h-screen p-0'>
            <header className='h-20 w-full p-5 flex '><a className='font text-3xl mr-4 ' onClick={_ => navigate('/')}>&lt; </a><p className='text-4xl text-gray-500 font-thin'>|</p><h1 className='font-bold text-3xl'>profile</h1> </header>
            <Alert error={error} setState={setError} />
            <div className='w-full h-full p-10  flex flex-col justify-center  items-center gap-10'>

                <input type="password" className='w-4/6 pl-5 h-10' placeholder='old password'
                    value={oldpassword} onChange={e => {
                        setOldPassword(e.target.value)
                    }}
                />
                {errorMessages.oldpassword ? <li className=' text-red-500'>{errorMessages.oldpassword}</li> : null}
                <input type="password" className='w-4/6 pl-5  h-10 ' placeholder='new password'
                    value={password} onChange={e => {
                        setPassword(e.target.value)
                    }} />
                {errorMessages.password ? <li className=' text-red-500'>{errorMessages.password}</li> : null}
                <input type="password" className='w-4/6 pl-5  h-10 ' placeholder='conform password'
                    value={conformpassword} onChange={e => {
                        setConformPassword(e.target.value)
                    }} />
                {errorMessages.conformpassword ? <li className=' text-red-500'>{errorMessages.conformpassword}</li> : null}
                <button className='bg-green-800 w-20 h-10 rounded ml-auto mt-10 mb-20 mr-20' onClick={savehandler}>save</button>
            </div>
        </div>

    )
}

export default ResetPassword
