import React from 'react'

const SavedItem = ({
    image
}) => {
    return (
        <div className="square bg img1" 
            style={{
                backgroundImage:`url(${image})`
            }}
        >
        </div>
    )
}

export default SavedItem
