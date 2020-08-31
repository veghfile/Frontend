import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios';
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import {clipimg} from '../util/clipimg';
import {AvatarGen} from '../util/randomAvatarGen';
import QRCode from '../components/qrcode/index';
import Filedropper from '../components/filedropper/index';
import FileModal from '../components/filemodal/index';
import ImageFileModal from '../components/imageModal/index';
import Avatar from '../components/avatarMain/index';
import {throttle} from 'lodash';
import './style.css';
import SocialButton from '../components/SocialSharing/index';
import Footer from '../components/footer/index'
import codec from 'string-codec'
import { transitions, positions, Provider as AlertProvider,types } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
const worker = new Worker("../worker.js");

const Room = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState();
    const [gotFile, setGotFile] = useState(false);
    const [amIHost, setamIHost] = useState(false);
    const [position, setPosition] = useState(0);
    const [isloading, setIsloading] = useState(1);
    const [maxLoad, setMaxLoad] = useState(0);
    const [hostName, setHostName] = useState(0);
    const [userNames, setUserNames] = useState([]);
    const [btnWait, setBtnWait] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [load, setLoad] = useState(false);
    const [receiver, setReceiver] = useState(false);
    const [pubIp , setPubIp] = useState("")
    const [currentURL , setCurrentURL] = useState("")
    const [gotImg, setGotImg] = useState(false);
    const [imgsrc , setImgSrc] = useState("")
    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");
    const pendingOp = useRef("");
    let count = 0;
    const roomID = codec.encoder(props.match.params.roomID,'base64');
    let flag = false
    

    const options = {
        // you can also just use 'bottom center'
        position: positions.BOTTOM_CENTER,
        timeout: 5000,
        offset: '30px',
        // you can also just use 'scale'
        transition: transitions.SCALE,
        type: types.SUCCESS
      }

    useEffect( ()=>{
        (async () => {
        if (!window.WritableStream) {
            streamSaver.WritableStream = WritableStream;
        }
        setCurrentURL(window.location.href)
        socketRef.current = io("https://p2p-dev.herokuapp.com/"); //Hosted socketIo server only use if you only want to make frontend changes
        // socketRef.current = io("https://192.168.0.106:8000/");       //This is the local socketIo server

        //This statement is used if the user is on the public route
        socketRef.current.emit("join room", roomID,true);          
        getip(setPubIp)
        
        socketRef.current.on("all users", users => {
            peerRef.current = createPeer(users.usersInThisRoom[0], socketRef.current.id);

        });
 
        socketRef.current.on("usernames", users => {
            setUserNames(users)
            if(!flag){
                setHostName(users[users.length-1].name)
                setPosition(users[users.length-1].id)
                flag = true
            }
         })
        
        socketRef.current.on("user joined", payload => {
            peerRef.current = addPeer(payload.signal, payload.callerID);
        });

        socketRef.current.on("receiving returned signal", payload => {
            peerRef.current.signal(payload.signal);
            setConnection(true);
        });
        
        //calling Download service worker
        worker.addEventListener("message", (e)=>down(e,fileNameRef.current,peerRef.current));

        socketRef.current.on("room full", () => {
            alert("room is full");
        })

        socketRef.current.on("user left", (data) => {
            handleLeaving()
            setConnection(false);
        });

        clipimg(setFile,setConfirmSend,setGotImg,setImgSrc)
    })()
    }, []);

    function handleLeaving (){

        if(pendingOp.current){
            window.location.reload(false)
        }
        setReceiver(false)
        setGotFile(false);
        worker.postMessage("abort");
    }

    function createPeer(userToSignal, callerID) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        //handling guest avatar creating logic here
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal});
        });

        peer.on("data", handleReceivingData);
        return peer;
    }
    
    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config:{iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                { urls: 'stun:stun.services.mozilla.com' },

              ]}
        });

        //handling host avatar creating logic here
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID });
        });

        peer.on("data",(e)=>{handleReceivingData(e)});
        peer.signal(incomingSignal);
        setConnection(true);
        return peer;
    }

    function handleReceivingData(data) {
        let parsed
        let dataString = data.toString()
        switch (true) {
            case dataString.includes("maxProgress"):
                parsed = JSON.parse(data);
                setMaxLoad(parsed.maxProgress)                 
                break;
            case dataString.includes("load"):
                setLoad(false)
                setBtnWait(true)                
                break;
            case dataString.includes("wait"):
                setBtnWait(false);             
                break;
            case dataString.includes("done"):
                setGotFile(true);
                setReceiver(false);
                parsed = JSON.parse(data);
                pendingOp.current = false  ;
                count = 0;
                setIsloading(0)
                fileNameRef.current = parsed.fileName;            
                const peer = peerRef.current;
                peer.write(JSON.stringify({load:true}));              
                break;        
            default: 
                throttle(()=>{
                    setIsloading(count=>count+1)},10000)()
                setReceiver(true)
                worker.postMessage(data);
        }        
    }


    function download() {
        setGotFile(false);
        worker.postMessage("download");
    }

    function downloadAbort() {
        setGotFile(false);
        pendingOp.current = false;
        count = 0;
        setIsloading(0)
        worker.postMessage("abort");
        const peer = peerRef.current;
        peer.write(JSON.stringify({ wait:true}));
    }

    function sendConfirm (ans){
        if(ans){
            sendFile(file)
            setConfirmSend(false)
            setGotImg(false)
        } else{
            setConfirmSend(false)
            setGotImg(false)
        }
    }

    function sendFile(file) {
        const peer = peerRef.current;
        const stream = file.stream();
        const reader = stream.getReader();
        setMaxLoad(Math.floor(file.size/65536))

        sendData(roomID,file,hostName,pubIp)

        setLoad(true)
        peer.write(JSON.stringify({ maxProgress:file.size/65536}));
        pendingOp.current = true
        reader.read().then(obj => {
            handlereading(obj.done, obj.value);
        });
        
        function handlereading(done, value) {
            if (done) {
                peer.write(JSON.stringify({ done: true, fileName: file.name}));
                count = 0;
                return;
            }

            // setIsloading(count=>count+1)
                  
            peer.write(value);
            reader.read().then(obj => {
                handlereading(obj.done, obj.value);
            })
        }
        

    }

    async function sendData (roomID,file,hostName,pubIp){

        // You can host your DB and store basic data about the transfer
        const response = await axios.post('https://p2p-dev.herokuapp.com/log',{
        "roomID":roomID,
        data:file.size,
        UserID:hostName,
        PublicIP:pubIp
      })
}

    function fileCallback(file){
        setFile(file);
        setConfirmSend(true)
    }


