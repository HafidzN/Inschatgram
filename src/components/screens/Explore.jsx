import React, { useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Spinner from '../elements/Spinner'
import Search from './Search'
import ExploreItem from './ExploreItem'
import {UserContext} from '../../App'

import './Explore.css'

const Explore = () => {



    const [data, setData] = useState([])
    const [usersWhoHaveStories, setUsersWhoHaveStories ] = useState([])
    const [loading, setLoading] = useState(false)
    const [microLoading, setMicroloading] = useState(false)

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    useEffect(()=>{

        let isMounted = true

        const doFetch = () => {
            setLoading(true)
            fetch('http://localhost:5000/api/post/explore', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if (isMounted){



                    if (data.message==='you must be logged in'){
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                        history.push('/login')
                    }

                    setLoading(false)
                    console.log(data)
                    setData(data.posts)




                }
            })
            .catch(err=> {
                if (isMounted){
                    setLoading(false)
                }
            })


        }


        doFetch()

       return ()=>{
          isMounted = false
       }

       //eslint-disable-next-line
    }, [])





    useEffect(()=>{

        let isMounted = true

        const doFetch = () => {
            setLoading(true)
            fetch('http://localhost:5000/api/story/explore', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if (isMounted){



                    if (data.message==='you must be logged in'){
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                        history.push('/login')
                    }


                    setUsersWhoHaveStories(data.stories)
                    setLoading(false)




                }
            })
            .catch(err=> {
                if (isMounted){
                    setLoading(false)
                }
            })


        }


        doFetch()

       return ()=>{
          isMounted = false
       }

       //eslint-disable-next-line
    }, [])








   const like = id => {
        fetch('http://localhost:5000/api/post/like', {
            method: 'PUT',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization": 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        })
		.then( res => res.json())
        .then( result => {
            console.log(result)
            const updatedData = data.map( item => {
				return item._id === result._id ? result: item
            })
            setData(updatedData)
        }).catch( err => {
           console.log(err)
        })
   }



    const dislike = id => {
        fetch('http://localhost:5000/api/post/dislike', {
            method: 'PUT',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization": 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then( res => res.json())
        .then( result => {
            console.log(result)
            const updatedData = data.map( item => {
				return item._id === result._id? result : item
            })
            setData(updatedData)
        }).catch( err => {
           console.log(err)
        })
    }






    const save = id => {
        fetch('http://localhost:5000/api/user/save', {
            method: 'PUT',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization": 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then( res => res.json())
        .then( result => {
            // console.log(result)
			dispatch({type:'UPDATE', payload: result})

            const prevState = state
            const updatedState = { ...prevState, saved: result.saved}

            localStorage.setItem('user', JSON.stringify(updatedState))
            const updatedData = data.map( item => {
				return item._id === result._id? result : item
            })
            setData(updatedData)
        }).catch( err => {
           console.log(err)
        })
    }


    const unsave = id => {
        fetch('http://localhost:5000/api/user/unsave', {
            method: 'PUT',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization": 'Bearer '+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then( res => res.json())
        .then( result => {
			dispatch({type:'UPDATE', payload: result})

            const prevState = state
            const updatedState = { ...prevState, saved: result.saved}

            localStorage.setItem('user', JSON.stringify(updatedState))
            const updatedData = data.map( item => {
				return item._id === result._id? result : item
            })
            setData(updatedData)
        }).catch( err => {
           console.log(err)
        })
    }







   const follow = (id) => {
      setMicroloading(true)
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

         

         setMicroloading(false)

      })
      .catch( err=> {
         setMicroloading(false)
         console.log(err)
      })
   }



   const unfollow = (id) => {
      setMicroloading(true)
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




         setMicroloading(false)

      })
      .catch( err => {
         setMicroloading(false)
         console.log(err)
      })
   }





    return (
        <div className='explore-container'>


        {loading?
         <div className='spinner-container shrinked'><Spinner /></div>        
        :
        <>
            <Search usersWhoHaveStories = {usersWhoHaveStories}/>

            <div className="explore-container-2">
                <div className="gallery">
                {data.map((post, i )=>{
                    return <ExploreItem key      ={post._id}
                                        _id      ={post._id} 
                                        index    ={i+1}
                                        likes    ={post.likes}
                                        comments ={post.comments}
                                        createdAt={post.createdAt}
                                        body     ={post.body}
                                        image    ={post.image}
                                        postedBy ={post.postedBy.username}
                                        photo    ={post.postedBy.photo}
                                        userId   ={post.postedBy._id}
                                        like     ={like}
                                        dislike  ={dislike}
                                        save     ={save}
                                        unsave   ={unsave}
                                        follow   ={follow}
                                        unfollow ={unfollow}
                                        microLoading = {microLoading}
                                        usersWhoHaveStories = {usersWhoHaveStories}

                    />
                })}
                </div>
            </div>
        </>
        }
        </div>

    )
}

export default Explore
