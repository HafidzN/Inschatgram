import React, {useContext} from 'react'
import { Link, NavLink} from 'react-router-dom'
import {UserContext} from '../../App'

import './Navbar.css'

const Navbar = () => {

	const {state} = useContext(UserContext)

    return (
	 <div className="home-top-nav">
         
		 <div className="home-top-nav-icon">   
			 <div className="home-top-nav-image">
				<Link to='/'>   
					<span className="logo" style={{fontSize:'4em', color:'black'}}>Inschatgram</span>
				</Link>			  
             </div>
         </div>
		 

		 <div className="home-top-nav-icon main-search">
		     <div className="home-top-nav-search">
			  <input type="text" name="search" placeholder="Search"/>
             </div>
         </div>
		 
		 <div className="home-top-nav-icon">
		    <nav>
			   <div className="menu-icon">             
					<NavLink to='/'>
					   <svg aria-label="Home" className="_8-yf5 " fill="#000000" height="19" viewBox="0 7 48 23" width="20"><path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z"></path></svg>
					</NavLink>     
			    </div>
				
				<div className="menu-icon">
					<NavLink to='/create' >
   					   <i className="fa fa-send"></i>
					</NavLink>
			    </div>
				
				<div className="menu-icon">
					<NavLink to='/explore'>
					   <i className="fa fa-bandcamp"></i>              
	   				   {/* <svg aria-label="Find People" className="_8-yf5 " fill="#262626" height="20" viewBox="0 0 48 48" width="20"><path clipRule="evenodd" d="M24 0C10.8 0 0 10.8 0 24s10.8 24 24 24 24-10.8 24-24S37.2 0 24 0zm12.2 13.8l-7 14.8c-.1.3-.4.6-.7.7l-14.8 7c-.2.1-.4.1-.6.1-.4 0-.8-.2-1.1-.4-.4-.4-.6-1.1-.3-1.7l7-14.8c.1-.3.4-.6.7-.7l14.8-7c.6-.3 1.3-.2 1.7.3.5.4.6 1.1.3 1.7zm-15 7.4l-5 10.5 10.5-5-5.5-5.5z" fillRule="evenodd"></path></svg> */}
					</NavLink>
			    </div>
				
				{/* <div className="menu-icon">
					<NavLink to='/saved'>
						<i className="fa fa-bookmark"></i>
					</NavLink>
			    </div> */}
				
				<div className="menu-icon">
					<NavLink to='/profile'>
						<img className='profile-img' 
							style={{borderRadius:'50%'}} 
							src={(state === undefined || state === null)?'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png': state.photo}
							alt='profile'
							/>
					</NavLink>        
			    </div>
				
             </nav>	 
         </div>
     </div>
    )
}

export default Navbar
