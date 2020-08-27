import React, { useState } from 'react'
import {Link, useHistory } from 'react-router-dom'

import ios     from '../assets/ios.png'
import android from '../assets/android.png'
import './Login.css'


const Signup = () => {

   const history = useHistory()

   const [fullname, setFullname] = useState('')
   const [username, setUsername] = useState('')
   const [email, setEmail]       = useState('')
   const [password, setPassword] = useState('')
   const [loading, setLoading]   = useState(false)
   const [{ errorPassword,
            errorEmail, 
            errorFullname,
            errorUsername,
            failError
   }, setError]       = useState({errorPassword:'', errorEmail:'', failError: ''})
   
   const signUp = () => {
      setLoading(true)
      fetch('http://localhost:5000/api/auth/signup',{
         method  : 'POST',
         headers : {
            "Content-Type": "application/json",
         },
         body    : JSON.stringify({
            email,
            fullname,
            username,
            password
         })
      })
      .then(res => res.json())
      .then(data=>{
         
         console.log(data)
         if (typeof data.message.errors!== undefined){
            setLoading(false)
            const {errors} = data.message
            console.log(errors)

            setError( currentState =>({
               ...currentState,
               errorPassword : errors.find(err => err.param === 'password')?errors.msg:'',
               errorEmail    : errors.find(err => err.param === 'email')   ?errors.msg:'',
               errorFullname : errors.find(err => err.param === 'fullname')?errors.msg:'',
               errorUsername : errors.find(err => err.param === 'username')?errors.msg:''
               // errorEmail    : errors.find(err => err.param === 'email')   ? errors.find(err => err.param === 'email'   ).msg:'',               
               // errorEmail: errors.filter(err=> err.param === 'email')&&'invalid email' ----> other alternative
            }))
            setPassword('')            
            return
         }

            setLoading(false)
            history.push('/login')

         })
      // .catch( err => {
      //    console.log(err)
      //    setLoading(false)
      //    setError( currentState => ({
      //       ...currentState,
      //       failError: 'Something went wrong, try again',
      //       errorPassword: '',
      //       errorEmail:'',
      //       errorFullname:'',
      //       errorUsername:''
      //    }))
      // })
   }

    return (
        <div id="wrapper">
           <div className="container">
              <div className="form-data" style={{margin:'0 auto'}}>
                 <div className='form'>
                    <div className="logo">
                       Inschatgram
                    </div>
                    {failError && <div className="error">{failError}</div>  }
                    <input type="text"
                           placeholder='Mobile Number or Email'
                           value = {email}
                           onChange={(e)=> setEmail(e.target.value)}
                    />
                    {errorEmail ? <div className="error">{errorEmail}</div> :null }
                    <input type="text"
                           placeholder='Full Name'
                           value = {fullname}
                           onChange={(e)=> setFullname(e.target.value)}
                    />
                    {errorFullname && <div className="error">{errorFullname}</div>  }
                    <input type="text"
                           placeholder='Username'
                           value = {username}
                           onChange= {(e)=> setUsername(e.target.value)}
                    />
                    {errorUsername && <div className="error">{errorUsername}</div>  }
                    <input type="password"
                           placeholder='Password'
                           value = {password}
                           onChange={(e)=> setPassword(e.target.value)}
                    />
                    {errorPassword && <div className="error">{errorPassword}</div>  }
                    <button type='submit' className='form-btn'
                       onClick = {()=>signUp()}>
                       {loading?<i className="fa fa-spinner fa-spin"></i>:`Sign up`}
                       </button>
                    <span className="has-separator">OR</span>
                    <Link to='/#' className='facebook-login'>
                       <span>Log in with facebook</span>
                    </Link>
                 </div>
                 <div className="sign-up">
                    Have an account?&nbsp;<Link to='/login'>Log in</Link>
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
        </div>
    )
}

export default Signup
