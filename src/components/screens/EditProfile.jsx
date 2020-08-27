import React, { useRef, useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Spinner from '../elements/Spinner'
import Modal from '../elements/Modal'
import {UserContext} from '../../App'
import './EditProfile.css'

const EditProfile = () => {
   const {state, dispatch} = useContext(UserContext)

   const history = useHistory()

	const modalRef = useRef()
	const openModal = () => { modalRef.current.openModal() }
	const closeModal = () => {	modalRef.current.closeModal()}

   // let initFullname, initUsername, initEmail

   // useEffect(() => {
   //    const preservedData = JSON.parse(localStorage.getItem('user'))
   //    if (preservedData){
   //       console.log(preservedData)
   //       initFullname = preservedData.fullname
   //       initUsername = preservedData.username
   //       initEmail    = preservedData.email
   //    }
      
   // }, []) 



   // const [fullname, setFullname] = useState(state ? state.fullname: initFullname)
   // const [username, setUsername] = useState(state ? state.username: initUsername)
   // const [email, setEmail] = useState(state ? state.email: initEmail)

// let initFullname, initUsername, initEmail, initBio

  
//    useEffect(() => {
//       const initVal = JSON.parse(localStorage.getItem('user'))
//             initFullname = initVal.fullname
//             initUsername = initVal.username
//             initEmail    = initVal.email
//             initBio      = initVal.bio
//    }, [])
   



   const [fullname, setFullname] = useState(state ? state.fullname: JSON.parse(localStorage.getItem('user')).fullname)
   const [username, setUsername] = useState(state ? state.username: JSON.parse(localStorage.getItem('user')).username)
   const [email, setEmail] = useState(state ? state.email: JSON.parse(localStorage.getItem('user')).email)
   const [photo, setPhoto] = useState('')
   const [bio, setBio] = useState(state? state.bio: JSON.parse(localStorage.getItem('user')).bio)
   const [loading, setLoading] = useState(false)
   const [microLoading, setMicroloading] = useState(false)



useEffect(()=>{
       if(photo){
       setLoading(true)
       const data = new FormData()
       data.append("file",photo)
       data.append("upload_preset","inscatgram")
       data.append("cloud_name","smilj4npj4nic")
       fetch("https://api.cloudinary.com/v1_1/smilj4npj4nic/image/upload",{

            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
    
       
           fetch('http://localhost:5000/api/user/updatePhoto',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   photo:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,photo:result.photo}))
               dispatch({type:"UPDATE_PHOTO",payload:result.photo})
               setLoading(false)
               // window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
            setLoading(false)
        })
       }
       //eslint-disable-next-line
    },[photo])


    const updatePhoto = (file)=>{
        setPhoto(file)
    }


    const removePhoto = () => {
           fetch('http://localhost:5000/api/user/removePhoto',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               }
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,photo:result.photo}))
               dispatch({type:"UPDATE_PHOTO",payload:result.photo})
               setLoading(false)
               // window.location.reload()
               history.push('/profile')
           })
        .catch(err=>{
            console.log(err)
            setLoading(false)
        })       
    }



   

   const onSubmitHandler = () => {
      setMicroloading(true)
         fetch('http://localhost:5000/api/user/updateProfile',{
            method:"put",
            headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                  bio: bio
            })
         }).then(res=>res.json())
         .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,bio:result.bio}))
            dispatch({type:"UPDATE_BIO",payload:result.bio})
            setMicroloading(false)
            history.push('/profile')
         })
      .catch(err=>{
         setMicroloading(false)
         console.log(err)
      })      
   }

      

   




    return (
        <>
			<Modal ref={modalRef}>
			   <ul>
			     <li className='change-photo-alert' style={{ fontSize:'1.6rem'}}>Change Profile Photo</li>
              <input type="file" 
                     accept="image/*"  
                     name="image-upload" 
                     id="input"
                     onChange={(e)=>{updatePhoto(e.target.files[0])
                     console.log(e.target.files[0])
                     closeModal()
                     }
                     }
                     
                     />

    
                <label className="photo-upload" htmlFor="input">
                  <li className='blue'>Upload Photo</li>     					    
                </label>
              
				  <li className='red' onClick={()=> {removePhoto()
                                                 closeModal()
              }}>Remove Current Photo</li>
				  <li onClick={closeModal}>Cancel</li>
			   </ul>
			</Modal>

        <div className='edit-profile-container'>
           <div className="change-image-wrapper">
              <div className="edt-image">
              {loading?<div className='shrinked' style={{marginTop:'-1.5rem'}}><Spinner/></div>:
                 <img 
                 src={(state === undefined || state === null)?'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png': state.photo}
                 alt="profile-img"/>
              
              }
              </div>
              <div className="edt-user">
                 <span className='name' >{state && state.username}</span>
                 <span className='change' onClick={openModal}>Change Profile Photo</span>
              </div>
           </div>

           <span>
           <div className="information-wrapper">
              <h1>Name</h1>
              <input type="text" 
                     placeholder='Name' 
                     value={fullname}
                     onChange ={(e)=> setFullname(e.target.value)}
              />
           </div>



           <div className="information-wrapper">
              <h1>Username</h1>
              <input type="text" 
                     placeholder='Username' 
                     value={username}
                     onChange ={(e)=> setUsername(e.target.value)}                     
              />
           </div>

           <div className="information-wrapper">
              <h1>Website</h1>
              <input type="text" placeholder='Website'/>
           </div> 

           <div className="information-wrapper">
              <h1>Bio</h1>
              <textarea name="" id="" cols="30" rows="3"
                        placeholder='Bio'
                        value={bio}
                        onChange = {(e)=> setBio(e.target.value)}
                        ></textarea>
           </div>

           <div className="information-wrapper">
              <h1>Email</h1>
               <input type="text" 
                      placeholder='Email'
                      value={email}
                      onChange ={(e)=> setEmail(e.target.value)}
               />
           </div>

           <div className="information-wrapper">
              <h1>Phone Number</h1>
              <input type="text" placeholder='Phone'/>
           </div>

           <div className="information-wrapper">
              <h1>Gender</h1>
              <input type="text" placeholder='Gender'/>
           </div>

           {microLoading ? 
           <span className='edt-profile-button'><i className="fa fa-spinner fa-spin" style={{margin:'0 1.8rem 0'}}></i></span> 
           :
           <span className='edt-profile-button' onClick={onSubmitHandler}> Submit</span>           
           }


           </span>


        </div>

        </>
    )
}

export default EditProfile
