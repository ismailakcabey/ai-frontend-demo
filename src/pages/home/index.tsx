import { useCallback, useEffect, useRef, useState } from "react"
import { useConverstationCreate } from "../../apis/services/converstation";
import { usePredictCreate } from "../../apis/services/predict";
import { Input, Popover, Spin, notification } from "antd";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Microphone, Record, Send } from "iconsax-react";
import { useConverstationStore } from "../../stores/converstation.store";
import { useWordsCreate } from "../../apis/services/words";

const HomePage = () => {
    const [currentLanguage, setCurrentLanguage] = useState<string>()
    const [currentSubject, setCurrentSubject] = useState<string>()
    const [converstationId, setConverstationId] = useState<string>()
    const converstationMutation = useConverstationCreate();
    const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false)
    const wordMutation = useWordsCreate();
    const predictMutation = usePredictCreate()
    const [loading, setLoading] = useState<boolean>(false)
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const [messages, setMessages] = useState<any[]>([])
    const [isActiveConverstation, setActiveConverstation] = useState<boolean>(false)
    const [outputTypeVoiceStatus, setOutputTypeVoiceStatus] = useState<boolean>(false)
    const [inputTypeVoiceStatus, setInputTypeVoiceStatus] = useState<boolean>(false)
    const [currentLevel, setCurrentLevel] = useState<string>()
    const [isRecording, setIsRecording] = useState(false);
    const [audioSrc, setAudioSrc] = useState(null);
    const [popoverContent, setPopoverContent] = useState(null);
    const { setLang, lang } = useConverstationStore()
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const messagesContainerRef = useRef(null);
    const createConverstation = useCallback(async () => {
        setLoading(true)
        const strData = new Date
        const result = await converstationMutation.mutateAsync({
            "name": strData.toISOString(),
            "lang": currentLanguage,
            "subject": currentSubject
        });
        console.log(result);
        const converstationId = result?.data?._id
        setConverstationId(converstationId)
        let newObject = {
            isInputVoice: false,
            isOutputVoice: outputTypeVoiceStatus,
            converstationId: converstationId,
            lang: currentLanguage,
            question: ""
        }
        if (currentLanguage == "tr") {
            if (currentSubject == "tech") {
                newObject.question = "Teknoloji hakkında konuşalım"
            }
            if (currentSubject == "crypto") {
                newObject.question = "Kripto paralar hakkında konuşalım"
            }
            if (currentSubject == "ai") {
                newObject.question = "Yapay zeka hakkında konuşalım"
            }
            if (currentSubject == "football") {
                newObject.question = "Futbol hakkında konuşalım"
            }
            const newPredictResult = await predictMutation.mutateAsync(newObject)
            console.log(newPredictResult, 'son veri burada')
            const newList = messages
            const audioDataUrl = `data:audio/wav;base64,${newPredictResult?.data?.outputVoiceData}`;
            newList.push({
                text: newPredictResult?.data?.answer,
                type: "AI",
                id: newPredictResult?.data?._id,
                voice: audioDataUrl
            })
            setMessages(newList)
        }
        else {
            if (currentSubject == "tech") {
                newObject.question = "We talking about tech"
            }
            if (currentSubject == "crypto") {
                newObject.question = "We talking about crypto currency"
            }
            if (currentSubject == "ai") {
                newObject.question = "We talking about ai"
            }
            if (currentSubject == "football") {
                newObject.question = "We talking about  football"
            }
            const newPredictResult = await predictMutation.mutateAsync(newObject)
            console.log(newPredictResult, 'son veri burada')
            const newList = messages
            const audioDataUrl = `data:audio/wav;base64,${newPredictResult?.data?.outputVoiceData}`;
            newList.push({
                text: newPredictResult?.data?.answer,
                type: "AI",
                id: newPredictResult?.data?._id,
                voice: audioDataUrl,
            })
            setMessages(newList)
        }
        setActiveConverstation(true)
        setLoading(false)
    }, [currentLanguage, currentSubject, outputTypeVoiceStatus, inputTypeVoiceStatus])

    const sendPredict = useCallback(async () => {
        setIsMessageLoading(true)
        setText("")
        const newMessages = messages
        newMessages.push({
            type: "USER",
            text: text
        })
        const predictResult = await predictMutation.mutateAsync({
            isInputVoice: inputTypeVoiceStatus,
            isOutputVoice: outputTypeVoiceStatus,
            converstationId: converstationId,
            lang: currentLanguage,
            question: text,
            inputVoiceData: ""
        })
        const audioDataUrl = `data:audio/wav;base64,${predictResult?.data?.outputVoiceData}`;
        newMessages.push({
            id: predictResult?.data?._id,
            type: "AI",
            text: predictResult?.data?.answer,
            voice: audioDataUrl
        })
        setIsMessageLoading(false)
    }, [text, messages, converstationId, inputTypeVoiceStatus, outputTypeVoiceStatus, currentLanguage])

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        //@ts-ignore
        mediaRecorderRef.current = new MediaRecorder(stream);
        //@ts-ignore
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                //@ts-ignore
                recordedChunksRef.current.push(event.data);
            }
            setIsRecording(false);
        };
        //@ts-ignore
        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: "audio/wav" });
            const blobUrl = URL.createObjectURL(blob);
            //@ts-ignore
            setAudioSrc(blobUrl);
        };
        //@ts-ignore
        mediaRecorderRef.current.start();
    };

    const stopRecording = async () => {
        setIsRecording(false);

        if (
            mediaRecorderRef.current &&
            //@ts-ignore
            mediaRecorderRef.current.state === "recording"
        ) {
            //@ts-ignore
            mediaRecorderRef.current.stop();
            //@ts-ignore
            mediaRecorderRef.current.ondataavailable = async (e) => {
                if (e.data.size > 0) {
                    setIsMessageLoading(true)
                    // Ses kaydını Blob'a dönüştür
                    const blob = new Blob([e.data], { type: 'audio/wav' }); // mimeType olarak 'audio/wav' belirtiliyor

                    // Blob'u base64'e dönüştür
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        let base64data = reader.result;
                        //@ts-ignore
                        base64data = base64data?.split(',')[1];
                        console.log("Base64 Formatı:", base64data);
                        const newMessages = [...messages];

                        const predictResult = await predictMutation.mutateAsync({
                            isInputVoice: inputTypeVoiceStatus,
                            isOutputVoice: outputTypeVoiceStatus,
                            converstationId: converstationId,
                            lang: currentLanguage,
                            question: "deneme",
                            inputVoiceData: base64data,
                        });
                        // Ses verisini base64'ten alınan ses formatına göre ayarla (WAV)
                        const audioDataUrl = `data:audio/wav;base64,${predictResult?.data?.outputVoiceData}`;
                        const audioDataUrlUser = `data:audio/wav;base64,${predictResult?.data?.inputVoiceData}`;
                        newMessages.push({
                            type: "USER",
                            id: predictResult?.data?._id,
                            text: predictResult?.data?.question,
                            voice: audioDataUrlUser
                        });
                        newMessages.push({
                            type: "AI",
                            id: predictResult?.data?._id,
                            text: predictResult?.data?.answer,
                            voice: audioDataUrl,
                        });
                        setMessages(newMessages);
                        setIsMessageLoading(false);
                    };
                    reader.readAsDataURL(blob);
                }
            };
        }
    };

    useEffect(() => {
        console.log("kaydırma refine girdi");
        const messagesContainer = messagesContainerRef.current;

        if (messagesContainer) {
            // Yeni scroll yüksekliği, mevcut yükseklik + 100px
            //@ts-ignore
            const newScrollTop = messagesContainer.scrollTop + 100;

            // scrollTop özelliğini güncelle
            //@ts-ignore
            messagesContainer.scrollTop = newScrollTop;
        }
    }, [messages, isMessageLoading]);

    const addUnknowWord = useCallback(async (word: string, predictId: string) => {
        setIsLoadingWord(true)
        console.log(predictId, word, currentLanguage, converstationId, 'işlemi yapiliyor');
        const result = await wordMutation.mutateAsync({
            "word": word,
            "fromLang": "tr",
            "toLang": lang,
            "predictId": predictId,
            "converstationId": converstationId
        });
        console.log("result: " + result);
        notification.success({
            message: "Success",
            description: "Success Word Detected"
        })
        setIsLoadingWord(false)
    }, [converstationId, currentLanguage])

    return (
        <>
            <div className="flex flex-col">
                <div className={`${isActiveConverstation ? " hidden" : " "} border-dashed border-2 border-black`}>
                    <div className="text-4xl">Select Conversation To Language</div>
                    <div className="flex flex-row justify-around  items-center max-md:flex-col">
                        <div onClick={() => {
                            setCurrentLanguage("en")
                            setLang("tr")
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${currentLanguage === "en" ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>🇬🇧English</div>
                    </div>
                    <div className="text-4xl">Select Subject</div>
                    <div className="flex flex-wrap justify-around  items-center max-md:flex-col">
                        <div onClick={() => {
                            setCurrentSubject("tech")
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl   m-2 ${currentSubject === "tech" ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>🧑‍💻Tech</div>
                        <div onClick={() => {
                            setCurrentSubject("crypto")
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${currentSubject === "crypto" ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>🔐Crypto</div>
                        <div onClick={() => {
                            setCurrentSubject("ai")
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${currentSubject === "ai" ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>🤖AI</div>
                        <div onClick={() => {
                            setCurrentSubject("football")
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${currentSubject === "football" ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>🏟️Football</div>
                    </div>
                    <div className="text-4xl">Select Output Type</div>
                    <div className="flex flex-row max-md:flex-col justify-around">
                        <div onClick={() => {
                            setOutputTypeVoiceStatus(false)
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl   m-2 ${outputTypeVoiceStatus === false ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>Text</div>
                        <div onClick={() => {
                            setOutputTypeVoiceStatus(true)
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${outputTypeVoiceStatus === true ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>Voice</div>
                    </div>
                    <div className="text-4xl">Select Input Type</div>
                    <div className="flex flex-row max-md:flex-col justify-around">
                        <div onClick={() => {
                            setInputTypeVoiceStatus(false)
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl   m-2 ${inputTypeVoiceStatus === false ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>Text</div>
                        <div onClick={() => {
                            setInputTypeVoiceStatus(true)
                        }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${inputTypeVoiceStatus === true ? " bg-gray-300" : " hover:scale-110 cursor-pointer"}`}>Voice</div>
                    </div>
                    <button disabled={currentLanguage === undefined || currentSubject === undefined} onClick={() => {
                        createConverstation()
                    }} className={`border-2 p-2 border-dashed border-black rounded-lg text-3xl m-2 ${currentLanguage === undefined || currentSubject === undefined ? " bg-gray-300" : " cursor-pointer"}`}>Lets Talk</button>
                </div>
                <div>

                </div>
                <div className={`${isActiveConverstation ? " " : " hidden"}`}>
                    <div ref={messagesContainerRef} className={`bg-white h-[600px] max-md:h-[700px] overflow-y-auto mt-5 mb-2 flex flex-col rounded-lg ${messages?.length > 0 ? " border-solid border-black border-2" : " "}`}>
                        {
                            messages?.map((item, key) => {
                                const words = item?.text.split(' ');
                                console.log(words, 'burada')
                                return (
                                    <div className={`flex ${item?.type == "USER" ? " justify-end " : " justify-start "}`} key={key}>
                                        <div className={`m-4 w-fit p-2 text-sm rounded-lg ${item?.type == "USER" ? "  bg-gray-100" : "  bg-gray-200"}`}>
                                            <ReactMarkdown
                                                components={{
                                                    p(props) {
                                                        return (
                                                            <div>{
                                                                words?.map((word: string, index: number) => {
                                                                    return (
                                                                        <span key={index}>
                                                                            <Popover content={<div className="flex flex-col">
                                                                                <div className="text-2xl font-bold font-italic w-full text-center">{word}</div>
                                                                                <div onClick={() => {
                                                                                    addUnknowWord(word, item?.id)
                                                                                }} className="flex flex-col border-2 border-dashed border-black p-[2px] rounded-lg my-2 text-center cursor-pointer hover:scale-110">Unknow Words Add</div>
                                                                                {
                                                                                    isLoadingWord
                                                                                        ?
                                                                                        <Spin tip="Unknow Word Creating" size="large">
                                                                                            <div className="content" />
                                                                                        </Spin>
                                                                                        :
                                                                                        <></>
                                                                                }
                                                                            </div>}>
                                                                                {word} {" "}
                                                                            </Popover>
                                                                        </span>
                                                                    )
                                                                })
                                                            }</div>
                                                        )
                                                    }
                                                }}
                                                remarkPlugins={[remarkGfm]}>
                                                {item?.text}
                                            </ReactMarkdown>
                                            {item?.voice && outputTypeVoiceStatus && <audio className={`flex w-full ${item?.type == "USER" ? " justify-end " : " justify-start "}`} autoPlay={messages?.length === key + 1} controls src={item?.voice} />}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            isMessageLoading
                                ?
                                <>
                                    <Spin />
                                </>
                                :
                                <>
                                </>
                        }
                    </div>
                    <div className="flex flex-row items-center justify-center mt-2">
                        {
                            inputTypeVoiceStatus
                                ?
                                <button disabled={messages.length === 0 || isMessageLoading} className="justify-center items-center cursor-pointer hover:scale-110" onClick={isRecording ? stopRecording : startRecording}>
                                    {
                                        isRecording
                                            ?
                                            <Record color="red" />
                                            :
                                            <Microphone />
                                    }
                                </button>
                                :
                                <>
                                    <Input disabled={messages.length === 0 || isMessageLoading} value={text} onPressEnter={sendPredict} onChange={(e) => {
                                        console.log(e?.target?.value)
                                        setText(e?.target?.value)
                                    }} suffix={
                                        <div className="flex flex-row">
                                            <Send onClick={sendPredict} className="cursor-pointer" />
                                        </div>
                                    } />
                                </>
                        }

                    </div>
                </div>
                {
                    loading
                        ?
                        <>
                            <Spin tip="AI Creating" size="large">
                                <div className="content" />
                            </Spin>
                        </>
                        :
                        <></>
                }
            </div>
        </>
    )
}

export default HomePage