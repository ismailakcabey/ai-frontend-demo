import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { usePredictFind } from "../../apis/services/predict";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ConverstationHistory = () => {
    const { id } = useParams()
    const predictMutation = usePredictFind();
    const [data, setData] = useState<any>()
    const [messages, setMessages] = useState<any[]>([])
    const findData = useCallback(async () => {
        const result = await predictMutation.mutateAsync({
            where: {
                "converstationId": id
            },
            include: ["converstationId"]
        })
        console.log(result);
        setData(result?.data)
        console.log(result.data)
        const newMessages = messages
        result?.data?.map((item: any, key: number) => {
            if (key === 0 || key === 1) {

            }
            else {
                let audioDataUrl
                if (item?.outputVoiceData) {
                    audioDataUrl = `data:audio/wav;base64,${item?.outputVoiceData}`;
                }
                newMessages.push({
                    text: item?.answer,
                    type: "AI",
                    voice: audioDataUrl
                })
                let audioDataUrlInput
                if (item?.inputVoiceData) {
                    audioDataUrlInput = `data:audio/wav;base64,${item?.inputVoiceData}`;
                }
                newMessages.push({
                    type: "USER",
                    text: item?.question,
                    voice: audioDataUrlInput
                })
            }
        })
        setMessages(newMessages)
    }, [])
    useEffect(() => {
        findData()
    }, [findData])
    return (
        <>
            <div className="flex flex-col">
                <div className="text-3xl">Converstation Name: {data?.[0]?.converstation?.name}</div>
                <div className={`bg-white w-full h-[600px] max-md:h-[700px] overflow-y-auto mt-5 mb-2 flex flex-col rounded-lg ${messages?.length > 0 ? " border-solid border-black border-2" : " "}`}>
                    {
                        messages?.map((item, key) => {
                            return (
                                <div className={`flex ${item?.type == "USER" ? " justify-end " : " justify-start "} `} key={key}>
                                    <div className={`m-4 w-fit p-2 text-sm rounded-lg ${item?.type == "USER" ? "  bg-gray-100" : "  bg-gray-200"}`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {item?.text}
                                        </ReactMarkdown>
                                        {item?.voice && <audio className={`flex w-full ${item?.type == "USER" ? " justify-end " : " justify-start "}`} controls src={item?.voice} />}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ConverstationHistory