import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'

const UserItem = ({username, fullname, userId, follow, photo, usersWhoHaveStories }) => {
    const {state} = useContext(UserContext)

	const storiedUser = usersWhoHaveStories
	const hasStory  = (id) => {
		return usersWhoHaveStories ? storiedUser.find(story => story.postedBy._id===id) : []
	}

    // const redirect = (userId) => {
    //     history.push(`/user/${userId}` )
    // }


    const renderButton = (userId) => {
       
           if (userId === state._id){
               return null
           }

           if (state.following.includes(userId)){
                return  <div className='follow-button'>
                            <span style={{border:'1px solid #dadada', color:'#262626', background:'none'}}>Following</span>
                        </div>               
           }

            return  <div className='follow-button' onClick={()=>{follow(userId)}}>
                        <span>Follow</span>
                    </div>

               
    }


    const renderPhoto = (userId) => {
        if (userId === state._id){
            return state.photo
        }
        return (state === undefined || state === null)?'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png': photo
    } 



    return <li className='follow-list'>
     <div className='follow-list'> 
       <div className={`followed-user-image ${ (hasStory(userId) ||( userId === state._id && state.story)) && `storied` }`}>
          <img 
             src={renderPhoto(userId)}
             alt="followers"/>
       </div>

       <Link to={`/user/${userId}`} 
        className='followed-user-name'>
          <div className='name'>{username}</div>
          <div className='desc grey'>{fullname}</div>
        
       </Link>

       {renderButton(userId)}
     </div>
    </li>
}


export default UserItem
