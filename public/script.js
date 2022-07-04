//peer js script
const socket = io('/')
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer()

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-disconnected', userId => {
        console.log('connection close', userId)
        if(peers[userId]) peers[userId].close()
        
    })
    socket.on('user-connected', userId => {
        connectNewUser(userId, stream)
    })
}).catch(error =>{
    console.log('dkjd', error)
})


myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })
    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
        video.muted = false
    })
    const videoGrid = document.getElementById('video-grid');
    console.log(videoGrid)
    videoGrid.append(video)
}

// let endCall = () => myVideo.srcObject.getTracks().forEach(track => track.stop())
function endCall(){
    myVideo.srcObject.getTracks().forEach(track => track.stop())
    window.location.replace('/')
}

function videoCam(e){
    const vid = myVideo.srcObject.getTracks().find(track => track.kind == 'video')
    if (vid.enabled){
        vid.enabled = false;
        e.target.innerHTML = 'Show cam';
    }else{
        vid.enabled = true;
        e.target.innerHTML = 'Hide cam';
    }
}

function mute(e){
    const vid = myVideo.srcObject.getTracks().find(track => track.kind == 'audio')
    if (vid.enabled){
        vid.enabled = false;
        e.target.innerHTML = 'Unmute';
    }else{
        vid.enabled = true;
        e.target.innerHTML = 'Mute';
    }
}



//other script

//copy room id

