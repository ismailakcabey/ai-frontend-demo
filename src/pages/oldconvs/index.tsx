import { Input, Popconfirm, Spin } from "antd"
import { CloseCircle, Data, Edit, SearchFavorite, SearchNormal, TickCircle, Trash } from "iconsax-react"
import { useCallback, useEffect, useState } from "react"
import { useConverstationFind, useDeleteConverstations, useUpdateConverstations } from "../../apis/services/converstation"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store"

const OldConverstation = () => {
    const [text, setText] = useState<string>("")
    const navigate = useNavigate()
    const [editText, setEditText] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const converstationMutation = useConverstationFind();
    const [currentData, setCurrentData] = useState<any>()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [skip, setSkip] = useState<number>(0)
    const [data, setData] = useState<any[]>([])
    const { user } = useAuthStore()
    const { mutateAsync: update } = useUpdateConverstations<any>(currentData?._id);
    const { mutateAsync: itemDelete } = useDeleteConverstations();
    const findData = useCallback(async () => {
        setIsLoading(true)
        console.log("user verisi burada", user)
        const result = await converstationMutation.mutateAsync({
            "where": {
                "name": {
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

    const updateData = useCallback(async () => {
        const params: any = {
            name: editText
        };
        const data = (await (update)(params).finally(() =>
            setIsLoading(false)
        ))
        console.log(data);
        setEditText("")
        setCurrentData(null)
        setIsEdit(false)
        setTimeout(() => {
            findData()
        }, 900)
    }, [editText])

    const deleteData = useCallback(async (id: string) => {
        console.log(id, "burada")
        await itemDelete(id)
        setCurrentData(null)
        setTimeout(() => {
            findData()
        }, 900)
    }, [currentData])

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <Input placeholder="type converstation name" value={text} onPressEnter={findData} onChange={(e) => {
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
                                <div key={key} className="p-2 text-xl border-dashed border-2 border-black m-2 flex flex-row justify-center items-center">
                                    <div className={`cursor-pointer ${isEdit && currentData?._id === item?._id ? " hidden" : " "}`} onClick={() => {
                                        navigate("/converstation/" + item._id)
                                    }}>{item?.name}</div>
                                    <Input
                                        className={`${isEdit && currentData?._id === item?._id ? " " : " hidden"}`}
                                        placeholder="type converstation name"
                                        value={editText === "" && currentData?._id === item?._id ? item?.name : editText}
                                        onChange={(e) => {
                                            setEditText(e.target.value)
                                        }}
                                        onPressEnter={updateData}
                                    />
                                    <div onClick={() => {
                                        setIsEdit(true)
                                        setCurrentData(item)
                                    }} className={`mx-2 cursor-pointer ${isEdit && currentData?._id === item?._id ? " hidden" : " "}`}><Edit /></div>
                                    <div onClick={() => {
                                        setIsEdit(false)
                                        setCurrentData(null)
                                    }} className={`mx-2 cursor-pointer ${isEdit && currentData?._id === item?._id ? " " : " hidden"}`}><CloseCircle /></div>
                                    <Popconfirm
                                        title="Delete the task"
                                        description="Are you sure to delete this task?"
                                        onConfirm={() => {
                                            deleteData(item?._id)
                                        }}
                                        onCancel={() => {

                                        }}
                                    >
                                        <div className={`mx-2 cursor-pointer ${isEdit && currentData?._id === item?._id ? " hidden" : " "}`}><Trash /></div>
                                    </Popconfirm>
                                    <div onClick={updateData} className={`mx-2 cursor-pointer ${isEdit && currentData?._id === item?._id ? " " : " hidden"}`}><TickCircle /></div>
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

export default OldConverstation