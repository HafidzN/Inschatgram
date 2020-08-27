import React, { useState, useEffect, useContext } from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

import './Search.css'   

const Search = ({usersWhoHaveStories}) => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [text, setText] = useState('')
    const [suggestions, setSuggestions] = useState([])

    const [users, setUsers] = useState([])

    const storiedUsers = usersWhoHaveStories
	const hasStory  = (id) => {
		return storiedUsers ? storiedUsers.find(story => story.postedBy._id===id) : []
	}



    useEffect(()=>{

        let isMounted = true

        const doFetch = () => {

            fetch('http://localhost:5000/api/user/getAllUsers', {
                headers : {
                    'Authorization': 'Bearer '+localStorage.getItem('jwt')
                }
            })
            .then( res => res.json())
            .then( data => {
                if (isMounted){



                    if (data.message==='you must be logged in'){
                        localStorage.clear()
                        dispatch({type: 'CLEAR'})
                        history.push('/login')
                    }

         
                    console.log(data)
                    setUsers(data.users)




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
    }, [])






    const onTextChanged = (e) => {
        const value = e.target.value
        let suggestionResults = []

        setSuggestions([])

        if (value.length > 0 && users!== undefined){

            suggestionResults = users.filter( user => user.username.toLowerCase().includes(value))
            // const regex = new RegExp(`^${value}`, 'i')
            // suggestionResults =  users.sort().filter( v => regex.test(v.name))
        }

        setText(value)
        setSuggestions(suggestionResults)   

    }

    const resetSuggestions = () => {
        setText('')
        setSuggestions([])
    }

    const renderSuggestions = () => {
        if (text!=='' && suggestions.length === 0 ){
            return <div className='search-not-found' >
                No results found for <b style={{color:'#3897f0'}}>{`${text}`}</b>
            </div>
        }
        return ( <ul>
                    {suggestions.map((item)=> {
                        return   <li key={item.username}
                                     onClick={resetSuggestions}>
                                        <div className={hasStory(item._id)? 'img': null}>
                                          <img src={item.photo} alt="profile"/>
                                        </div>
                        
                                        <span>
                                            <Link to={`/user/${item._id}`}>            
                                                {item.username}
                                            </Link>
                                        </span>    
                                </li>
                     }
                    )}
                 </ul>
                )
    }


    return (
        <div className='search-container' >
            <input className='search-input'
                   type="text"
                   placeholder = "Search"
                   onChange={onTextChanged}
                   value={text}
            />
            <div>
            {
                renderSuggestions()
            }
            </div>
        </div>
    )
}

export default Search
