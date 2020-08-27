import React, { Fragment, useEffect, createContext, useContext, useReducer } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

import Login from './components/screens/Login'
import signup from './components/screens/Signup'
import Navbar from './components/screens/Navbar'
import EditProfile from './components/screens/EditProfile'
import CreatePost from './components/screens/CreatePost'
import CreateStory from './components/screens/CreateStory'
import Profile from './components/screens/Profile'
import ProfileUser from './components/screens/ProfileUser'
import Home from './components/screens/Home'
import Explore from './components/screens/Explore'
import Comments from './components/screens/Comments'


import { userReducer, initialState } from './reducers/userReducer'

import './App.css'

export const UserContext = createContext()

const Routes = () => {
  const history = useHistory()

  const { state, dispatch } = useContext(UserContext)
  console.log(state)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if(user && user!==undefined){
      dispatch({type: 'USER', payload: user})
    } else {

      dispatch({type:'CLEAR'})
      localStorage.clear()    
      history.push('/login')
    }

    //eslint-disable-next-line
  }, [])

  return (
    <Fragment>

       <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/signup' component={signup} />       

          <>
          <Navbar/>
            <Route exact path='/' component={Home} />
            <Route path='/explore' component={Explore} />
            <Route path='/create' component={CreatePost} /> 
            <Route path='/create-story' component = {CreateStory} />
            <Route path='/profile' component={Profile} />
            <Route path='/user/:userId' component={ProfileUser} />
            <Route path='/accounts-edit' component={EditProfile} />
            <Route path='/comments/:postId' component={Comments} />         
            {/* <Route component={NotFound} />  */}
          </>
         
       </Switch>


    
    </Fragment>
  )
}



const App = () => {
  const [state, dispatch] = useReducer(userReducer, initialState)




  return (
    <UserContext.Provider value ={{ state, dispatch}}>
      <Fragment>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
      </Fragment>
    </UserContext.Provider>
  )
}

export default App
