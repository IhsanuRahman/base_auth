import Home from "./user/pages/Home";
import Dashboard  from "./admin/pages/Dashboard";
import Login from "./user/pages/Login";
import SignUp from "./user/pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './features/user';
import Profile from "./user/pages/Profile";
import AdminLogin from "./admin/pages/AdminLogin";
import UserDetials from "./admin/pages/UserDetials";
import CreateUser from "./admin/pages/CreateUser";
import ResetPassword from "./user/pages/ResetPassword";
function App() {
  const dispatch = useDispatch();

	useEffect(() => {
		console.log(dispatch(checkAuth()))
	}, []);
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<Dashboard/>}/>
          <Route path="/admin/create" element={<CreateUser/>}/>
          <Route path="/admin/details/:id" element={<UserDetials/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/change-password" element={<ResetPassword/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/signup" element={<SignUp/>}/>
        </Routes>
      </Router>
  );
}

export default App;
