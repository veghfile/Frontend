import React from 'react'

const fileDropper = (props) => {
  const {fileCallback,sendFile,wait} = props

  function selectFile(e) {
    fileCallback(e.target.files[0]);
}
    return (
        <div>
            <input onChange={selectFile} type="file"/>
            <button disabled={wait} onClick={sendFile}>Send file</button>
        </div>
    )
}

export default fileDropper
