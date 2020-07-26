export async function pipe(readStream, writeStream) {
    const writer = writeStream.getWriter();
    for await(const chunk of readStream) {
        await writer.write(chunk);
    }
    await writer.close();
}

export function streamAsyncIterator(readableStream) {
    const reader = readableStream.getReader();
    return {
        next() {
            return reader.read();
        },
        return() {
            return reader.cancel();
        },
        [Symbol.asyncIterator]() {
            return this;
        }
    }
}