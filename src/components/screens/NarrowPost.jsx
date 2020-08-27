import React, {useState, useEffect, useContext} from 'react'
import ProfileNarrowFeed from './ProfileNarrowFeed'
import {UserContext} from '../../App'
import './Profile.css'

const NarrowPost = ({posts}) => {
    const {dispatch} = useContext(UserContext)
    const [data, setData] = useState([])

    useEffect(() => {
        setData(posts)
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
            console.log(result)
			dispatch({type:'UPDATE', payload: result})
            localStorage.setItem('user', JSON.stringify(result))
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
            console.log(result)
			dispatch({type:'UPDATE', payload: result})
            localStorage.setItem('user', JSON.stringify(result))
            const updatedData = data.map( item => {
				return item._id === result._id? result : item
            })
            console.log(updatedData)
            setData(updatedData)
        }).catch( err => {
           console.log(err)
        })
    }



    const deletePost = (postId) => {
        fetch('http://localhost:5000/api/post/delete/'+postId, {
            method : 'DELETE',
            headers : {
                "Content-Type"  : "Application/json",
                "Authorization" : "Bearer "+localStorage.getItem('jwt') 
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const updatedData = data.filter( post => {
                return post._id !== result._id
            })
            setData(updatedData)
        })
        .catch(err => {
            console.log(err)
        })
    }





    return (
            <div className="explore-container inprofile">
                { data.map(post => {
                    return <ProfileNarrowFeed  
                    key={post._id+post.createdAt}
                                _id 		={post._id}
                                body 		={post.body}
                                comments    ={post.comments}
                                createdAt   ={post.createdAt}
                                image 	    ={post.image}
                                likes 	    ={post.likes}
                                username    ={post.postedBy.username}
                                fullname    ={post.postedBy.fullname}
                                photo       ={post.postedBy.photo}
                                // userId      ={post.postedBy._id}
                                like        ={like}
                                dislike     ={dislike}
                                save        ={save}
                                unsave      ={unsave}
                                deletePost  ={deletePost}
                    />
                })}	 
            </div>   

    )
}

export default NarrowPost