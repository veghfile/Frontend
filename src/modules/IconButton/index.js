import React from 'react'

const IconButton = ({svg}) => {
    return (
        <div>
            <button type="button">
                Share Link
                <img src = {svg}/>
            </button>
        </div>
    )
}

export default IconButton
