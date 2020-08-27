import React, { useState, useRef, useContext , useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import ItemsCarousel from 'react-items-carousel'
import Modal from '../elements/ModalStatus'
import Spinner from '../elements/Spinner'

import {UserContext} from '../../App'

import util from '../../util/Older'
import util2 from '../../util/countTime'

import './Status.css'


const Status = ({folStories}) => {
   const history = useHistory()
   const {state, dispatch} = useContext(UserContext)
   const [story, setStory] = useState('')
   const [microLoading, setMicroloading] = useState(false)
   const [deleteLoading, setDeleteLoading] = useState(false)   
   const [stories, setStories] = useState([])

  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const chevronWidth = 1


  const modalRef = useRef()
  const openModal = () => { modalRef.current.openModal() }

  const modalRef2 = useRef()
  const openModal2 = () => { modalRef2.current.openModal() }
  const closeModal2 = () => { modalRef2.current.closeModal() }


    useEffect(()=>{
        let isMounted = true

        const doFetch = () => {
            fetch('http://localhost:5000/api/story/followedstories', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if(isMounted){
                    if (data.message==='you must be logged in'){
                       console.log(data.message)
                    }

                    console.log(data.followedStories)
                    setStories(data.followedStories.sort(function(a,b){
                        return util.Older(b.createdAt) - util.Older(a.createdAt)
                    }))                    

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
    }, [folStories])







useEffect(()=>{
       if(story){
       
       setMicroloading(true)
       const data = new FormData()
       data.append("file",story)
       data.append("upload_preset","inscatgram")
       data.append("cloud_name","smilj4npj4nic")
       fetch("https://api.cloudinary.com/v1_1/smilj4npj4nic/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{ 

           setMicroloading(false)

           history.push({
              pathname :'/create-story',
              imageUrl :data.url
           })



       
        })
        .catch(err=>{
            setMicroloading(false)  // window.location.reload() 
            console.log(err)   
            return  
            })
       }
       //eslint-disable-next-line
    },[story])


    const uploadStory = (file)=>{
        setStory(file)
    }

    const [modalImage, setModalImage] = useState(null)
    const [modalPhoto, setModalPhoto] = useState(null)
    const [modalUsername, setModalUsername] = useState('')
    const [modalCreatedAt, setModalCreatedAt] = useState('')
    const [modalUserId, setModalUserId] = useState('')

    const setModalValues = (params) => {
       setModalImage(params.image)
       setModalPhoto(params.postedBy.photo)
       setModalUsername(params.postedBy.username)
       setModalCreatedAt(util2.timeDiff(params.createdAt))
       setModalUserId(params.postedBy._id)
    }






    const deleteStory = (storyId) => {
       setDeleteLoading(true)
        fetch('http://localhost:5000/api/story/delete/'+storyId, {
            method : 'DELETE',
            headers : {
                "Content-Type"  : "Application/json",
                "Authorization" : "Bearer "+localStorage.getItem('jwt') 
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            if(result.ok){
 
               const prevState = state
               const updatedState = {
                  ...prevState,
                  story : null
               }
               dispatch({type:'DELETE_STORY'})
               localStorage.setItem('user', JSON.stringify(updatedState))
               setDeleteLoading(false)
            }

        })
        .catch(err => {
            setDeleteLoading(false)
            console.log(err)
        })
    }









  return (
     <>
      <Modal ref={modalRef}>
         <div className='status-modal-wrapper'>

           <img className='status-modal-profile-image' src={modalImage} alt="statuspics"
           />
           <div className='user-detail-container'>
              <div className='image-wrapper'>
                 <img src={modalPhoto} alt="user"/>
              </div>

              <div className='status-details'>
                <div style={{ fontSize: '1.4rem', color: 'white'}}>
                   <Link to={`/user/${modalUserId}`} style={{ color: 'white'}}>
                {modalUsername}
                   </Link>
                </div>
                <div style={{ fontSize: '1.1rem'}}>{modalCreatedAt}</div>
              </div>         
           </div>

         </div>
      </Modal>




      <Modal ref={modalRef2}>
         <div className='status-modal-wrapper'>
           <div className="delete-post-container">
           {deleteLoading ?
            <span><i className="fa fa-spinner fa-spin" style={{fontSize:'1.8rem', color:'#ececec'}}></i></span>
           :
            <span  onClick={()=>{ deleteStory(state.story && state.story._id)
                                    closeModal2()
            }}>
               Delete
            </span>
           }

           </div>

           <img className='status-modal-profile-image' src={state!==null ? state.story? state.story.image:null:null} alt="statuspics"
           />
           <div className='user-detail-container'>
              <div className='image-wrapper'>
                 <img src={state?state.story?state.photo:null:null} alt="user"/>
              </div>

              <div className='status-details'>
                <div style={{ fontSize: '1.4rem'}}>Your Story</div>
                <div style={{ fontSize: '1.1rem'}}>{(state!==null)?state.story? util2.timeDiff(state.story.createdAt):'':''}</div>
                {/* <div style={{ fontSize: '1.1rem'}}>{(state===undefined || state===null || state.story === null)? '': util2.timeDiff(state.story.createdAt)}</div> */}
              </div>         
           </div>




         </div>
      </Modal>




      <div className='carousel-container' >
         <ItemsCarousel
               requestToChangeActive ={setActiveItemIndex}
               activeItemIndex       ={activeItemIndex}
               numberOfCards         ={5}
               gutter                ={10}                                                                     // leftChevron={<Button><i className="fa fa-arrow-left"></i></Button>}
               chevronWidth          ={chevronWidth}                                                           // rightChevron={<Button><i className="fa fa-arrow-right"></i></Button>}                                                                                                       
               outsideChevron
         >



         {state===null || !state.story?


         <div className='status-item no-status'>
          {microLoading? <div className='shrinked' style={{marginTop:'-1.5rem'}}><Spinner/></div>:
          <>
            <img className='img-status' 
                  src={(state === undefined || state === null)?'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png': state.photo}
                  alt="profile"
            />



            <input type="file" 
                  accept="image/*"  
                  name="image-upload" 
                  id="input"
                  onChange={
                  (e)=>uploadStory(e.target.files[0])
                  }
            />

            <label className="photo-upload" htmlFor="input">
               <div className='add-status-button'>
                  <span>+</span>
               </div>				    
            </label>
          </>
          }

         </div>


         :



             <span > 
               <div className='status-item' onClick={()=>{openModal2()
                                                         setModalValues(state.story)
               } }>
                     <img className='img-status' src={state.photo} 
                           alt="profile"
                     />
               </div> 
            </span >








         }



         {stories.map(story => {
            return       (
             <span key={story._id} > 
               <div className='status-item' onClick={()=>{openModal()
                                                         setModalValues(story)
               } }>
                     <img className='img-status' src={story.postedBy.photo} 
                           alt="profile"
                     />
               </div> 
            </span >
            )
                           
         })}

    
         
         </ItemsCarousel>
      </div>
     </>
  )
}

export default Status

