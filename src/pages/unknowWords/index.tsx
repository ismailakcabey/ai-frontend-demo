import { Input, Popconfirm, Spin } from "antd"
import { CloseCircle, Data, Edit, SearchFavorite, SearchNormal, TickCircle, Trash } from "iconsax-react"
import { useCallback, useEffect, useState } from "react"
import { useConverstationFind } from "../../apis/services/converstation"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store"
import { useUpdateWords, useWordsFind } from "../../apis/services/words"

const UnknowWords = () => {
    const [text, setText] = useState<string>("")
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const wordsMutation = useWordsFind();
    const [currentData, setCurrentData] = useState<any>()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [skip, setSkip] = useState<number>(0)
    const [data, setData] = useState<any[]>([])
    const { user } = useAuthStore()
    const { mutateAsync: update } = useUpdateWords<any>(currentData?._id);
    // const { mutateAsync: itemDelete } = useDeleteWords();
    const findData = useCallback(async () => {
        setIsLoading(true)
        console.log("user verisi burada", user)
        const result = await wordsMutation.mutateAsync({
            "where": {
                "word": {
                    "$regex": text,
                },
                "userId": user?._id
            },
            "sort": [["createdAt", -1]],
            "limit": 20,
            "skip": skip
        });
        console.log([...data, result?.data], 'burada', skip, 'verisi burada')
        setData([...data, ...result?.data])
        setIsLoading(false)
    }, [skip, text])


    useEffect(() => {
        findData()
    }, [findData])

    const handleScroll = (e: any) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight === scrollHeight) {
            // En altına ulaşıldığında yapılacak işlemler
            setSkip((prevSkip) => prevSkip + 20);
        }
    };

    const updateData = useCallback(async (value: any) => {
        const params: any = {
            isLearned: value
        };
        const data = (await (update)(params).finally(() =>
            setIsLoading(false)
        ))
        console.log(data);
        setCurrentData(null)
        setIsEdit(false)
        setTimeout(() => {
            findData()
        }, 900)
    }, [])

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <Input placeholder="type word name" value={text} onPressEnter={findData} onChange={(e) => {
                    console.log(e?.target?.value)
                    setData([])
                    setSkip(0)
                    setText(e?.target?.value)
                }} suffix={
                    <div className="flex flex-row">
                        <SearchNormal onClick={findData} className="cursor-pointer" />
                    </div>
                } />
                <div onScroll={handleScroll} className={`grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 border-2 border-solid border-black m-2 p-2 rounded-lg h-[500px] max-md:h-[600px] overflow-y-auto ${data.length === 0 ? " hidden" : " "}`}>
                    {
                        data?.map((item, key) => {
                            return (
                                <div key={key} className={`p-2 text-xl border-dashed border-2 ${item?.isLearned ? "border-green-400" : "border-red-400"} m-2 flex flex-row justify-center items-center`}>
                                    <div className={`cursor-pointer`} onClick={() => {
                                        navigate("/word/" + item._id)
                                    }}>{item?.word}</div>
                                    <Popconfirm
                                        title="Update the task"
                                        description="Are you sure to update this task?"
                                        onConfirm={() => {
                                            updateData(true)
                                        }}
                                        onCancel={() => {
                                        }}
                                    >
                                        <div onClick={() => {
                                            setCurrentData(item)
                                        }} className={`mx-2 cursor-pointer`}><TickCircle /></div>
                                    </Popconfirm>
                                    <Popconfirm
                                        title="Update the task"
                                        description="Are you sure to update this task?"
                                        onConfirm={() => {
                                            updateData(false)
                                        }}
                                        onCancel={() => {

                                        }}
                                    >
                                        <div onClick={() => {
                                            setCurrentData(item)
                                        }} className={`mx-2 cursor-pointer`}><CloseCircle /></div>
                                    </Popconfirm>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={`flex m-5 flex-col justify-center items-center ${data?.length === 0 ? " " : " hidden"}`}>
                    <Data />
                    <div className="text-3xl text-gray-500">Not Found Data</div>
                </div>
            </div>
        </>
    )
}

export default UnknowWords