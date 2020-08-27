import React from 'react'
import SavedItem from './SavedItem'

const GridPost = ({posts}) => {
    console.log(posts)
    return (
            <div className="explore-container " style={{marginTop:'0'}}>
                { posts.map((post, i) => {
                    return  <SavedItem 
                    key={post._id + i}
                                       image ={post.image}
                    />
                })}	 
            </div>   
    )
}

export default GridPost