export function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b))
    const img64 = window.btoa(binary)
    window.localStorage.setItem('profileImage', img64)
}

export function BufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b))
    const img64 = window.btoa(binary)
    return img64
}

export function Base64ToArrayBuffer(dataURI) {
    const imgType = dataURI.match(/image\/([a-zA-Z]*)/)
    const byteString = atob(dataURI.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: `${imgType[0]}` })
}
