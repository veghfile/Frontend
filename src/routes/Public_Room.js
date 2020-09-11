import React, {useContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import {clipimg} from '../util/clipimg';
import axios from 'axios';
import codec from 'string-codec'
import Filedropper from '../components/filedropper_Public/index';
import PrivateContainer from '../components/privateContainer/index';
import FileModal from '../components/filemodal/index';
import ErrorFileModal from '../components/errorfilemodal/index';
import ImageFileModal from '../components/imageModal/index';
import Avatar from '../components/avatarMain/index';
import './style.css';
import {throttle,debounce} from 'lodash';
import Footer from '../components/footer/index'
import SocialButton from '../components/SocialSharingPublic/index';
import { transitions, positions, Provider as AlertProvider,types } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { PublicMainContext } from '../context/Maincontext';

const worker = new Worker("../worker.js");
const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE,
    type: types.SUCCESS
  }
const PublicRoom = (props) => {
   
//TODO code splitting components
const {gotFile,download,downloadAbort,error,errorMssg,setGotFile,imgsrc,hostName,gotImg}= useContext(PublicMainContext)

   
    return (
        <AlertProvider template={AlertTemplate} {...options}>
                <main id="dropimg">
                  <div className="dropper public-drop">
                            <Filedropper />  
                            {gotFile?<FileModal openModal={gotFile} handleAbort={downloadAbort} handleDownload={download} />:null}
                            {error?<ErrorFileModal openModal={error} handleAbort={downloadAbort} handleDownload={download} >{errorMssg}</ErrorFileModal>:null}
                            {gotImg?<ImageFileModal openModal={gotImg} handleAbort={downloadAbort} setGotFile={setGotFile} handleDownload={download} src={imgsrc} ></ImageFileModal>:null}
                            
                  </div>
                  <div className="public-info share-info ">
                    <div className = "userInfo">
                        <Avatar index={hostName} >
                            <p>You</p>
                        </Avatar>

                    </div>
                    <div className = "qrCont">
                        <PrivateContainer {...props} />       
                    </div>
                    <div className = "sharingCont">
                    <SocialButton params={window.location.href}/>
                    </div>
                  </div>
                  <div className="footer" >
                    <Footer></Footer>
                  </div>
                </main>
               

        </AlertProvider>
    );
};

export default PublicRoom;
