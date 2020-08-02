import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Usersvg from '../static/user.svg'
import Lock from '../static/lock.svg'
import Button from '../../modules/button/index';
import {BarLoader} from 'react-spinners';
import "./style.css";


function Filedropper(props) {
    const {fileCallback, wait, guestName, connectionEstablished,setBtnWait,load,receiver} = props
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
                                    <h2>There is no one in the room!</h2>
                                    <p>Once you have a peer connection, you will be able to share files</p>
                                </div>
                            </div>:
                            //add avatar module here
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
                            {load?
                                <div className="file-container">
                                    <div className="input-cont">
                                    <p>Sending File</p>
                                        <BarLoader load />
                                    </div>
                                </div>
                                :
                                receiver?
                                <div className="file-container">
                                    <div className="input-cont">
                                    <p>Receiving File</p>
                                        <BarLoader load />
                                    </div>
                                </div>                           
                                :
                                wait?
                                <div className="file-container">
                                    <div className="input-cont">
                                        <p>Wait till the user accepts the file</p>
                                        <Button className="button-secondary" onClick={()=>setBtnWait(false)} type="Button">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                                :
                                <div className="file-container">
                                    <div className="input-cont">
                                        <input id="yolo" {...getInputProps()}/>
                                        <p>Drag a File here to Send</p>
                                        <p>OR</p>
                                        <Button className="button-primary" type="Button" onClick={open}>
                                            Select File
                                        </Button>
                                    </div>
                                </div>
                            }
                    </>
            </div>
        </div>
    );
}

export default Filedropper