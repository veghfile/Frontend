import React, {useState,createContext,useEffect,useRef} from 'react'
import io from "socket.io-client";
import Peer from "simple-peer";
import { WritableStream ,ReadableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from "streamsaver";
import {down} from '../util/downloader';
import {getip} from '../util/getip';
import {clipimg} from '../util/clipimg';
import axios from 'axios';
import {throttle} from 'lodash';
const worker = new Worker("../worker.js");

export const PublicMainContext = createContext();

export const MainPublicProvider = (props) => {
  const [peers, setPeers] = useState([]);
  const [connectionEstablished, setConnection] = useState(false);
  const [file, setFile] = useState();
  const [gotFile, setGotFile] = useState(false);
  const [gotImg, setGotImg] = useState(false);
  const [error, setError] = useState(false);
  const [errorMssg, setErrorMssg] = useState("The Users Lost connectivity. Click ok to refresh the page or try after a while..");
  const [isloading, setIsloading] = useState(1);
  const [maxLoad, setMaxLoad] = useState(0);
  const [hostName, setHostName] = useState(51);
  const [position, setPosition] = useState(0);
  const [userNames, setUserNames] = useState([]);
  const [btnWait, setBtnWait] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [load, setLoad] = useState(false);
  const [receiver, setReceiver] = useState(false);
  const [checkReset, setCheckReset] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pubIp , setPubIp] = useState("")
  const [imgsrc , setImgSrc] = useState("")
  const [users , setUsers] = useState();
  const chunksRef = useRef([]);
  const socketRef = useRef();
  const peersRef = useRef([]);
  const peerRef = useRef([]);
  const inRoomUsers = useRef([]);
  const fileNameRef = useRef("");
  const uniqueUserref = useRef("hehe");
  const pendingOp = useRef("");
  let count = 0;
  let flag = false;
  let array = new Set()
  let guestPeers = []
  const roomID = "public";


    useEffect( ()=>{
      (async () => {
      if (!window.WritableStream) {
          streamSaver.WritableStream = WritableStream;
      }
      socketRef.current = io("https://p2p-dev.herokuapp.com/"); //Hosted socketIo server only use if you only want to make frontend changes
      // socketRef.current = io("https://192.168.0.106:8000/");       //This is the local socketIo server

      //This statement is used if the user is on the public route
          getip(setPubIp,socketRef.current)

          socketRef.current.on("all users", users => {
              const peers = [];
              users.usersInThisRoom.forEach((userID,index) => {
                  const peer = createPeer(userID, socketRef.current.id);
                  peersRef.current.push({
                      peerID: userID,
                      peer,
                      name:users.usersNamesInThisRoom[index]
                  })
                  peers.push(peer);
              })
             setCheckReset(true)
              if(!flag){
                  setHostName(users.usersNamesInThisRoom[users.usersNamesInThisRoom.length-1].name)
                  setPosition(users.usersNamesInThisRoom[users.usersNamesInThisRoom.length-1].id)
                  flag = true;
              }
              setPeers(peers);
              guestPeers =  peersRef.current;
          })

          socketRef.current.on("usernames", users => {
             setUserNames(users)
             inRoomUsers.current = users
             setCheckReset(true)
             
             if(!flag){
                 setHostName(users[users.length-1].name)
                 setPosition(users[users.length-1].name.id)
                 flag = true
             }
          })
          socketRef.current.on("user joined", payload => {
              const peer = addPeer(payload.signal, payload.callerID);
              peersRef.current.push({
                  peerID: payload.callerID,
                  peer,
              })
              setPeers(users => [...users, peer]);
             setCheckReset(true)
      });

      socketRef.current.on("receiving returned signal", payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal);
          setConnection(true);
      });
      
      //calling Download service worker
      worker.addEventListener("message", (e)=>down(e,fileNameRef.current));

      socketRef.current.on("room full", () => {
          alert("room is full");
      })

      socketRef.current.on("user left", (data) => {
          handleLeaving()
      });

      clipimg(setFile,setConfirmSend,setGotImg,setImgSrc)

  })()

  }, []);
  function handleLeaving (){

    if(pendingOp.current){
        setErrorMssg("User Left The file Might be Coruptted.")
      setError(true)
    }   
    if(inRoomUsers.current.length<2){            
        setConnection(false);
        setReceiver(false)
        setGotFile(false);
    }
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

    peer.on("data",handleReceivingData);
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
        socketRef.current.emit("returning signal", { signal, callerID});
    });

    peer.on("data",handleReceivingData);
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
            pendingOp.current = false;
            count = 0;
            setIsloading(0)
            fileNameRef.current = parsed.fileName; 
            peersRef.current = peersRef.current.filter((el) => {
                return inRoomUsers.current.map((f) => {
                    return el.peerID == f.id;
                });
              });     
            Promise.resolve()
            .then(() => 
            peersRef.current.forEach(item =>item.peer.write(JSON.stringify({load:true})))
            ).catch(console.log)
            break;        
        default: 
        throttle(()=>{setIsloading(count=>count+1)},10000)() 
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

    peersRef.current = peersRef.current.filter((el) => {
        return inRoomUsers.current.map((f) => {
            return el.peerID == f.id;
        });
      });
      

    const stream = file.stream();
    const reader = stream.getReader();

    setLoad(true)
    setMaxLoad(Math.floor(file.size/65536))
    setCheckReset(true)
    pendingOp.current = true
    
    sendData(roomID,file,hostName,pubIp)
    
    let peersToSend = peersRef.current.filter(item => uniqueUserref.current.has(item.peerID))
    peersToSend = peersToSend.length == 0 ? peersRef.current : peersToSend


    Promise.resolve()
    .then(() => 
        peersToSend.forEach(item =>item.peer.write(JSON.stringify({ maxProgress:file.size/65536})))
    ).catch((errors)=>{
        setError(true)
        window.location.reload(false)
    })
        
    reader.read().then(obj => {
        handlereading(obj.done, obj.value);
    });
    
    function handlereading(done, value) {
        if (done) {
            peersToSend.forEach(item =>item.peer.write(JSON.stringify({ done: true, fileName: file.name})));
            count = 0;
            pendingOp.current = false
            return;
        }
        
        // debounce((isloading)=>setIsloading(isloading+1),100)

        peersToSend.forEach(item => item.peer.write(value));
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

function peersAddCallback(peers){
    array.add(peers,peers)
    uniqueUserref.current = array   
}

function peersRemoveCallback(peers){
    array.delete(peers)
    uniqueUserref.current = array
}

function checkCallback(){
    setCheckReset(false)
}

const states = {
  connectionEstablished,
  fileCallback,
  wait:btnWait,
  setBtnWait,
  isloading,
  receiver,
  setLoad,
  confirmSend,
  sendConfirm,
  checked,
  setChecked,
  maxLoad,
  load,
  hostName,
  position:hostName,
  users:userNames,
  checkReset,
  checkCallback,
  setPeers:peersAddCallback,
  delPeers:peersRemoveCallback,
  sendFile,
  gotFile,
  downloadAbort,
  download,
  setGotFile,
  errorMssg,
  imgsrc,
  gotImg
  }

//TODO code splitting components

  return (
    <PublicMainContext.Provider value={states}>
      {props.children}
    </PublicMainContext.Provider>
  )
}