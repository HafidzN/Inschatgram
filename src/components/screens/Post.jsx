import React from 'react'

const Post = ({
        _id ,
        body ,
        comments,
        createdAt ,
        image ,
        likes ,
        username  ,
        fullname 
}) => {
    return (
        <div 
        className="square1 bg img1" 
            style={{
                backgroundImage:`url(${image})`
            }}
        >
        </div>
    )
}

export default Post
