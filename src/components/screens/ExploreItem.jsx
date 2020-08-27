import React, {useRef, useContext } from 'react'
import {Link} from 'react-router-dom'
import fafafa from '../assets/fafafa.png'
import Modal from '../elements/ModalPost'
import util from '../../util/countTime'

import {UserContext} from '../../App'


const ExploreItem = ({ _id,
                       index,
                       comments,
                       createdAt,
                       image,
                       likes,
                       postedBy,
                       photo,
                       userId,
                       like,
                       dislike,
                       save,
                       unsave,
                       follow,
                       unfollow,
                       microLoading,
                       usersWhoHaveStories
 }) => {


    const {state} = useContext(UserContext) 
    
	const modalRef = useRef()
	const openModal = () => {
		modalRef.current.openModal()
	}

	const isSaved  = (id) => {
		const check =  state.saved.find(post => post['_id']===id)
		return check
	}

	const storiedUser = usersWhoHaveStories
	const hasStory  = (id) => {
		return usersWhoHaveStories ? storiedUser.find(story => story.postedBy._id===id) : []
	}

    const renderFollow = () => {
        if (microLoading){
            return <i className="fa fa-spinner fa-spin" style={{fontSize:'1.8rem', color:'#3897f0'}}></i>
        }
        return  state.following.includes(userId)?
                <span className='follow-button' onClick={()=>unfollow(userId)}>Followed</span>
                :
                <span className='follow-button' onClick={()=>follow(userId)}>Follow</span>   
    }



    // const testImage = (URL) => {
    //     var tester=new Image();
    //     tester.onload=true;
    //     tester.onerror=false;
    //     tester.src=URL;
    // }

    // const [col, setCol] = useState('')
    // const [row, setRow] = useState('')

    // const isPattern3 = (i)=> {
    //     return Number.isInteger((i - 3 + 20)/20)
    // }

    // const isPattern4 = (i) => {
    //     return Number.isInteger((i - 14 + 20)/20)
    // }

    // const Col = () => {
    //     if(isPattern3(index)){
    //         return '3/4'
    //     } else 
    //     if (isPattern4){
    //         return '1/2'
    //     }
    //     return ''

    // }
    
    // const Row = () => {
    //     if(isPattern3(index)){
    //         if(isPattern4(index)){
    //             return `${5+8(index-14)/20}/${7+8(index-14)/20}`
    //         }
    //         return `${1+8(index-3)/20}/${3+8(index-3)/20}`
    //     }
    //     return ''
    // }

    // setCol(Col) 
    // setRow(Row)


    // setRow(isPattern3(index)?isPattern4(index):{`${5+8(index-14)/20}/${7+8(index-14)/20}`}:{`${1+8(index-3)/20}/${3+8(index-3)/20}`})    

    return (
        <>
            <Modal ref={modalRef}>
                <div className="home-post-container" style={{marginBottom:'unset'}}>		
                    <div className="home-post-nav">
                        <div className={`home-post-nav-image ${ (hasStory(userId) ||( userId === state._id && state.story)) && `has-story` }`}>
                            <span>
                                <img src={photo?photo: 'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png'} alt='user' style={{marginRight:'4rem'}}/>
                            </span>
                        </div>

                        <Link to={userId === state._id? `/profile`:`/user/${userId}`} className="home-post-nav-name">
                            <div >
                                <span><b>{postedBy}</b></span>
                            </div>
                        </Link>


                        
                        {(state._id !== userId ) &&
                            <div className="home-post-nav-menu onfollow">                    
                                <span onClick={openModal} className='little-dot'>
                                    <i className="fa fa-circle"></i>
                                </span>

                                {renderFollow()}
                            </div>
                        }
                        
                        <div className="home-post-nav-menu">
                            <span onClick={openModal} style={{fontSize:'2rem'}}>
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


					<span>
					{
						likes.includes(state._id)?
									<svg onClick = {()=> dislike(_id)} aria-label="Unlike" className="_8-yf5 " fill="#ed4956" height="20" viewBox="0 0 48 48" width="20"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
							:
									<svg onClick = {()=> like(_id)} aria-label="Like" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
					}			  
					</span>


                            <span>
                            <Link to={`/comments/${_id}`}>
                                <svg aria-label="Comment" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
                            </Link>
                            </span>                           
                            <span>
                                <svg aria-label="Share Post" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
                            </span>
                        </div>
                        
                        <div className="home-post-icon-dots"></div>
                        
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
                    

                            <span><b>{likes ? likes.length : 0} Likes</b></span>			
                            <span className='time'>{ util.timeDiff(createdAt)}</span>

                    </div>
                            
                </div>            
            </Modal>

                <figure className={image?"gallery__item":"none"} onClick={openModal}
    //                style={{
    // gridColumn: {col},
    // gridRow   : {row}                   
    //                }}
                >
                  
                    <img src={image?image:fafafa}
                        className="gallery__img" 
                        alt='explore'
                        />
                </figure>


        </>
    )
}

export default ExploreItem




