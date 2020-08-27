import React, { useRef, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useRouteMatch, Route , Switch } from 'react-router-dom'
import UserList from './UserList'
import NarrowPost from './NarrowPost'
import GridPost from './GridPost'
import Spinner from '../elements/Spinner'
import Modal from '../elements/Modal'
import Saved from './Saved'

import {UserContext} from '../../App'

import './Profile.css'

const Profile = () => {
   const match = useRouteMatch()

	const modalRef = useRef()

	const openModal = () => {
		modalRef.current.openModal()
	}

	const closeModal = () => {
		modalRef.current.closeModal()
	}

   const { state, dispatch} = useContext(UserContext)
   const history = useHistory()


   const initialState = {
      isLoading: false,
      isError: false,
      loadedData: [],
   }

   const [states, setStates] = useState(initialState)
   const [posts, setPosts] = useState([])
   const [user, setUser] = useState(null)

   const logout = () => {
      localStorage.clear()
      dispatch({type: 'CLEAR'})
      history.push('/login')
   }


    useEffect(()=>{
       let isMounted = true

       const doFetch = () => {
          setStates( prevState => ({
             ...prevState, 
             isLoading: true
          }))
          fetch('http://localhost:5000/api/user/profile', {
             headers : {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
             }
          })
          .then( res => res.json())
        .then( data => {
           if (isMounted){
               if (data.message==='you must be logged in'){
                  console.log(data.message)

                  setStates( prevState =>{
                     return { ...prevState, isLoading: false, isError: true}
                  })

                  logout()

               }

               if(data.message === 'MongoNetworkError'){
                  return
               }

               console.log(data)
               setUser(data.user)
               setPosts(data.posts)
               setStates( prevState =>{
                  return {
                     ...prevState,
                     isLoading: false,
                  }
               }
             )
           }
        })
        .catch( err => {
           console.log(err)
           if (isMounted){
              setStates( prevState =>{
                 return { ...prevState, isLoading: false, isError: true}
              })
           }
        })

       }


       doFetch()

       return ()=>{
          isMounted = false
       }
       
       //eslint-disable-next-line
    }, [])




    return (

        <>
        <Modal ref={modalRef}>
            <ul>
                <li >Change Password</li>
                <li onClick={()=> console.log('Upload Photo')}>Nametag</li>                  
                <li >App and Websites</li>
                <li >Notifications</li>                
                <li >Privacy and Security</li>
                <li >Login Activity</li>
                <li >Emails from Inschatgram</li>
                <li >Report a Problem</li>
                <li onClick={()=>logout()}>Log Out</li>
                <li onClick={closeModal}>Cancel</li>
            </ul>
        </Modal>

        <header>
            <div className="profile-container">
                <div className="profile">
                    <div className="profile-image">
                    <div className='img-cover'>
                        <img src={state!== null?state.photo: 'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png'} alt="user"                        />
                    </div>
                    </div>
                    <div className="profile-user-settings">
                    <h1 className="profile-user-name">{user && (user.fullname ? user.username: ``)}</h1>

                       <button className="btn profile-edit-btn">
                          <Link to='/accounts-edit'>
                             Edit Profile
                          </Link>
                       </button>

                    <button className="btn profile-settings-btn" 
                     onClick={openModal}>
<svg aria-label="Options" className="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z" fillRule="evenodd"></path></svg>
                    </button>
                    </div>
                    <div className="profile-bio">
                    <p><span className="profile-real-name">{user && (user.fullname ? user.fullname: ``)}</span></p>
                    <p><span className=''>{user && (user.bio ? user.bio: ``)}</span></p>
                    </div>
                </div>
            </div>
        </header>

        <main>

        <nav className='navigator'>
           <div className='profile-statistics'>
              <ul>
                 <li><div><b>{posts? posts.length: 0}</b></div> <div className='grey'>posts</div></li>
                 <li>
                   <Link to={`${match.url}/followers`}> 
                     <div><b>{user!== null ? user.followers.length: 0}</b></div> <div className='grey'>followers</div> 
                   </Link>
                 </li>
                 <li>
                  <Link to={`${match.url}/following`}> 
                     <div><b>{user!== null ? user.following.length:0}</b></div> <div className='grey'>following</div>
                  </Link>
                 </li>
              </ul>
           </div>

            <div className='post-navigator' >
               <div className='nav-view' >
                  <Link to='/profile' >
                     <svg aria-label="Posts" className="_8-yf5 " fill="#464646" height="18" viewBox="0 0 48 48" width="19"><path clipRule="evenodd" d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z" fillRule="evenodd"></path></svg>
                  </Link>
               </div>
               <div className='nav-view'>
                  <Link to={`${match.url}/feed`} >
                     <i className="fa fa-square-o"></i>
                  </Link>
               </div>
               <div className='nav-view'>
                  <Link to={`${match.url}/saved`}>
                     <i className="fa fa-bookmark-o"></i>
                  </Link>
               </div>
            </div>

        </nav>

        <Switch> 
          <>                              {/*  add another react fragment layer after switch will clean you out from warning message: React does not recognize the `computedMatch` prop on a DOM element   */}
           {states.isLoading || user===null?
                  <div className='spinner-container inprof shrinked'><Spinner /></div>          
             :
                <>
                <Route exact path='/profile' render={(props)=> <GridPost posts={posts} {...props} />} />
                <Route path={`${match.url}/feed`} render={(props)=> <NarrowPost posts={posts} {...props} /> } />
                <Route path={`${match.url}/saved`} render={(props)=> <GridPost posts={ user.saved.reverse()} {...props} /> } />
                <Route path={`${match.url}/following`} render={(props)=> <UserList users = {user.following}{...props} />}/>
                <Route path={`${match.url}/followers`} render={(props)=> <UserList users = {user.followers}{...props} />}/>
                </>
             }
          </>
         </Switch>




        </main>
        
    </>
    )
}

export default Profile
