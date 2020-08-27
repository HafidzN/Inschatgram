import React, { useEffect, useState, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import CommentItem from './CommentItem'

import Spinner from '../elements/Spinner'
import util from '../../util/countTime'


import {UserContext} from '../../App'

import './Comments.css'


const Comments = () => {
    const {postId} = useParams()
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)



    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const [text, setText] = useState('')


    useEffect(() => {
        let isMounted = true

       const doFetch = () => {

          setLoading(true)
          fetch(`http://localhost:5000/api/post/getcomments/${postId}`, {
             headers : {
                'Authorization': 'Bearer '+localStorage.getItem('jwt')
             }
          })
          .then( res => res.json())
        .then( data => {
           if (isMounted){
               if (data.message==='you must be logged in'){
                  console.log(data.message)

                  dispatch({type:'CLEAR'})
                  localStorage.clear()

                  setLoading(false)

               }

               console.log(data)
               setPost(data)
               setComments(data.comments)   
               setLoading(false)          
           }
        })
        .catch( err => {
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



    const comment = (text, postId) => {
        fetch('http://localhost:5000/api/post/comment', {
            method  : 'PUT',
            headers : {
                "Authorization": 'Bearer '+localStorage.getItem('jwt'),
                "Content-Type" : "application/json"
            },
            body :JSON.stringify({
                postId,
                text
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setComments(result.comments)
        })
        .catch(error => {
            console.log(error)
        })
    }



    const deleteComment = (postId, commentId) => {
        fetch(`http://localhost:5000/api/post/deletecomment/${commentId}`, {
            method  : 'DELETE',
            headers : {
                "Authorization": 'Bearer '+localStorage.getItem('jwt'),
                "Content-Type" : "application/json"
            },
            body :JSON.stringify({
                postId
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const updatedComment = comments.filter(comment=> {
                return comment._id !== commentId
            })
            setComments(updatedComment)
        })
        .catch(error => {
            console.log(error)
        })
    }






    return (
    <>

    {(loading || post===null)? 
            <div className='spinner-container shrinked'><Spinner /></div>        
    :
    <>

        <div className="home-post-container">
        <div className="page-nav">
            <div className="title">
                <div className="arrow-nav" onClick={()=> history.goBack()}>
                        <span style={{display: 'inline-block', transform: 'rotate(270deg)'}}><svg aria-label="Back" className="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M40 33.5c-.4 0-.8-.1-1.1-.4L24 18.1l-14.9 15c-.6.6-1.5.6-2.1 0s-.6-1.5 0-2.1l16-16c.6-.6 1.5-.6 2.1 0l16 16c.6.6.6 1.5 0 2.1-.3.3-.7.4-1.1.4z"></path></svg></span>
                </div>
                <b>Comments</b>

            </div>
        </div>

        <div className="input-field" >
            <div className="your-profile" >
                <img 
                    src={(state === undefined || state === null)?'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png': state.photo} 
                    alt="your img"/>
            </div>
            <div className="your-input-field" >
                <input type="text" 
                        placeholder='Add a comment ...'
                        value = {text}
                        onChange = {(e)=>setText(e.target.value)}
                        />
            </div>
            <div className="your-comment-button">
                <div className='btn' onClick={()=> {
                                        comment(text, post._id)
                                        setText('')
                }
                }>Post</div>
            </div>
        </div>
        <div className="status-field">
            <div className="user-pic inf">
                <div className="your-profile" >
                    <img src={post.postedBy.photo} alt=""/>
                </div>
            </div>
            <div className="user-status-body inf">
                <span className='adf'><b>{post.postedBy.username}</b></span>
                <span>{post.body}</span>
                <div className='kar'>{util.timeDiff(post.createdAt)}</div>
            </div>
        </div>


        <ul className='comment-list-wrapper'>
            {comments.map( comment => {
                return <CommentItem key={comment._id}
                                    commentId = {comment._id}
                                    postId = {post._id}
                                    text = {comment.text}
                                    username = {comment.postedBy.username}
                                    photo    = {comment.postedBy.photo}
                                    commentUserId = {comment.postedBy._id}
                                    yourusername = {state.username}
                                    deleteComment = {deleteComment}
                                    comment = {comment}
                />
            })}
        </ul>
        </div>

        </>
    }

    </>

    )
}

export default Comments
