import axios from 'axios';

export function getip(setPubIp, socketRef) {

    axios
        .get(`https://api64.ipify.org/?format=json`)
        .then((response) => {
            let pubId = response.data.ip
            setPubIp(pubId)
            socketRef.emit("join room using ip", pubId);
        })
        .catch(error => {
            error = new Error("NOT FOUND 404");
        })
}