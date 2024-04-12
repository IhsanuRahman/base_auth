import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies()
const cookie = cookies.get('csrftoken')
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    registered: false,
    users:[],
    userData:{}
};
export const register = createAsyncThunk(
    'users/signup',
    async ({ username, firstname, lastname, email, password }, thunkAPI) => {
        const body = JSON.stringify({
            'username': username,
            "first_name": firstname,
            "last_name": lastname,
            "email": email,
            "password": password,
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/signup',
                body, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie
                },
                credentials: "same-origin",

            });

            const data = await res;

            if (res.status === 201) {
                alert('signup success')
                

                return data;
            } else {
                return thunkAPI.rejectWithValue(res.data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);
export const login = createAsyncThunk(
    'users/login',
    async ({ username, password }, thunkAPI) => {
        const user = JSON.stringify({
            username,
            password,
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login',
                user,
                {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "same-origin",
                }
            );

            const data = await res;

            if (res.status === 200) {
                const { dispatch } = thunkAPI;
                localStorage.setItem('access_token', data.data.access)
                localStorage.setItem('refresh_token', data.data.refresh)

                dispatch(getUser());
                alert('login success')
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const adminLogin = createAsyncThunk(
    'users/adminLogin',
    async ({ username, password }, thunkAPI) => {
        const user = JSON.stringify({
            username,
            password,
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/login',
                user,
                {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "same-origin",
                }
            );

            const data = await res;

            if (res.status === 200) {
                const { dispatch } = thunkAPI;
                localStorage.setItem('access_token', data.data.access)
                localStorage.setItem('refresh_token', data.data.refresh)

                dispatch(getUser());
                alert('login success')
                return data;
            } else {
                alert(res.message)
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {

            alert(JSON.stringify(err.response.data))
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
    try {
        const res = await axios.post('http://127.0.0.1:8000/api/user', JSON.stringify({
            'token': localStorage.getItem('refresh_token')
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,

            },

        })
        const data = await res.data

        if (res.status === 200) {
            return data;
        } else {
            console.log(data)
            return thunkAPI.rejectWithValue(data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});
export const checkAuth = createAsyncThunk(
    'users/verify',
    async (_, thunkAPI) => {
        const cookies = new Cookies()
        const cookie = cookies.get('csrftoken')

        try {
            if (localStorage.getItem('access_token') == null || localStorage.getItem('refresh_token') == null) {
                return thunkAPI.rejectWithValue(response.data);

            }
            const response = await axios.post('http://127.0.0.1:8000/api/token/verify', JSON.stringify({
                'token': localStorage.getItem('refresh_token')
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,

                },

            }).catch(e => {
                console.log(e.message)
                return thunkAPI.rejectWithValue(response.data);
            })
            
            if (response.status == 200){
            const { dispatch } = thunkAPI;
                
            dispatch(getUser());

            return response.data}
            else{
                return thunkAPI.rejectWithValue(response.data);
            }
        }
        catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
)
export const updateProfile = createAsyncThunk(
    'users/user/update',
    async ({ username, firstname, lastname, email, image }, thunkAPI) => {
        let form_data = new FormData();
        if (image)
            form_data.append("image", image, image.name);
        form_data.append("username", username);
        form_data.append("firstname", firstname);
        form_data.append("lastname", lastname);
        form_data.append('email', email)
        const body = JSON.stringify({
            'username': username,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/user/update',
                form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res;
            console.log(data);

            if (res.status === 201) {
                alert('success')

                return data;
            } else {

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
    const cookies = new Cookies()
    const cookie = cookies.get('csrftoken')
    try {
        const refresh=localStorage.getItem('refresh_token')
        const access= localStorage.getItem('access_token')
        if (access==null||refresh==null){
            return thunkAPI.rejectWithValue('token not founded')
        }
        const res = await axios.post("http://127.0.0.1:8000/api/logout", {
            'refresh_token': localStorage.getItem('refresh_token'),
            'access_token': localStorage.getItem('access_token'),
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'X-CSRFToken': cookie,
                },

            }
        )
        if (res.status === 200) {
            alert('logout success')

            return res.data;
        } else {
            alert(res.data.message)

            return thunkAPI.rejectWithValue(res.data);
        }
    }
    catch (err) {
        alert(err.message)
        return thunkAPI.rejectWithValue(err.response.data);
    }

})
export const getUsers = createAsyncThunk(
    'users/users/',
    async (search, thunkAPI) => {
       
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/users',
                JSON.stringify({'search':search}), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res.data.users;
            console.log('data',data);

            if (res.status === 200) {

                return data;
            } else {
                console.log('err',res)

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(err.response.data.message.non_field_errors)
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const getUserData = createAsyncThunk(
    'users/userData/',
    async (id, thunkAPI) => {
       
       

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/user',
                JSON.stringify({'id':id}), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res.data.userData;
            console.log('data',data);

            if (res.status === 200) {
                console.log('userData',data);
                
                return data;
            } else {
                console.log('err',res)

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(err.response.data.message.non_field_errors)
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const updateUser = createAsyncThunk(
    'users/user/edit',
    async ({ username, firstname, lastname, email, image,superuser,id }, thunkAPI) => {
        let form_data = new FormData();
        if (image!=null){
            console.log('passing image')
            form_data.append("image", image, image.name);}
        form_data.append("username", username);
        form_data.append("first_name", firstname);
        form_data.append("last_name", lastname);
        form_data.append('email', email)
        form_data.append('id', id)
        form_data.append('is_superuser', superuser)
        

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/user/update',
                form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res;
            console.log(data);

            if (res.status === 200) {
                alert('success')

                return data;
            } else {
                console.log(res.data.message)
                alert(JSON.stringify(res.data.message))

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(JSON.stringify(err.response.data))
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const createUser = createAsyncThunk(
    'users/user/create',
    async ({ username, firstname, lastname, email, image,superuser ,password}, thunkAPI) => {
        let form_data = new FormData();
        if (image!==null)
            form_data.append("image", image, image.name);
        form_data.append("username", username);
        form_data.append("firstname", firstname);
        form_data.append("lastname", lastname);
        form_data.append('email', email)
        form_data.append('password', password)
        form_data.append('is_superuser', superuser)
        const body = JSON.stringify({
            'username': username,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/user/create',
                form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res;
            console.log(data);

            if (res.status === 200) {
                alert('success')

                return data;
            } else {
                console.log(res.data.message)
                alert(res.data.message)

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(JSON.stringify(err.response.data.message))
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const deleteUser = createAsyncThunk(
    'users/user/delete',
    async (id, thunkAPI) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/admin/user/delete',
                JSON.stringify({'id':id}), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res.data.message;
            console.log('data',data);

            if (res.status === 200) {
                const dispatch =useDispatch()
                dispatch(getUsers(''))
                alert('user deletion success')
                return data;
            } else {
                console.log('err',res.data.message)

                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(err.response.data.message)
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const resetPassword = createAsyncThunk(
    'users/password/change',
    async ({oldpassword,password}, thunkAPI) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/change-password',
                JSON.stringify({
                    'old_password':oldpassword,
                    'password':password,
                }), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: "same-origin",

            });

            const data = await res.data;
            console.log('data',data);

            if (res.status === 200) {
                alert('password is changed')
                
                return data;
            } else {
                console.log('err',res.data.message)
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            alert(err.response.data.message)
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetRegistered: state => {
            state.registered = false;
        },
        setToUser:state=>{
            state.user.username='user'
        }
    },
    extraReducers: builder => {
        builder.addCase(register.pending, state => {
            state.loading = true;
        })
            .addCase(register.fulfilled, state => {
                state.loading = false;
                state.registered = true;

            })
            .addCase(register.rejected, state => {
                state.loading = false;
            })
            .addCase(login.pending, state => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                console.log(action.payload.data);


            })
            .addCase(login.rejected, state => {
                state.loading = false;
            }).addCase(adminLogin.pending, state => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                console.log(action.payload.data);


            })
            .addCase(adminLogin.rejected, state => {
                state.loading = false;
            }).addCase(checkAuth.pending, state => {
                state.loading = true;
            })
            .addCase(getUser.pending, state => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                try {
                    state.user = action.payload;
                    console.log(state.user)
                } catch (error) {
                    alert(error.message)
                }

            }).addCase(getUser.rejected, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user={}

            }).addCase(checkAuth.fulfilled, state => {
                state.loading = false;
                const s1 = state.isAuthenticated
                console.log();
                
                state.isAuthenticated = true;
                console.log('changed =',s1 !== state.isAuthenticated)
                console.log("checkAuth");
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user={}
                console.log('checkauth rejected');
                
            }).addCase(logout.pending, state => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = {};
                localStorage.clear()
            })
            .addCase(logout.rejected, state => {
                state.loading = false;
            }).addCase(getUsers.fulfilled,(state,action)=>{
                console.log('full',action.payload);
                
                state.users=action.payload
            }).addCase(getUserData.pending,(state,action)=>{
                state.loading=true
            }).addCase(getUserData.fulfilled,(state,action)=>{
                console.log('full',action.payload);
                
                state.userData=action.payload
            }).addCase(getUserData.rejected,(state,action)=>{
                state.loading=false
            })
    }
})
export const {resetRegistered} = userSlice.actions
export default userSlice.reducer