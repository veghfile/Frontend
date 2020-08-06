import React from 'react'
import './style.css'
const IconButton = ({svg}) => {
    return (
        <div>
            <button className="button-primary" type="button">
                Share Link
                <img src = {svg}/>
            </button>
        </div>
    )
}

export default IconButton
