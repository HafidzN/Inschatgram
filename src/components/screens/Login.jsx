import React, {useState, useContext } from 'react'
import {Link, useHistory} from 'react-router-dom'

import ios     from '../assets/ios.png'
import android from '../assets/android.png'

import {UserContext} from '../../App'

import './Login.css'


const Login = () => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const year = new Date().getFullYear()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const login = () => {
       setLoading(true)
       fetch('http://localhost:5000/api/auth/login', {
          method  : 'POST',
          headers : {
             "Content-Type": "application/json"
          },
          body: JSON.stringify({
             email,
             password
          })
       }).then(res => res.json())
       .then(data => {
          console.log(data)
          if (data.message){
             setLoading(false)
             setError(data.message)
             setEmail('')
             setPassword('')
             return
          }
          else {
             setLoading(false)             
             localStorage.setItem('user', JSON.stringify(data.user))
             localStorage.setItem('jwt', data.token)
             console.log(data.user)
             dispatch({type: 'USER', payload: data.user})
             history.push('/')
          }
       })
       .catch( err => {
          setLoading(false)
          setPassword('')
          setError('Something went wrong, try again')
       })
    }

    return (
        <div id="wrapper">
           <div className="container">
              <div className="phone-app-demo"></div>
              <div className="form-data">
                 <div className='form'>
                    <div className="logo">
                       Inschatgram
                    </div>
                    {error && <div className="error">{error}</div>}
                    <input type="text"
                           placeholder='Phone number, username, or email'
                           value = {email}
                           onChange={(e)=> setEmail(e.target.value)}
                    />
                    <input type="password"
                           placeholder='Password'
                           value = {password}
                           onChange = {(e)=> setPassword(e.target.value)}
                    />
                    <button type='submit' className='form-btn' onClick={()=>login()}>
                    {loading?<i className="fa fa-spinner fa-spin"></i>:`Log In`}
                    </button>
                    <span className="has-separator">OR</span>
                    <Link to='/#' className='facebook-login'>
                       <span>Log in with facebook</span>
                    </Link>
                    <Link to='/#' className='password-reset'>Forgot password</Link>
                 </div>
                 <div className="sign-up">
                    Don't have an account?&nbsp;<Link to='/signup'>Sign up</Link>
                 </div>
                 <div className="get-the-app">
                    <span>Get the app</span>
                    <div className="badges">
                       <img src={ios} alt="ios"/>
                       <img src={android} alt="android"/>
                    </div>
                 </div>
              </div>
           </div>

           <footer>
              <div className="container">

                 <div className="copyright-notice">
                    <b> &copy; {year} Hafidz N.</b>
                 </div>
              </div>
           </footer>

        </div>
    )
}

export default Login
