
export async function clipimg(setFile,setConfirmSend,setGotImg,setImgSrc) {


  document.addEventListener('paste', function(event) {
    var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      // return blob
      setGotImg(true)
      setConfirmSend(true)
      setFile(blob)
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImgSrc(evt.target.result)
      };
      reader.readAsDataURL(blob);
    }
  });
}