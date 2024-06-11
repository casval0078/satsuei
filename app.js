let captureInterval;
let videoStream;

export async function startCapture(storage) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream = stream;
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // ビデオストリームのサイズを取得してキャンバスサイズを設定
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };

        captureInterval = setInterval(async () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const fileName = `photos/${Date.now()}.jpg`;
                    const storageRef = storage.ref().child(fileName);
                    try {
                        await storageRef.put(blob);
                        console.log(`Uploaded ${fileName}`);
                    } catch (error) {
                        console.error(`Failed to upload ${fileName}:`, error);
                    }
                } else {
                    console.error('Failed to create blob from canvas');
                }
            }, 'image/jpeg');
        }, 1000);
    } catch (error) {
        console.error('Error accessing user media:', error);
    }
}

export function stopCapture() {
    clearInterval(captureInterval);
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    console.log('Capturing stopped.');
}
