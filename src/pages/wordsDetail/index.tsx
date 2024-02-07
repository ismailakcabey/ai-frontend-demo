import { useParams } from "react-router-dom"
import { useWordsFindById } from "../../apis/services/words"
import { Spin } from "antd"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const WordsDetail = () => {
    const { id } = useParams()
    const { data, isLoading } = useWordsFindById(id!)
    if (isLoading) return <Spin />
    return (
        <>
            <div className={`border-2 border-solid border-black rounded-lg`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {
                        //@ts-ignore
                        data?.data?.answer}
                </ReactMarkdown>
            </div>
        </>
    )
}

export default WordsDetail