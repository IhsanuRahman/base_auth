import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import user, { deleteUser, getUserData, getUsers, updateUser } from '../../features/user'
import { useNavigate, useParams } from 'react-router-dom'

function UserDetials() {
    const { id } = useParams()
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [superuser, setSuperUser] = useState(false)
    const [errorMessages, setErrorMessages] = useState({})
    const { userData, loading } = useSelector(state => state.user)
    
    let [image, setImage] = useState(null)
    let [currentImage, setCurrentImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const fetchData=()=>{
        dispatch(getUserData(id)).then(e=>{
            setUsername(e.payload.username)
            setFirstname(e.payload.first_name)
            setLastname(e.payload.last_name)
            setEmail(e.payload.email)
            if(e.payload.image ){setCurrentImage(e.payload.image)}
        })
    }
    const savehandler = () => {
        let errors = {}
        if (username.trim() === '') {
            errors.username = 'username is required'
        }
        if (firstname.trim() === '') {
            errors.firstname = 'firstname is required'
        } if (lastname.trim() === '') {
            errors.lastname = 'lastname is required'
        }
        if (email.trim() === '') {
            errors.email = 'email is required'
        }
        if (Object.keys(errors).length === 0) {
            if (image === null)alert('image ins null')
            dispatch(updateUser({ username, firstname, lastname, email, image, superuser, id })).then(e=>{
                setErrorMessages({...e.payload.messages})
                fetchData() 
            }) 
                
        }
        else setErrorMessages({...errors})
    }
    useEffect(() => {
        fetchData()

    }, [loading])

    return (
        <div className='bg-slate-300 w-full h-screen p-0'>
            <header className='h-20 w-full p-5 flex '><a className='font text-3xl mr-4 ' onClick={_ => navigate('/admin')}>&lt; </a><p className='text-4xl text-gray-500 font-thin'>|</p><h1 className='font-bold text-3xl'>Detials</h1> </header>
            <button className='bg-red-600 h-7 w-28 float-right mr-10 rounded text-white font-semibold' onClick={_ => {
                if (window.confirm('are you sure to delete')) {
                    dispatch(deleteUser(id))
                    dispatch(getUsers(''))
                    navigate('/admin')
                }
            }}>delete user</button>
            <div className='w-full h-full p-10  flex flex-col  items-center gap-4'>
                {userData ?
                    <div className=' h-36 rounded-full    w-36 ' style={image ? { backgroundImage: `url('${URL.createObjectURL(image)}')`, backgroundPosition: 'center', backgroundSize: 'contain' } : currentImage != null ? { backgroundImage: `url('${currentImage}')`, backgroundPosition: 'center', backgroundSize: 'contain' } : { backgroundColor: '#374151' }}>

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
                    </div> : null}
                <input type="text" id='username' className={`w-4/6 mt-5 pl-5 font-semibold text-2xl text-center h-7 bg-transparent focus:bg-white ${errorMessages.username ? 'border-red-700 border-2' : ''}`} placeholder='username' value={username}
                    onChange={e => {
                        setUsername(e.target.value)
                    }}
                />
                {errorMessages.username ? <li className=' text-red-500'>{errorMessages.username}</li> : null}
                <div className='flex w-4/6 gap-3  h-7'>
                    <input type="text" className={`w-1/2 pl-5 h-7  bg-transparent focus:bg-white ${errorMessages.firstname ? 'border-red-700 border-2' : ''}`} placeholder='firstname' aria-label='firstname'
                        value={firstname} onChange={e => {
                            setFirstname(e.target.value)
                        }} />
                    <input type="text" className={`w-1/2 pl-5 h-7 bg-transparent focus:bg-white ${errorMessages.lastname ? 'border-red-700 border-2' : ''}`} placeholder='lastname'
                        value={lastname} onChange={e => {
                            setLastname(e.target.value)
                        }}
                    />
                </div>
                <div className=' gap-2 flex w-4/6'>{errorMessages.firstname ? <li className=' text-red-500 w-1/2'>{errorMessages.firstname}</li> : null}
                    {errorMessages.lastname ? <li className=' text-red-500 w-1/2'>{errorMessages.lastname}</li> : null}</div>
                <input type="email" className={`w-4/6 pl-5  h-7 bg-transparent focus:bg-white ${errorMessages.email ? 'border-red-700 border-2' : ''}`} placeholder='email'
                    value={email} onChange={e => {
                        setEmail(e.target.value)
                    }} />
                {errorMessages.email ? <li className=' text-red-500'>{errorMessages.email}</li> : null}
                <div className='flex gap-1'>is_superuser:<input type="checkbox" checked={superuser} onClick={e => {

                    setSuperUser(e.target.checked)
                }} /></div>
                <button className='bg-yellow-500 rounded w-44 h-8 mr-auto ml-64 mt-10 text-white font-semibold'>change password</button>
                <button className='bg-green-800 w-20 h-10 rounded ml-auto mt-auto mb-20 mr-20 text-white font-semibold' onClick={savehandler}>save</button>
            </div>

        </div>
    )
}

export default UserDetials
