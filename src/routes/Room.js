import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import QRCode from '../components/qrcode/index';
import Filedropper from '../components/filedropper/index';
import FileModal from '../components/filemodal/index';
import './style.css'


const worker = new Worker("../worker.js");

const Room = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState();
    const [gotFile, setGotFile] = useState(false);
    const [amIHost, setamIHost] = useState(false);
    const [isloading, setIsloading] = useState(0);
    const [hostName, setHostName] = useState("");
    const [guestName, setGuestName] = useState("");
    const [btnWait, setBtnWait] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [load, setLoad] = useState(false);
    const [receiver, setReceiver] = useState(false);
    const [pubIp , setPubIp] = useState("")
    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");
    const pendingOp = useRef("");
    
    const roomID = props.match.params.roomID;
    
    
    useEffect( async () => {
        if (!window.WritableStream) {
            streamSaver.WritableStream = WritableStream;
        }

        socketRef.current = io("https://p2p-dev.herokuapp.com/");
        // socketRef.current = io("http://192.168.0.103:8000/");       //This is the socketIo server

        //This statement is used if the user is on the public route
        if(roomID == "public"){
            getip(setPubIp,socketRef.current)
        } else {
            socketRef.current.emit("join room", roomID,true);          //private logic (TODO split this logic)
        }

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
            // alert("user diconnected",data);
            handleLeaving()
            setConnection(false);
        });

    }, []);

    function handleLeaving (){
        console.log(pendingOp.current);
        
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
            let gname = Math.random()
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
            let hname = Math.random()
            socketRef.current.emit("returning signal", { signal, callerID,username:hname });
            setamIHost(true)
            setHostName(hname)
        });

        peer.on("data",handleReceivingData);
        peer.signal(incomingSignal);
        setConnection(true);
        return peer;
    }

    function handleReceivingData(data) {
        //todo convert to switch case
        if(data.toString().includes("load")){
            setLoad(false)
            setBtnWait(true)            
        }else if(data.toString().includes("wait")){
            setBtnWait(false);
        } else if (data.toString().includes("done") ) {
            setGotFile(true);
            setReceiver(false);
            pendingOp.current = false    
            const parsed = JSON.parse(data);
            fileNameRef.current = parsed.fileName;            
            const peer = peerRef.current;
            peer.write(JSON.stringify({ load:true}));
        }else{
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
        pendingOp.current = false
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
        // setIsloading(0)
        const peer = peerRef.current;
        const stream = file.stream();
        const reader = stream.getReader();
        pendingOp.current = true
        // let progress = 0
        reader.read().then(obj => {
            handlereading(obj.done, obj.value);
            setLoad(true)
            // progress++
        });
        
        function handlereading(done, value) {
            if (done) {
                peer.write(JSON.stringify({ done: true, fileName: file.name}));
                // setIsloading(progress)
                return;
            }

            peer.write(value);
            reader.read().then(obj => {
                handlereading(obj.done, obj.value);
                // progress++
                // setIsloading(progress++)
            })
        }
    }

    function fileCallback(file){
        setFile(file);
        setConfirmSend(true)
        // sendFile(file);
    }


//TODO code splitting components

    let loading =<span>{isloading}<progress id="file" value={isloading} > 32% </progress></span>
    return (
        <>
                <main>
                  <div className="dropper">
                            <Filedropper 
                            connectionEstablished={connectionEstablished} 
                            fileCallback={fileCallback} 
                            wait={btnWait} 
                            setBtnWait={setBtnWait}
                            load={load} 
                            receiver={receiver}
                            setLoad={setLoad}
                            confirmSend={confirmSend}
                            sendConfirm={sendConfirm}
                            guestName={amIHost?guestName:hostName} 
                            sendFile={sendFile} />  
                            {gotFile?<FileModal openModal={gotFile} handleAbort={downloadAbort} handleDownload={download} />:null}
                            {/* {loading} */}
                  </div>
                  <div className="share-info">
                    <div className = "userInfo">
                        <h1>INFO</h1>
                        <h2>You:- {amIHost?hostName:guestName}</h2><br/>
                        <h2>{pubIp}</h2>
                    </div>
                    <div className = "qrCont">
                        <QRCode qrUrl  = "www.google.com"></QRCode>
                    </div>
                    <div className = "sharingCont">
                            <p>Box3</p>
                    </div>
                  </div>
                  <div className="footer">
                    <h1>Box 3</h1>
                  </div>
                </main>

        </>
    );
};

export default Room;
