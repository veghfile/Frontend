import React from 'react'
import './style.css'
const IconButton = ({svg,children,...other}) => {
    return (
        <div>
            <button {...other} className="button-primary" type="button">
                {children?children:"Share Link"}
                <img src = {svg}/>
            </button>
        </div>
    )
}

export default IconButton
