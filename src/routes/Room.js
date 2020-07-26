import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import './style.css'
// const Container = styled.div`
//     padding: 20px;
//     display: flex;
//     height: 100vh;
//     width: 90%;
//     margin: auto;
//     flex-wrap: wrap;
// `;

const worker = new Worker("../worker.js");

const Room = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState();
    const [gotFile, setGotFile] = useState(false);
    const [isloading, setIsloading] = useState(0);
    const [hostName, setHostName] = useState("");
    const [guestName, setGuestName] = useState("");
    const [btnWait, setBtnWait] = useState(false);
    const [pubIp , setPubIp] = useState("")
    const chunksRef = useRef([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const peerRef = useRef();
    const fileNameRef = useRef("");
    
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
            console.log("guest",payload);
        });

        socketRef.current.on("receiving returned signal", payload => {
            peerRef.current.signal(payload.signal);
            console.log("host",payload);
            setHostName(payload.username)
            setConnection(true);
        });

        //calling Download service worker
        worker.addEventListener("message", (e)=>down(e,fileNameRef.current,peerRef.current));

        socketRef.current.on("room full", () => {
            alert("room is full");
        })

        socketRef.current.on("user left", (data) => {
            alert("user diconnected",data);
            setConnection(false);
        });

    }, []);

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
            setHostName(hname)
        });

        peer.on("data",handleReceivingData);
        peer.signal(incomingSignal);
        setConnection(true);
        return peer;
    }

    function handleReceivingData(data) {

        if(data.toString().includes("wait")){
            setBtnWait(false);
        } else if (data.toString().includes("done") ) {
            setGotFile(true);
            const parsed = JSON.parse(data);
            fileNameRef.current = parsed.fileName;            

        }else{
            worker.postMessage(data);
        } 
        
    }


    function download() {
        setGotFile(false);
        worker.postMessage("download");
    }

    function selectFile(e) {
        setFile(e.target.files[0]);
    }

    function sendFile() {
        setBtnWait(true)
        // setIsloading(0)
        const peer = peerRef.current;
        const stream = file.stream();
        const reader = stream.getReader();
        // let progress = 0
        reader.read().then(obj => {
            handlereading(obj.done, obj.value);
            // progress++
        });

        function handlereading(done, value) {
            if (done) {
                peer.write(JSON.stringify({ done: true, fileName: file.name}));
                // console.log(progress);
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


//TODO code splitting components

    let downloadPrompt;
    if (gotFile) {
        downloadPrompt = (
            <div>
                <span>You have received a file. Would you like to download the file?</span>
                <button onClick={download}>Yes</button>
            </div>
        );
    }
    let loading =<span>{isloading}<progress id="file" value={isloading} > 32% </progress></span>
    return (
        <>
            {connectionEstablished?(
                <main>
                  <div class="dropper">
                        <div>
                            <input onChange={selectFile} type="file" />
                            <button disabled={btnWait} onClick={sendFile}>Send file</button>
                            {downloadPrompt}
                            {loading}
                        </div>
                  </div>
                  <div class="share-info">
                    <h1>INFO</h1>
                    <h2>Host:- {hostName}</h2><br/>
                    <h2>Guest:- {guestName} </h2>
                    <h2>{pubIp}</h2>
                  </div>
                  <div class="footer">
                    <h1>Box 3</h1>
                  </div>
                </main>
            ):(
                <main>
                <div class="dropper">
                <h1>Once you have a peer connection, you will be able to share files</h1>
                </div>
                <div class="share-info">
                  <h1>NO INFO</h1>
                </div>
                <div class="footer">
                  <h1>Box 3</h1>
                </div>
              </main>
            )}
        </>
    );
};

export default Room;