import React from 'react'

const fileModal = (props) => {
const {handleDownload} = props
    return (
        <div>
            <span>You have received a file. Would you like to download the file?</span>
            <button onClick={handleDownload}>Yes</button>
        </div>
    )
}

export default fileModal;