//TODO code splitting components

   
    return (
        <AlertProvider template={AlertTemplate} {...options}>
                <main>
                  <div className="dropper">
                            <Filedropper 
                            connectionEstablished={connectionEstablished} 
                            fileCallback={fileCallback} 
                            wait={btnWait} 
                            setBtnWait={setBtnWait}
                            isloading={isloading} 
                            receiver={receiver}
                            setLoad={setLoad}
                            position = {hostName}
                            confirmSend={confirmSend}
                            sendConfirm={sendConfirm}
                            maxLoad={maxLoad}
                            load={load}
                            position = {hostName}
                            users = {userNames}
                            sendFile={sendFile} />  
                            {gotFile?<FileModal openModal={gotFile} handleAbort={downloadAbort} handleDownload={download} />:null}
                            {gotImg?<ImageFileModal openModal={gotImg} handleAbort={downloadAbort} setGotFile={setGotFile} handleDownload={download} src={imgsrc} ></ImageFileModal>:null}
                  </div>
                  <div className="share-info">
                    <div className = "userInfo">
                        <Avatar index={hostName} >
                            <p>You</p>
                        </Avatar>
                    </div>
                    <div className = "qrCont">
                        <QRCode qrUrl  = {currentURL} params={props.match.params.roomID}></QRCode>
                    </div>
                    <div className = "sharingCont">
                            <SocialButton params={window.location.href}/>
                    </div>
                  </div>
                  <div className="footer">
                    <Footer></Footer>
                  </div>
                </main>

        </AlertProvider>
    );
};

export default Room;
