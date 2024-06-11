let captureInterval;
let videoStream;

export async function startCapture(storage) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoStream = stream;
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    captureInterval = setInterval(async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            const fileName = `photos/${Date.now()}.jpg`;
            const storageRef = storage.ref().child(fileName);
            await storageRef.put(blob);
            console.log(`Uploaded ${fileName}`);
        }, 'image/jpeg');
    }, 1000);
}

export function stopCapture() {
    clearInterval(captureInterval);
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    console.log('Capturing stopped.');
}
