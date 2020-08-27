import React, {useRef} from 'react'
import {Link} from 'react-router-dom'
import Modal from '../elements/Modal'

import './Comments.css'

const CommentItem = ({  commentId, 
                        postId,
                        username,
                        commentUserId, 
                        text, 
                        yourusername, 
                        deleteComment,
                        photo,
                        comment
}) => {


	const modalRef = useRef()
	const openModal = () => { modalRef.current.openModal() }
	const closeModal = () => { modalRef.current.closeModal() }

    return (
        <>
            <Modal ref={modalRef}>
                <ul>
                    {(username !== yourusername) &&
                    <li className='red'>Report</li>                    
                    }


                    {(username === yourusername) &&
                    <li className='red' onClick={()=> {
                        deleteComment(postId, commentId)
                        closeModal()
                        }}>Delete</li>                    
                    }
                    <li onClick={closeModal}>Cancel</li>
                </ul>
            </Modal>


            <li  className="comment-li">
                <Link to={`/user/${commentUserId}`} className="user-pic inf">
                    <div >
                        <div className="your-profile" >
                            <img src={photo} alt=""/>
                        </div>
                    </div>
                </Link>      
                    <div className="user-status-body inf fl">
                        <span className='adf'><b>{username}</b></span>
                        <span >{text}</span>
                    </div>
                    <div className='field-delete'>
                        <span onClick={openModal}>
                        <i className="fa fa-ellipsis-h"></i>
                        </span>
                    </div>  
              
            </li>  
            
        </>
    )
}

export default CommentItem
