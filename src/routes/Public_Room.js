import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import {AvatarGen} from '../util/randomAvatarGen';
import QRCode from '../components/qrcode/index';
import Filedropper from '../components/filedropper/index';
import PrivateContainer from '../components/privateContainer/index';
import FileModal from '../components/filemodal/index';
import Avatar from '../components/avatarMain/index';
import './style.css';
import { v1 as uuid } from "uuid";

import SocialButton from '../components/SocialSharingPublic/index';


const worker = new Worker("../worker.js");

const PublicRoom = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState();
    const [gotFile, setGotFile] = useState(false);
    const [amIHost, setamIHost] = useState(false);
    const [isloading, setIsloading] = useState(1);
    const [maxLoad, setMaxLoad] = useState(0);
    const [hostName, setHostName] = useState("");
    const [guestName, setGuestName] = useState("");
    const [btnWait, setBtnWait] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [load, setLoad] = useState(false);
    const [receiver, setReceiver] = useState(false);
    const [pubIp , setPubIp] = useState("")
    const [currentURL , setCurrentURL] = useState("")
    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");
    const pendingOp = useRef("");
    let count = 0;
    
    useEffect( async () => {
        if (!window.WritableStream) {
            streamSaver.WritableStream = WritableStream;
        }
        setCurrentURL(window.location.href)
        socketRef.current = io("https://p2p-dev.herokuapp.com/");
        // socketRef.current = io("http://192.168.0.103:8000/");       //This is the socketIo server

        //This statement is used if the user is on the public route
            getip(setPubIp,socketRef.current)

        socketRef.current.on("all users", users => {
            peerRef.current = createPeer(users[0], socketRef.current.id);
        });
        
        socketRef.current.on("user joined", payload => {
            peerRef.current = addPeer(payload.signal, payload.callerID);
            setGuestName(payload.username)
        });

        socketRef.current.on("receiving returned signal", payload => {
            peerRef.current.signal(payload.signal);
            setHostName(payload.username)
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
            let gname = Math.floor(Math.random() * 50) + 1
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal,username:gname });
            setGuestName(gname)
        });

        peer.on("data", handleReceivingData);
        return peer;
    }
    
    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        //handling host avatar creating logic here
        peer.on("signal", signal => {
            let hname = Math.floor(Math.random() * 50) + 1
            socketRef.current.emit("returning signal", { signal, callerID,username:hname });
            setamIHost(true)
            setHostName(hname)
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
                setIsloading(count=>count+1)
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
        } else{
            setConfirmSend(false)
        }
    }

    function sendFile(file) {
        const peer = peerRef.current;
        const stream = file.stream();
        const reader = stream.getReader();
        setMaxLoad(Math.floor(file.size/65536))
        peer.write(JSON.stringify({ maxProgress:file.size/65536}));
        pendingOp.current = true
        setLoad(true)
        reader.read().then(obj => {
            handlereading(obj.done, obj.value);
        });
        
        function handlereading(done, value) {
            if (done) {
                peer.write(JSON.stringify({ done: true, fileName: file.name}));
                count = 0;
                return;
            }
            
            setIsloading(count=>count+1)
            
            
            peer.write(value);
            reader.read().then(obj => {
                handlereading(obj.done, obj.value);
            })
        }
        

    }

    function fileCallback(file){
        setFile(file);
        setConfirmSend(true)
    }


//TODO code splitting components

   
    return (
        <>
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
                            confirmSend={confirmSend}
                            sendConfirm={sendConfirm}
                            maxLoad={maxLoad}
                            load={load}
                            guestName={amIHost?guestName:hostName} 
                            sendFile={sendFile} />  
                            {gotFile?<FileModal openModal={gotFile} handleAbort={downloadAbort} handleDownload={download} />:null}
                  </div>
                  <div className="public-info share-info ">
                    <div className = "userInfo">
                        <Avatar index={amIHost?hostName:guestName} >
                        </Avatar>
                    </div>
                    <div className = "qrCont">
                        <PrivateContainer {...props}/>       
                    </div>
                    <div className = "sharingCont">
                    <SocialButton/>
                    </div>
                  </div>
                  <div className="footer">
                    <h1>Box 3</h1>
                  </div>
                </main>

        </>
    );
};

export default PublicRoom;
