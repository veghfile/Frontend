import React from 'react'

const fileModal = (props) => {
const {handleDownload,handleAbort} = props
    return (
        <div>
            <span>You have received a file. Would you like to download the file?</span>
            <button onClick={handleDownload}>Yes</button>
            <button onClick={handleAbort}>No</button>
        </div>
    )
}

export default fileModal;
