import {pipe, streamAsyncIterator} from './pipe';
import streamSaver from "streamsaver";

export async function down(event, fname, pname) {
    const stream = event
        .data
        .stream();
    const fileStream = streamSaver.createWriteStream(fname);
    if (stream.pipeTo) {
        stream.pipeTo(fileStream);
    } else {
        //custom pipe function for unsupported browsers
        await pipe(streamAsyncIterator(event.data.stream()), fileStream);
    }
    if(pname){
        const peer = pname;
        peer.write(JSON.stringify({wait: true}))
    }
    // Promise.resolve()
    // .then(() => 
    // ).catch(console.log)
}