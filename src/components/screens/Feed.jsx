import React, { useRef, useState, useContext } from 'react'
import {Link} from 'react-router-dom'
import Modal from '../elements/Modal'
import util from '../../util/countTime'
import {UserContext} from '../../App'

const Feed = ({
	_id,
	body,
	comments,
	createdAt,
	image,
	likes,
	username,
	fullname,
	photo, 
	userId,
	like,
	dislike,
	save,
	unsave,
	comment,
	deletePost,
	unfollow,
	deleteComment,
	followedStories
}) => {

	const modalRef = useRef()
	const openModal = () => { modalRef.current.openModal() }
	const closeModal = () => { modalRef.current.closeModal() }



	const modalRef2 = useRef()
	const openModal2 = () => { modalRef2.current.openModal() }
	const closeModal2 = () => { modalRef2.current.closeModal() }


	const {state} = useContext(UserContext)

	const [loadMore, setLoadMore] = useState(false)
	const [text, setText] = useState('')
	const [addComment, setAddComment] = useState(false)

	const [idDeletingComment, setIdDeletingComment] = useState('')

	const isSaved  = (id) => {
		const check =  state.saved.find(post => post['_id']===id)
		return check
	}

	const isLiked = (id) => {
		const check = likes.includes(id) 
		return check
	}

	const unfollowUser = (uid) => {
					  unfollow(uid)
	  				  closeModal()
				  }

	
	const folStories = followedStories
	const hasStory  = (id) => {
		return followedStories ? folStories.find(story => story.postedBy._id===id) : []
	}






    return (
		<>
		  <Modal ref={modalRef}>
			{username === state.username ?
			<>
				<ul>
					<li className='red' onClick={()=>deletePost(_id)}>Delete</li>
					<li  onClick={()=> console.log('Go to post')}>Go to post</li>
					<li onClick={closeModal}>Cancel</li>
				</ul>			
			</>
				:
			<>
			   <ul>
			      <li className='red' onClick={()=> console.log('report')}>Report Inapropriate</li>
				  <li className='red' onClick={()=> unfollowUser(userId)}>Unfollow</li>
				  <li onClick={()=> console.log('Go to post')}>Go to post</li>
				  <li onClick={()=> console.log('Share')}>Share</li>
				  <li onClick={()=> console.log('Copy Link')}>Copy link</li>
				  <li onClick={()=> console.log('Embed')}>Embed</li>
				  <li onClick={closeModal}>Cancel</li>
			   </ul>
			</>

			}
		 </Modal>

		 <Modal ref={modalRef2}>
		    <ul>
				<li className='red' onClick={()=> {deleteComment(_id, idDeletingComment)
												   closeModal2()
				}}>Delete</li>
				<li onClick={closeModal2}>Cancel</li>			   
			</ul>
		 </Modal>




		<div className="home-post-container">		
			<div className="home-post-nav">

	
					<div className={`home-post-nav-image ${ (hasStory(userId) ||( userId === state._id && state.story)) && `has-story` }`} >
						<span >
							<img src={photo?photo:'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png'} alt='user' />
						</span>
					</div>



				<Link to={username === state.username?`/profile`:`user/${userId}`} className="home-post-nav-name" >
				<div>
					<span><b>{username}</b></span>
				</div>
				</Link>
				
				<div className="home-post-nav-menu">
					<span onClick={openModal}>
  					   <i className="fa fa-ellipsis-h"></i>
					</span>
				</div>
				
			</div> 

			<div className="home-post-display">
				<span>
				   <img src={image} alt='main post'/>
				</span>
			</div>

			<div className="home-post-icon">
				<div className="home-post-icon-icons">
					<span >
					{
						isLiked(state._id)?
									<svg onClick = {()=> dislike(_id)} aria-label="Unlike" className="_8-yf5 " fill="#ed4956" height="20" viewBox="0 0 48 48" width="20"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
							:
									<svg onClick = {()=> like(_id)} aria-label="Like" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
					}			  
					</span>
					
					<span onClick={()=>setAddComment(true)}>
						<svg aria-label="Comment" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
					</span>
					
					<span>
						<svg aria-label="Share Post" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
					</span>
				</div>
				
				<div className="home-post-icon-dots">
				</div>
				
				<div className="home-post-icon-bookmark">

					<span>
					{isSaved(_id)?
  					   <i onClick={()=>unsave(_id)}className="fa fa-bookmark"></i>
					:
 					   <i onClick={()=>save(_id)}className="fa fa-bookmark-o"></i>
					}
					</span>

				</div>
				
			</div>

			<div className="home-post-details">
					{likes.length>0 && 
					<span><b>{likes.length} Likes</b></span>
					}				

					<span className='status-body'><b >{username}</b> 
					{!loadMore ? 
					(body.length>50)?
					<>
  					   {body.substring(0,25)} <span className='load-more'
						                            onClick={()=>setLoadMore(true)}
						 >... more</span>
					</>
					:body
					:body
					}
					</span>
					{comments.length>2 && 
					<Link to={`/comments/${_id}`} className='comment-color'>
					<span >View all {comments.length} comments</span>
					</Link>
					}
					{comments && comments.slice(comments.length-2,comments.length).map(comment => {
						return <span className='comments' key={comment._id}>
								   <span className='flex1'><b>{`${comment.postedBy.username}  `}</b>
								   {comment.text}</span>
							       
								   {comment.postedBy._id === state._id && 
								   <span onClick={()=>{ setIdDeletingComment(comment._id)
									  					openModal2()}}>
								      <i className="fa fa-ellipsis-h" style={{marginLeft: '1rem'}}></i>								   
								   </span>
								   }					   
			  				   </span>
					})}
					<span className='time'>{util.timeDiff(createdAt)}</span>

			</div>

			
			{addComment && 
			<div className="home-post-comments">

				<div className="home-post-comments-input">
					<input type="text" name="comments" placeholder="Add a comment.."
						   value = {text}
						   onChange = {(e)=>setText(e.target.value)}
					 />
				</div> 
				
				<div className="home-post-comments-button">
					<button onClick={()=> {comment(text, _id)
										   setText('')
					}
					}>Post</button>
				</div>	
				
			</div>	
			
			}



		</div>
		</>
    )
}

export default Feed
