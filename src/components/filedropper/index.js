import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Usersvg from '../static/user.svg'
import Lock from '../static/lock.svg'
import "./style.css"

function Filedropper(props) {
    const {fileCallback, wait, guestName, connectionEstablished} = props
    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
        // Dropzone options and events
        noClick: true,
        noKeyboard: true,
        disabled: wait,
        onDrop: (acceptedFiles) => {
            acceptedFiles.map((file) => fileCallback(file))
        }
    });

    return (
        <div className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                 <>
                        {!connectionEstablished?
                            <div className="peer-avatar align-center">
                                <div className="flex-col-center">
                                    <h3>There is no one in the room!</h3>
                                    <p>Once you have a peer connection, you will be able to share files</p>
                                </div>
                            </div>:
                            <div className="peer-avatar ">
                                <div className="flex-col-center">
                                    <img src={Usersvg} />
                                    <h2>{guestName}</h2>
                                </div>
                            </div>
                            } 
                            <div className="privacy-cont">
                                <img src={Lock} />
                                <p>Private Room</p>
                            </div>  
                            {wait?
                                <div className="file-container">
                                    <div className="input-cont">
                                        <p>Wait till the user accepts the file</p>
                                        <button className="button-secondary" type="button">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className="file-container">
                                    <div className="input-cont">
                                        <input id="yolo" {...getInputProps()}/>
                                        <p>Drag a File here to Send</p>
                                        <p>OR</p>
                                        <button className="button-primary" type="button" onClick={open}>
                                            Select File
                                        </button>
                                    </div>
                                </div>
                            }
                    </>
            </div>
        </div>
    );
}

export default Filedropper