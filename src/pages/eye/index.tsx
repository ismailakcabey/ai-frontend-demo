import { notification } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

const EyePage = () => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [socketStatus, setSocketStatus] = useState<boolean>(false)
    const [audioData, setAudioData] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        if (!socketStatus) {
            const socketData = new WebSocket(
                "ws://localhost:8000/eye/ws"
            );
            socketData.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:" + event);
            });
            socketData.addEventListener("message", (event) => {
                console.log(event?.data, "event mesaj geldiiiiiiii");
                if (event?.data.length > 2) {
                    let base64_data = "data:audio/wav;base64," + event?.data.substring(2, event?.data.length - 1);
                    setAudioData((old) => [...old, base64_data]);
                    setLoading(false)
                    notification.success({
                        message: 'Get Successfully',
                        description: 'Answer get successfully',
                    })
                } else {
                }
            });

            socketData.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:" + event);

            });
            //@ts-ignore
            setSocket(socketData)
            setSocketStatus(true)
            return () => {
                // Cleanup function to close the WebSocket when the component is unmounted
                if (socketData && socketData.readyState === WebSocket.OPEN) {
                    socketData.close();
                }
            };
        }
        else {
            console.log("WebSocket connection")
        }
    }, [socketStatus])


    const startRecording = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        //@ts-ignore
        videoRef.current.srcObject = stream;
        //@ts-ignore
        mediaRecorderRef.current = new MediaRecorder(stream);
        //@ts-ignore
        const chunks = [];

        // Her saniye bir anlık görüntü alımı ve socket'e gönderimi
        const intervalId = setInterval(() => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            //@ts-ignore
            canvas.width = videoRef.current.videoWidth;
            //@ts-ignore
            canvas.height = videoRef.current.videoHeight;
            //@ts-ignore
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Canvas'ten base64 formatına dönüştürme
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            notification.success({
                message: 'Send Successfully',
                description: 'Photo sent successfully',
            })
            setLoading(true)
            //@ts-ignore
            socket.send(imageDataUrl);
        }, 4000); // Her 4 saniye

        //@ts-ignore
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        //@ts-ignore
        mediaRecorderRef.current.onstop = () => {
            clearInterval(intervalId); // Kayıt durduğunda interval'ı temizle
            //@ts-ignore
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);

            // Kayıt durduğunda yapılacak işlemler
        };

        //@ts-ignore
        mediaRecorderRef.current.start();
        setIsRecording(true);
    }, [loading, socket, videoRef, mediaRecorderRef, setLoading])


    const stopRecording = () => {
        //@ts-ignore
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };



    return (
        <>
            <div className="flex flex-col">
                <div className="text-3xl">Eye Page</div>
                <div className="flex flex-col">
                    <video ref={videoRef} autoPlay />
                    {isRecording ? (
                        <button className="rounded-lg cursor-pointer text-black font-bold my-2 text-xl border-2 border-dashed border-red-700" onClick={stopRecording}>Stop Recording</button>
                    ) : (
                        <button className="rounded-lg my-2 cursor-pointer text-xl border-2 border-solid border-black" onClick={startRecording}>Start Recording</button>
                    )}
                </div>
                <div className="flex flex-col">
                    {audioData.map((voiceData, index) => (
                        <div key={index}>
                            <audio controls>
                                <source src={voiceData} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default EyePage