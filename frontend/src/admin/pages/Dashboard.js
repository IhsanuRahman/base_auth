import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserData, getUsers, logout } from '../../features/user';

function Dashboard() {
   const { isAuthenticated, user, loading, users } = useSelector(state => state.user);
   const dispatch = useDispatch()
   const navigate = useNavigate();

   useEffect(() => {
      if (!isAuthenticated && !loading && Object.keys(user).length === 0 && !user.is_admin) {
         navigate('/admin/login')

      } else dispatch(getUsers(''))
   }, [user])



   return (
      <div>
         <header className='h-20 w-full p-5 flex justify-between border-b-4 mb-3 '><h1 className='font-bold text-3xl'>Dashboard</h1> <button className='bg-red-600 h-7 w-20   text-white font-semibold rounded' onClick={_ => {
            if (window.confirm('are sure to logout')) { 
               dispatch (logout())
               navigate('/admin/login') }
         }}>Logout</button></header>
         <input type="search" placeholder='search' className="w-4/6 h-10 pl-5 ml-20 border-2 border-black rounded"
            onChange={e => {
               dispatch(getUsers(e.target.value))
            }}
         />
         <button className='bg-green-600 h-10 w-28 float-right mr-10 m-0  rounded text-white font-semibold' onClick={_ => navigate('/admin/create')}>create user</button>
         <ul className="max-w-full p-10 divide-y divide-gray-200 dark:divide-gray-700">

            {users.length !=0? users.map((user) =>
               <li key={user.id} className="pb-3 sm:pb-4 cursor-pointer" onClick={_ => {
                 
                  navigate(`/admin/details/${user.id}`)
               }
               }>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">

                     <div className="flex-1 min-w-0 ml-10 mt-5">
                        <p className="text-sm font-medium text-gray-900 truncate">
                           {user.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                           {user.email}
                        </p>
                     </div>
                     <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        {user.is_superuser ? 'super user' : 'normal user'}
                     </div>
                  </div>
               </li>
            )
            :<h4 className='p-auto w-full flex justify-center text-2xl'>users not found</h4>}

         </ul>

      </div>
   )
}

export default Dashboard
