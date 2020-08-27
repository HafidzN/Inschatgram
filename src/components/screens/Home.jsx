import React, { useEffect, useState, useContext} from 'react'
import Spinner from '../elements/Spinner'
import Feed from './Feed'
import Status from './Status'
import {UserContext} from '../../App'

import util from '../../util/Older'

import './Home.css'

const Home = () => {
	const {state, dispatch} = useContext(UserContext)
	const [data, setData] = useState([])
    const [followedStories, setFollowedStories] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(()=>{
        let isMounted = true

        const doFetch = () => {
            setLoading(true)
            fetch('http://localhost:5000/api/post/followedposts', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if(isMounted){
                    if (data.message==='you must be logged in'){
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                    }

                    console.log(data)
                    setData(data.followedPosts.sort(function(a,b){
                        return util.Older(b.createdAt) - util.Older(a.createdAt)
                    }))                    
                    setLoading(false)

                }
            })
            .catch(err=> {
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
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                    }

                    console.log(data)
                    setFollowedStories(data.followedStories)
                    // setData(data.followedPosts.sort(function(a,b){
                    //     return util.Older(b.createdAt) - util.Older(a.createdAt)
                    // }))                    
                    // setLoading(false)

                }
            })
            .catch(err=> {
                if (isMounted){
                    // setLoading(false)
                    console.log(err)
                }
            })


        }


        doFetch()
        return ()=>{
          isMounted = false
       }        

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
            const updatedData = data.map( item => {
                return item._id === result._id? result: item
            })
            setData(updatedData)
        })
        .catch(error => {
            console.log(error)
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


   const unfollow = (id) => {
      fetch('http://localhost:5000/api/user/unfollow',{
         method: 'PUT',
         headers : {
            "Content-Type" :"Application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
         },
         body : JSON.stringify({
            followId: id
         })
      })
      .then(res => res.json())
      .then(result=> {
         console.log(result)
         dispatch({type: 'UPDATE', payload: result})

         const prevState = state
         const updatedState = {
             ...prevState,
             following: result.following
         }
         localStorage.setItem('user', JSON.stringify(updatedState))


         const updatedData = data.filter(post => {
             return post.postedBy._id !== id
         })

         setData(updatedData)



         const prevStories = followedStories
         console.log(prevStories)
         const updatedStories = prevStories.filter( story => {
             return story.postedBy._id !== id
         })
         console.log(updatedStories)

         setFollowedStories(updatedStories)

      })
      .catch( err => {
         console.log(err)
      })
   }





    const deleteComment = (postId, commentId) => {
        console.log(commentId)
        fetch(`http://localhost:5000/api/post/deletecomment/${commentId}`, {
            method : 'DELETE',
            headers : {
                "Content-Type"  : "Application/json",
                "Authorization" : "Bearer "+localStorage.getItem('jwt') 
            },
            body :JSON.stringify({
                postId
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const updatedData = data.map( post => {
                return post._id === result._id? result: post
            })
            setData(updatedData)
        })
        .catch(err => {
            console.log(err)
        })
    }





    return (
		<div className="home-container"> 

        {loading? 
         <div className='spinner-container shrinked addTop5rem' ><Spinner /></div>        
        :
<>
	  <div className="home-page-container activepage" id="Home">
			<div><Status folStories ={followedStories} /></div>

				<div className="home-container-page">
			
					<div className="home-container-page-left">	 
					 {data && data.map(post => {
						 return <Feed key  		={post._id}
						 			  _id 		={post._id}
									  body 		={post.body}
									  comments  ={post.comments}
									  createdAt ={post.createdAt}
									  image 	={post.image}
									  likes 	={post.likes}
									  username  ={post.postedBy.username}
									  fullname  ={post.postedBy.fullname}
                                      userId    ={post.postedBy._id}
                                      photo     ={post.postedBy.photo}
									  like      ={like}
									  dislike 	={dislike}
									  save		={save}
									  unsave 	={unsave}
                                      comment   ={comment}
                                      deletePost={deletePost}
                                      unfollow  ={unfollow}
                                      deleteComment = {deleteComment}
                                      followedStories     ={followedStories}
						 />
					 })}	  
					</div>
					
					<div className="home-container-page-right">	 
						<div className="home-user-profile">
							<div className="home-user-profile-image">
								<span><img src={state?state.photo: null} alt='user-status'/></span>
							</div>
							
							<div className="home-user-profile-name">
								<span><b>{state?state.fullname:''}</b></span>
								<span>{state?state.username:''}</span>
							</div>
						</div>
						
						<div className="home-user-suggestion">
							<div className="home-suggestion-heading">
									<div className="home-suggestion-heading-left">
									<span><b>Suggestion For You</b></span>
									</div>  

									<div className="home-suggestion-heading-right">
									<span><b>See All</b></span>
									</div>  						   
							</div>
							
							<div className="home-suggestion-follow-users">
								<div className="home-suggestion-follow-image">
									<span><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhMWFhUXGBoYFxcXFRcXFxcYFxUXGBgXFxgYHSggGBolHhUVITEhJSkrLi4vFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xABBEAABAwIDBQYDBAkDBAMAAAABAAIRAyEEEjEFBkFRcSJhgZGhsRPB8Acy0eEUQlJicoKSovEjM7IkY4PCFbPi/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAECAwQFBv/EACURAQEAAgMAAgIBBQEAAAAAAAABAhEDITESQTJREwUiM3GRBP/aAAwDAQACEQMRAD8APfGhBDvDz/ws9h3LZbzhtRjwLltz7/JYqkbrny9evhv49txujV1C1CxW6lWHwtqXLXDxzcvWSr3nxRo4WrVa3M5jS5reZGk9y894zEOqOc95lziXOIAAkmTYWC9I4ukHscxwlrgQRzBsVwDefYzsLXewg5JJY7m03APeNPAqmOc6M7u0g6sydA4e6l4tmZz3fvRpxzNt5JOx6WVhdxzD0ufQFWOGaHzeO009Yy8056jyKKg25GtxdM1Bfz91OyEVS2NY8NR81GxNODdOiQ/sanmc9kxmaPR7T7ArRbrANxDQTaXNI5y57YPhUHks/scxVBHLym3zWjwLctcO0Bh4/npNI8Jas8mmMUm18PkqMJsZcw9aVTJ/xhLrUpw7x+zUPmGl4PiKjgrHebBF1UkDWo5wjvN/+A8kr9GLaNSYuWeeUg+YhA/bO7PaQ8EaiD4Etn3KssUwD29vkPVCiymSCLZmQL6E6ex8wpG1KQDjyDvXLEeqdnZS6ipo1IpHvDx5k/mrUWqUx+ywk9wgH3BVYabQ5rDo27j0JMDxt4o2427ieIjz187hK4rmTX/Z5T/03E8X+zQi382TLTUaLxPiL/iPFV2wt4PgU2s+GTqZ7yVZv2xUrtPZkctD5LPVmW13uaQPsq278HFCk49mrYcs4HZ89OsLubSvLLi6lVlstcx0tngQZb8l6M3V2w3FYanVH6wuORGoWzlq7RIAo0yEggUEASCOUSACJGUEASSlIkGQgjQQGRxOyQ2TMiOl/wAIXO8Y806mXgDHfY/4XXMQ2Qub7xYfLWPffyt8gsc5p6XFy3K/3drDdurFRq6ACuabHqQ9p710ei6QE+NlzenX6LOb44NlTCVszQSKbi22hDSQR5LREqs2wyaNQfuOjxabLRg4t8fI1wEC8+YH4BM4TEdokcXEDlcW9Qq59aetvkk06sX5EHyJVbY1bY/s1WvOh9sx+vFDa1GHRGokeX5FR8XduUcDA7+0/wCQCtsRT+LlPEMjxDnR+KKMahYCjDmkawB/VP5LXCk3/Sd/2mETzFR4I8gPVUGFZAa4aQJ7ov8A+vupG2dsNyUot98CLRle0/MrOtD28WPgtDdXOEEa9p1U69QPVZ3HbXc4VGg2cW+gN/ZQ9p7QNR4dfsiB6n5qDqqiMsv0mUcaWuaf2dPDRHW2g9xkn8zMk9ZTFLDOdoPHgOq1O7u6j60OIgHSRw59Tw6JXKQ8ccslDh8O59grvYOxTWcQPut1dwnkPrTqtdT3RDdTPPh6Cx8VY4XCBgDWiAFllyfpvjxwNl7AoauYHRpOnkrr9GpsbAY0DoFg9498X0nfCoDSQX8Mw+80HiRImNJRVamLFOnXZVNRjwHQRlcLwQbkSDM6qfjlrdPct1Gc3+wwbicwEB7fVpg+hatX9jm2YNTDE69tvoHAeiqt68OauG+LBzU3B38ruy73afBVO6+I/R8SHzGUsqA82F+RwNuVUn/xrbG9OfOayehqb06oVCopbXKkFIIIkwCCCCACIoFAoAkSNEUGSggggla4LD78YcjK8cDFuRH5BbglUW9OGzUnc4nyv8lln47OO6yYnZtXQ8iunYCpLB0XLMM666TsSrmpMI5a/L65JcbXmnSzlRMddjv4T7KQSo2OdFNx5NJ9FpXK851jc9UklKrtIJB1lIKbC+pWHq9odRPn+a0ex6hyvmRBHobeyyjFodmV+zXPGGvHQG/hceSdp4w/XrhlNzeRLde90EHxWar1SdeZPnqrzFDMHdxDp6m8+Sq6lAZi3kfYkKdrymxbK2c6s8NA+pC22A3IESb8hoOpKq9nbTp4RmfLmdlHy8gTx7k9U3xxbaga9oYJEiS6AYPAwbEWWd+V8aSY4dfbY4PdiiwBuUGDJkan64LU7PwzWiwVHg8Y8O+HVbB4OF2OnS/A9xWiwTbSsu99tMr0GMo9krP1WH4bnDhx5EkAHzK1tWnLVS4enGZidnZY3pzWvuJXDyGPaaWYlpc5wMEzJbH3u/itXhdnfDospWhojvJJkk8pPBXxwhTrMKncrTkk8UGM2cHUXMIs5paehELnGLwpb8A6F1OpTP8AEaRA/uK7Li6Qylcl3yaWlhGrXmBy7RJ6XI8wq4/0z5J1t17YmILqVNx1LGk9YCuaL1mdhOy0mDk0DyCv6D1rjXPU6UElhSlQAoIIIAIkEEASIo4RIAkEEEGq2qPj6ctIT1JyVUFlnfHR9uUfDyVHNPBxE902W+3XqzSA4cD8lkt5KJZiLfrCfK34LUbpumkR3rPD108l3jtfSoO2nxQqnhkd7FTuCpt7KmXCVbfqx6hauaxwWqbpLk5X+8eqbKpz0TDcK82G3MK7edI+/wBeaolo9ziDWe06OpPB82/iUsvDw9DDguoB3A/Eab8IbH9xcqyu+9tXX84Pv7K12N/s1Gm5a4T/AHTHL7gTmz8CH1miPuUxw1JcRH93oot1ttjjvS53X2JTxNGpTqT2gO2PvBw+7rwHLlKkYP7O3MeC+q3IDJDWmXDlc9mfFbTYGyQxlhBKuDhFPyul3UvSlqUpcLSenLRaDCUoamqODEqwAhTJ3ssr9DojgqzG0sr83PVWbU3jqOYKr4U9Rad0vKodOoWmCpocoUh4wWK5hvFhvi16VP8A7snoDJ9Nf5V0/HmxWG2dhJr1azvvZi1nc0H5kSfBXE5+NJgXRAGivcO5UFBXWCdZXiwyWtIp1R6SfC0QNEjRIMEEEEAUIkZRIAkaCCAoqT1IBUDDvU2mVjK6bGQ32w1mv5GPP/AVhuVmLXeHD81L3iwJq0yxolx06zbwlXuzNntoU2026AXPEniSpk1lttLvDRDaMcVRb6N/6WoBqRA9/kVqHBZLfhrSyDwaSB3yP/XOq2cwcPxjb/XMqOpeM9Z+aiLZwZegrbdfEiniGOdoZaf5lUlSMHGYA6GB0Sox9XezTldiAdDUAIn96rf0Wq3UwGaXxqQB0l2nmsds9xbVqNN8xZ5z/wDpdP3TaMjOknqSsc46uPqNnhaYDQE/CYY5OByBo4AkueizJtwlKlYeaU6SIVdisWaYswudwGg8SmW7QfHaplvQ5h8kSlqkbSqtYcx0SNlYjM08gTHTgqraBqVnA5SGg8bKzwrg1sBRvdXZqBtB1lk9mVMwkcTPgTKv9s4sMpPedGtc4/ygn5Lnm4+1C5nw3G7Y14gzEK8Z9s8632HcrjBKjwhlX+DC0xY5LGipATNIJ5aIGiQlJzIBSJJzIs6DLRJOdEXoBRQTedBAZzA0nu+6wn09TZW9HA1OIA8Z9lfQkli5Plrxtc9olGgGt7+aBCfqNTBVY5bjbi8NPWN3zfDKjjyIHgB6a+a2NY2WF31xAFET+sSPM/kn9t/pyHENEH64lRajVPrtALvXzt7KO8AifrSfkul5t9RkQKcrU4KbAUkfpYsioHuvpPRdb3RxIcARpFui44Vr/s+24KdQUahsfuE8D+z+CnPFpx596rtFKonw5V+HqSFMplZtpT4TjQkNRudASFpZCZqtAF7DvVbidusbIa1z3Dg0adToFmdo43F1iYHw29/aPkDA63S224f/AD5cl/UXe2dtUaLLuaToL2/MqgwO1qlaoIblZz4u5QFFpbDAOaoTUdzcZI6DQKzwNG5dwCmurl4MOPj39q77Rcd8PBuaDepDB43d/aHLl2z8W6k8PbqPUcQtN9pmPz1qdIGzG5j/ABO08gP7llKMAjNpxjXr39FvhOnkZ3t2Pd3HNrMa9p1+iPBazClcT3c2u7BVMr70n3a4G3c4HlpI4e/YdnYttRrXNIIMQQnJpNX1NLlMU3peZWgslJLkkuSHOSMouSC9Ic5NOqJbM+aiQaqivrKPUxKNhP8AioKmdjwOPqgls9NzCEIswmE4ueYyi025qh1qcKeQm3tR+NaYcnxUG1MTlbHE+3Fc2+0escrADAvEcR3+YXUsVgWkk30+a5n9ouAyhpzdib9k2mTry7PqnMpa6f5sbi5lXdDndUBx7gD6gH3SKhnMeacYZB72nzvHqF1xwU7iGSBHIT4D/CgwrKkQR4acNbeig1GxPdb69UUQ3l18021xBBHBSaR16FR4ukNOz7nbTdUotJOa3j+a1lCuDouX/ZvjoLqJtxHTkuj5OIXLbq6dMWjKiU4yq1lYjVSadYHinvYJrYRpUKpst3BxVuwp1sJaaYcuWPlUNLYx/WNvdOY6i2nTPAAeSt6tQBcu+03e1uV2FoulzrVCNGt4t/iOkcBPcnMdlycuWXeVc72hiziK9Sr+24kfw6N/tASsThiG54tIv1uEex6YL8pi4IE84n5FCtiHBrqZ58eYFl1SdOMWAxTY+FV/2yf6D+03kVqN095ThKnwKzuxMB4mByMctfoXxWSRIS3Vi4AHVogHu5JaG3oXZ+084zNjLz1B7wrFuMC5L9nu2iAabnWmw5dRy710vDiU5jsqsv0kc0k1xzVdXdARA2CLiJUx9ZRa2IATTnKsxtQjUW9FnZYuJNfGqtxe0QBMpDaReJmAq/FYRjTmr1IpzYN+++InKOQkSVncnRwcU5M5L4rauPe4k5iJRq+o18UWj4GEpNpfqBwaXRzJLgSTr4o1k92c2M6mGP8A2OoUqRcQ82jQcbjipSTmhE51jCvHH4zp81d0tNvKqNj7SfUc8Pjs8IiL6KdicQA0k2gX8U/TyxuN1UbF1JsD1XH/ALV9tzU/R2GwAzdRJjwn1W13s3rZhqRy/fib8yLW48FwnHYl1V7nuPacZPiVWPH3up2bbxS8O5IoG6Jpgx3rdJ+lUhLrXJPTy0KZqm57ypdFoPi0j2+UoOI9WnAB8u8T9eRTIaJCll4dTyEdpsmeYuY8DKkv2QS1jmOkOiPESPw6hKw4lbNqFj2VGG4P+QuubIx4qMB7tFyjA7BxZFg0j+KD7R6roG6mBxDQM+QEatkyJ0PI+Flhlx5X6bXkx160pSS1Pfobj95wFkkYfQyY4lPHgzRebFV7X2y7D0y/XkDoT14c/BZTGfaXXaLUGAnm8n0AU/f43ZSkxcgcSTp5w4R+8ud4qlNUMm7YB8BPvbwWv8ciZyW9pe2t8MdiG9qrkYTEUxknjGaS7yKztNsQQrDbbWtcKbHS1rb8sxifGAFAYbQq1pNu1hVEOBba0dDw+SY2u+X5v2mgxyJ1HmCnaJBnvaCOoH5KJjNU6Rim6CihABPNomAfD2/FSEjZGI+HUB0v9euXyXZdmYota2ScvtbTuC4lUpEEjkV0vczb2eiG1DJENB4i9gT8+/nreIrZVqkgdQnavDoomJgBgFr3COpV/wBQgmwAvPoqTDrzAlRBVm2vMI6znPFrN4mInuHPronsNhYEqbFolShlH+mNP1fwRPYX08uVsg5m52ZsjucTfxU8sRBqzywaY53G7jC4vZOKc9xcHPJN3TMoLaOrAWKCy/jejP6nySfjHQXtkQk0aWVG0prFV4sNfZOTfTzflZNIe0cU1hhrRnOptwvcrO7Uxj3A9qNBOsdPNTsVObx+v8rLb27TFGkcpl3AWt+8TwFlvMJjGe9sBvnizUqljbgG/EucNSeUSRCyjxCn4WrmeSXG831111TFejqeE6i48+JUqpim6D4ygW69x+vZFKMntdfmmkKhupGFqRBvY6jkQorhCXSOvT11QFhUw4+KAPuvEju5hHQqVKZLGuMTokNxZyN5sMtNrcweYhW7KDXhtS4Dhc8iLRPTj+6E1RZ7H2vWtEzplym57usH6C1uCxWIqBtiCOMRYESqDZ1OHNPK2nj4aei6JsekA0HW35z6rXGss4Xs/CuMPeZngSYg/QU5zAAW8Bw+SNpADgDpp7/NRMdiAIdN+HiPyTRpz/fTFH4geNQNe9huf7isE2vlJqfrOzyeUz9eK6JvKGuY+LvzBzRzizh1OnguYYmmRAP1+dlnlGuN6RtZ+u9CEdJ0EGNPqE9iW2BFxfw7j3qDP7KGax4A+8/P3ULEntFHh6uUnx9R/jyTdQooAKdWaWsbItfwUIMnRbvdvYgxuHcHHK68HgTMfh5qsSt0zOzaAe3NxbEjiRoSrYUBh8axo/26wab83EiPOP6lmxnouMiLlp5EgkEctWnyU7aO1vi06UDt0+PTQ+gSN1rCD4jspdBbY9/f+fVWtHZrS9xInTXpyVVsWox7mvYB26czxEQR/wAitGyqJcZ5a9Oa0QjYlkua0fQTj2DQKO3FAvN76DpMSpsWRo9odayTRo8U6acnuTtZ4a0kkJaPaMaQQRGo7g1GlpTWsqjLPBQKr5cfrRUO422f0nBU79tgFOp/E0AT4iD4q3qkgHrCnjx12MvdKbeLaDaVMvmAJk8+i5PvO+o7DNxFUma9QBjJsykASHHm50anh1W430qh7vg3AbTzwObnNpN6xne7qAVVbT2Z+m0hSaQ3Jdp4S0EAdLlVScxFQcfruTzsRLQDNtBHvy8E1isM+k9zKjS1zTBadQUiRH5qBsTkuuQYPckSggFRm6/hdHSuR3+6RTfBt9FPPaJt911x3Tw8DI8EBNwmDzh+WZYJ7yOnHopOzKj2HITDHyINxItbvkj+oJvZT3B2Zv3mC44lhtmbzLSQSOStKeF+Mx+QAzUzDLMNOVoJbPMgjwVaCTs3az2dnIXQZtzESD5HwW22dvGIbAFxBnkfzlc+wYLajcwgkgyQdbSLaXj+pbzZlMgCQCCOImQdPKIV40s40tLEEgnONPLoo+LYy2Z82kD/AAiwjMwgtbItMa8lLxGHADbWnoDY6+avcY2M5tJ7WOytZeC0HjwPnfiuZbdpEVHOIsePAOdJIPKTP1C63jMKHmANDmbbjwJ7tViduhjcwcALy4HllcY75g+SnLtWHVYFqDHGdVJxVJogtNiJ6XNvQqMXc/zWLUHJBSviAcJSQeaAl4fZznlgb9578jRzhoLj0EhbbdLYVcUXvp130oe5hbDXN7NjI4Hx5KFuBgM+Kzkyygwuk27b/wAs39K2Ww8U2ngn132bnrVf5c5LdO4BXjIV8UewNn03txFOp2h8Z4OZszlf7kk+ayO39mUmVK3wJDKYbN8wzOIAa063ueKv8PtUUMIBUE1Kpc9zeMveXka21bM6QVH3Y2Y/G1WiCabX/Eqv4PqTZoP7LRbxJ7kXWhP2vNh7s4ppb8OpTswTeo0jNwi4mxvZX/8A8LiM2R1Yi4HZ5RoTAJ81qdnYEUxJ+8dY9uloRUKU1qjzoIA/pEq5E21H2fsqnShjbkfeJ1J7ypz6VkMK6RPMn8knE1gNfLmmRms4Nudfmm6WFLjmf4DkPrincPhiTmfrwHJTS2yRmBQHciT+aESfQZ/7OcD8LAsJ1eS89CbegWgxNh4z6Qi2XhxTo02NEBrQI8EMUQAZ0hRPF5XdrnO+dUioXTANO3PMxwdHk02TGA23ToAEyWuJLYFhz6de/wA5e+FEmgXTDmmWnnGvoLjuXPGse9hJMsboJABI7jwGgtpyS3oa6WO+u2qeKc1wpgEWD5MkcieIWTcU9UBlNEKLT0SUQRogkQk9Rdw4JlydoICxwbXOADLPkw4G4kRHjotnuRTp1CWRlkSRxkEz4gm3QLKbKpOFNzhw5C8/4I81d7tbTyYmm4OgvkGbw7z0MefVXBZ0kbd2e6m6rSiS2KlM822lsc7uH9K0O6+PFSgDIJbbviJ89PVSt7Nn/wC1WkEhwaeFndOFm+ZWc3MBZiKtIGAe0AIiA4gx4O70/se4t1hKnb7vwU/Ensjr6Gx9CVW4NvaMCRPXXn6q6ZRDrGNPfX67lcZ1Cw9Mwenrf68Fzv7TGCxGsH1gEeULo5qZJnUc+Pf6SuX/AGhVs7rGL3HzPolfBGGdo364lIcVIySYHD/KTVaA/LyF+sH8lk0R1K2bhTVfAH+Tw79CohK232e7tvrONecrWaZtCefREmya3A4Nmz9nvc6PivBmYEvfZo7hcDzVZSoVcc2nhqB/6SjlFSoLNqFgADGn9YcTFtfG1pbsvxmInE1C+jTNm5cgc7vAOg9b963OGwbKTQym0NaLAAQAOi10TFUvs6w73h1R1Rw/ZnUdYmPFbfB7Op0WNYxga1sQAAAI0gJ+m1PEWT1Cu0PFvhpPJQ6NXLRLjqZd5p/a1mH6+tVVbdxBp0WtAJJgABVE1Jp4zK0DU8BxUrDYck5na8uAUTY+zsoDn3efTuCtwUU4W1qTVQLk1UckZSCUxtkEjPLL7zbwMogtALn8AOBvdx+QvotO4wFxTfiu91c0QYBJzd4JMzGukdB3qbdKxm6otubbrYongwEnK0kjvPeq3D7Texpa3LB4mZ8Lwr7B7Llrm5dQRN9bx4acFnaVWowlocWnQ8PzUHYVScQCSb+scVFerZuIpS1gEwTmdrP4pO0MID2mXbGsQJ7h9eqLApyEITz6cFJyqRo2QpNKkQ2Y108/rzTGVX2MgUWjLEZTHeB2vQlOCNBsfZ4y2+7Up54PNv5P/tWVqDJVc4aNIf4ZgfZbCnX/ANGkAdBVbm/dEk9ZkDyWTqjM+pNpEebw0AqqJ66lvBi/+npA6lzBz0+cAnwUDYuySK7KkdojtDSA/O4+ERbuCGx8O/FVKeU9ijTZeJBqOYJPUAkfzFbzZ2AFNsak6k6k6SfCPJVO6m9dG8HhSArJlIQlMZCN+l1SFTtRgd4cRqPyXG97K+arHCXd85eyB38PMLpu9m0X06bi1pgA8J09guPU8NWxD4Y1zndw5qcl4z7R6UNDnO1gx1Op7/8AKrA4kkrp2M3C+HgqjzesKbjFzGVsgCP1u/TSAs7uRuq6vVDqrSKbSDlIIL+MX4WU2UtoWxt0q1fI+MrHESTqGzqBxnh5rtm7WzBSoBrAAOnAWHskYTABtJojQkeZ8+SvcNSDWgDhotJjpO9io0AwCEohOuBTZKDGClFJCU1MK7aj4jlIlVGFPx6wcfuU7NvxNieWlvNTd4JLco1Jj1TGGDaTMg14lOFYsnVwLIMqqGKghKRoJgqIB91FzpbXpGmB31ZBEx9re6CQSHri+9A/63/yH/i1BBRfY0x+1tgWjK23P2XOdtf79X+MoIJZeJnpmkOwfrmptFx+H4H5oIJRpEZosiqDtfXcgggvowPvDqPdaTaurf5v+D/wHkggiF9rSn+qOHw6n/24YexIWZxJ/wBV/wDGPcIIKqeLt24bAMDSgAS2TAiSRc9VpGaIkFU8Z5el0027iggmVRcSwGAQCJFiJGqRhKDGh2VrRfgAPZBBL7JKePmqygwAtgAdngO4IIJipY1HU/NTqaCCYB+vgmzqggkZTBZBqJBMmS+0aq5uFqOaSCAIIJBHaGhCibFeTSYSSSW3J6IIJT8m9/xT/aypm6mhBBWxJfwTlP5IkEgdCNBBCX//2Q==" alt='alt'/></span>
								</div>
							
								<div className="home-suggestion-follow-name">
									<span><b>Fullname</b></span>
								</div>
								
								<div className="home-suggestion-follow-button">
									<button>Follow</button>
								</div>
							
							</div>
						</div>
					</div>


				</div>
			</div>
			
			{/* <div className="home-page-container" id="Message">
			
				message
			</div>
			
			<div className="home-page-container" id="Search">
			
				search
			</div>
			
			<div className="home-page-container" id="Follow">
			
				follow
			</div>
			
			<div className="home-page-container" id="Profile">
			
				profile
			</div> */}

</>        
        }
			
				
		</div>
    )
}

export default Home
