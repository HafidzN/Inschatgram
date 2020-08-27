import React, { useRef, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useRouteMatch, Route , Switch, useParams } from 'react-router-dom'
import UserList from './UserList'
import NarrowPost from './NarrowPost'
import GridPost from './GridPost'
import Spinner from '../elements/Spinner'
import Modal from '../elements/Modal'
import ModalStatus from '../elements/ModalStatus2'
// import Saved from './Saved'

import util from '../../util/countTime'
import {UserContext} from '../../App'

import './Profile.css'

const ProfileUser = () => {
   const match    = useRouteMatch()
   const history = useHistory()

   const {userId} = useParams()

	const modalRef = useRef()
	const openModal = () => { modalRef.current.openModal() }
	const closeModal = () => {	modalRef.current.closeModal()	}


  const modalRef2 = useRef()
  const openModal2 = () => { modalRef2.current.openModal() }
//   const closeModal2 = () => { modalRef2.current.closeModal() }


   const {state, dispatch} = useContext(UserContext)

   const initialState = {
      isLoading: false,
      isError: false,
   }

   const [states, setStates] = useState(initialState)
   const [posts, setPosts] = useState([])
   const [user, setUser] =useState(null)
   const [hasStory, setHasStory] = useState(null)
   const [isButtonLoading, setButtonLoading] = useState(false)



   const logout = () => {
      localStorage.clear()
      dispatch({type: 'CLEAR'})
      history.push('/login')
   }


   const follow = (id) => {
      setButtonLoading(true)
      fetch('http://localhost:5000/api/user/follow',{
         method:'PUT',
         headers : {
            "Content-Type" :"Application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
         },
         body : JSON.stringify({
            followId: id
         })
      })
      .then(res => res.json())
      .then(result=> {
         console.log(result)
         dispatch({type: 'UPDATE', payload: result})



         const prevState = state
         const updatedState = {
               ...prevState,
               following: result.following
         }


         localStorage.setItem('user', JSON.stringify(updatedState))




         setUser( prevState => ({
            ...prevState,
            followers: [...prevState.followers, {_id: state._id,
                                                 username: state.username, 
                                                 fullname: state.username }]
         }))


         setButtonLoading(false)



      })
      .catch( err=> {
         console.log(err)
         setButtonLoading(false)
      })
   }



   const unfollow = (id) => {
      setButtonLoading(true)
      fetch('http://localhost:5000/api/user/unfollow',{
         method: 'PUT',
         headers : {
            "Content-Type" :"Application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
         },
         body : JSON.stringify({
            followId: id
         })
      })
      .then(res => res.json())
      .then(result=> {
         console.log(result)
         dispatch({type: 'UPDATE', payload: result})


         const prevState = state
         const updatedState = {
               ...prevState,
               following: result.following
         }


         localStorage.setItem('user', JSON.stringify(updatedState))
         setButtonLoading(false)


         setUser(prevState=>{
            const updatedFollowers =  prevState.followers.filter(follower => follower._id!== state._id)
            return {
               ...prevState,
               followers : updatedFollowers
            }
         })




      })
      .catch( err => {
         console.log(err)
         setButtonLoading(false)
      })
   }



    useEffect(()=>{

       let isMounted = true

       const doFetch = () => {
          setStates( prevState => ({
             ...prevState, 
             isLoading: true
          }))
          fetch(`http://localhost:5000/api/user/${userId}`, {
             headers : {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
             }
          })
          .then( res => res.json())
        .then( data => {
           if (isMounted){
               if (data.message === 'you must be logged in'){
                  setStates( prevState =>{
                     return { ...prevState, isLoading: false, isError: true}
                  })
                  logout()
               }

               if (data.message === 'user not found'){
                  setStates( prevState =>{
                     return { ...prevState, isLoading: false, isError: true}
                  })                   
               }

               console.log(data)
               setStates( prevState =>{
                  return {
                     ...prevState,
                     isLoading: false
                  }
               }
             )
               setUser(data.user)
               setHasStory(data.hasStory)
               setPosts(data.posts)             
           }
        })
        .catch( err => {
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
        { (states.isLoading || user === null )?
        <div className='spinner-container shrinked'><Spinner /></div>      
        :

<>
        <Modal ref={modalRef}>
            <ul>
                <li className='red'>Block this user</li>
                <li className='red'>Restrict</li>                  
                <li className='red'>Report User</li>
                <li onClick={closeModal}>Cancel</li>
            </ul>
        </Modal>



      <ModalStatus ref={modalRef2}>
         <div className='status-modal-wrapper'>

           <img className='status-modal-profile-image' src={hasStory && hasStory.image} alt="statuspics"
           />
           <div className='user-detail-container'>
              <div className='image-wrapper'>
                 <img src={user.photo} alt="user"/>
              </div>

              <div className='status-details'>
                <div style={{ fontSize: '1.4rem'}}>{user.username}</div>
                <div style={{ fontSize: '1.1rem'}}>{hasStory && util.timeDiff(hasStory.createdAt)}</div>
              </div>         
           </div>

         </div>
      </ModalStatus>




        <header>
            <div className="profile-container">
                <div className="profile">
                    <div className="profile-image">
                     <div className={`img-cover ${hasStory && `stryed`}`} onClick={openModal2}>
                        <img src={user.photo} alt="user"/>
                     </div>

                    </div>
                    <div className="profile-user-settings">
                    <h1 className="profile-user-name">{user.username ? user.username: `Loading`}</h1>

                    {state.following.includes(user._id)?
                       <button className="btn profile-edit-btn bluebackground" onClick={()=>unfollow(user._id)}>
                       {isButtonLoading? <i className="fa fa-spinner fa-spin"></i>:`Followed`}
                             
                       </button>
                    :
                       <button className="btn profile-edit-btn bluebackground" onClick={()=>follow(user._id)}>
                       {isButtonLoading? <i className="fa fa-spinner fa-spin"></i>:`Follow`}
                       </button>
                    }
 

                    <button className="btn profile-settings-btn" 
                     onClick={openModal}>
                    <i className="fa fa-ellipsis-h" aria-hidden></i></button>
                    </div>
                    <div className="profile-bio">
                    <p><span className="profile-real-name">{user.fullname ? user.fullname: `Loading`}</span></p>
                    <p><span className="">{user.bio ? user.bio: ``}</span></p>
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
                     <div><b>{user.followers.length}</b></div> <div className='grey'>followers</div> 
                   </Link>
                 </li>
                 <li>
                  <Link to={`${match.url}/following`}> 
                     <div><b>{user.following.length}</b></div> <div className='grey'>following</div>
                  </Link>
                 </li>
              </ul>
           </div>

            <div className='post-navigator' >
               <div className='nav-view' >
                  <Link to={`${match.url}`} >
                     <svg aria-label="Posts" className="_8-yf5 " fill="#464646" height="18" viewBox="0 0 48 48" width="19"><path clipRule="evenodd" d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z" fillRule="evenodd"></path></svg>
                  </Link>
               </div>
               <div className='nav-view'>
                  <Link to={`${match.url}/feed`} >
                     <i className="fa fa-square-o"></i>
                  </Link>
               </div>

            </div>

        </nav>

        <Switch> 
          <>                              
                <Route exact path={`${match.url}/`} render={(props)=> <GridPost posts={posts} {...props} />} />
                <Route path={`${match.url}/feed`} render={(props)=> <NarrowPost posts={posts}  {...props} /> } />
                <Route path={`${match.url}/following`} render={(props)=> <UserList users = {user.following}{...props} />}/>
                <Route path={`${match.url}/followers`} render={(props)=> <UserList users = {user.followers}{...props} />}/>
          </>
         </Switch>




        </main>
        

</>
        } 
        </>   


    )
}

export default ProfileUser
