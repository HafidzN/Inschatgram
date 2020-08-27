import React, {useRef, useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'


import {UserContext} from '../../App'

import Modal from '../elements/Modal'
import X from '../assets/X.png'
import fafafa from '../assets/fafafa.png'
import './CreateStory.css'

const CreateStory = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const location= useLocation()
    const [imageStory, setImageStory] = useState('')
    const [microLoading, setMicroloading] = useState(false)

	const modalRef = useRef()
	const openModal = () => { modalRef.current.openModal() }
	const closeModal = () => { modalRef.current.closeModal() }

    
    useEffect(() => {
        console.log(location.imageUrl)
        setImageStory(location.imageUrl)

    }, [location])


    const createStory = () => {
        setMicroloading(true)
        fetch('http://localhost:5000/api/story/create', {
            method: 'POST',
            headers: {
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                image:imageStory,
                createdAt: new Date()
            })            
        }).then(res => res.json())
      .then(data => {
        if(data.error){
            console.log(data.error)

        } 

        console.log(data)
        const prevState = state
        const updatedState = {
            ...prevState,
            story: data.result
        }
        dispatch({type:'UPDATE_STORY', payload: data})
        localStorage.setItem('user', JSON.stringify(updatedState))

        setMicroloading(false)

        history.push('/')
        
      })
      .catch( err => {
          setMicroloading(false)
      })

    }


    return (
      <>
      	<Modal ref={modalRef}>
			<>
				<ul>
					<li className='heighed'>
                       <div className='discard-alert'>Discard Photo?</div>
                       <div className='discard-explanation'>If you go back now, you will lose your photo</div>
                    </li>
					<li  className='blue arr' onClick={closeModal}>Keep</li>
					<li className='arr' onClick={()=>{ history.goBack()
                                                       closeModal()
                    }} >Discard</li>
				</ul>			
			</>
		</Modal>
  
        <div className='create-story-container'>
            <div className='create-story-button-container' onClick={()=> createStory()}>
                {microLoading?
                    <i className="fa fa-spinner fa-spin" style={{fontSize:'1.8rem', color:'#ececec'}}></i>
                :
                <>
                    <span><i className="fa fa-plus-circle"></i></span>
                    <span>&nbsp; Add to your story</span>
                </>                
                }
            </div>

            
            <img src={imageStory?imageStory: fafafa} alt="new-story" className='story-image'/>
            <img src={X} alt="X" className='X' onClick={openModal}/>

        </div>
      </>
    )
}

export default CreateStory
