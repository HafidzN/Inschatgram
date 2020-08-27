import React, {useContext, useState, useEffect} from 'react'
import Spinner from '../elements/Spinner'
import UserItem from './UserItem'

import {UserContext} from '../../App'

import './UserList.css'



const UserList = ({users}) => {
   console.log(users)

   const [usersWhoHaveStories, setUsersWhoHaveStories] = useState([])

   const {dispatch} = useContext(UserContext)





    useEffect(()=>{

        let isMounted = true

        const doFetch = () => {
            fetch('http://localhost:5000/api/story/explore', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if (isMounted){



                    if (data.message==='you must be logged in'){
                       console.log('you must be logged in')
                        // localStorage.clear()
                        // dispatch({type: 'CLEAR'})
                        // history.push('/login')
                    }


                    setUsersWhoHaveStories(data.stories)
                    



                }
            })
            .catch(err=> {
                if (isMounted){
                    console.log(err)
                }
            })


        }


        doFetch()

       return ()=>{
          isMounted = false
       }

       //eslint-disable-next-line
    }, [])








   const follow = (id) => {
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
         localStorage.setItem('user', JSON.stringify(result))

      })
      .catch( err=> {
         console.log(err)
      })
   }


    return (
        <ul className='explore-container inprofile' >
        {users?
            users.map( user => {
               return  <UserItem  key      ={user._id}
                                  userId   ={user._id}
                                  username ={user.username}
                                  fullname ={user.fullname}
                                  photo    ={user.photo}
                                  follow   ={follow}
                     usersWhoHaveStories   ={usersWhoHaveStories}
                                  />
               }
            )
        :
        <div className='spinner-container inprof shrinked'><Spinner /></div>           
        }

           
        </ul>
    )
}

export default UserList
