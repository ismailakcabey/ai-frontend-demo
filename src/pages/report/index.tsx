import { useCallback, useEffect, useState } from "react"
import { useReportGet } from "../../apis/services/report"
import { Spin } from "antd"
import { Bar } from '@ant-design/plots';
import { Column, Line, Pie } from "@ant-design/charts";
const ReportPage = () => {
    const reportMutation = useReportGet()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>()
    const [converstations, setConverstations] = useState<any>([])
    const [predicts, setPredicts] = useState<any>([])
    const [words, setWords] = useState<any>([])
    const findData = useCallback(async () => {
        setIsLoading(true)
        // Varsayılan olarak son 1 haftaya ait tarih aralığı
        const toDate = new Date(); // Şu anki tarih ve saat
        const fromDate = new Date(toDate);
        fromDate.setDate(toDate.getDate() - 30);

        const result = await reportMutation.mutateAsync({
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString(),
        });
        console.log(result);
        setData(result?.data)
        let converstationArray: any = []
        result?.data?.converstation_data?.map((item: any, key: number) => {
            const date = new Date(item?.createdAt);
            converstationArray.push({
                name: key,
                date: `${date.getHours() + 1}:${date.getDate() + 1}-${date.getMonth() + 1}-${date.getFullYear()}`
            })
        })
        let predictArray: any = []
        result?.data?.predict_data?.map((item: any, key: number) => {
            const date = new Date(item?.createdAt);
            predictArray.push({
                answer: key,
                date: `${date.getHours() + 1}:${date.getDate() + 1}-${date.getMonth() + 1}-${date.getFullYear()}`
            })
        })
        let learnedData = 0
        let unLearnedData = 0
        let wordArray: any = []
        result?.data?.word_data?.map((item: any, key: number) => {
            if (item?.isLearned) learnedData += 1
            else unLearnedData += 1
        })
        wordArray.push({
            type: "Learned",
            value: learnedData
        })
        wordArray.push({
            type: "UnLearned",
            value: unLearnedData
        })
        setWords(wordArray)
        setConverstations(converstationArray)
        setPredicts(predictArray)
        console.log(predictArray)
        console.log(converstationArray)
        console.log(wordArray)
        setIsLoading(false)
    }, [])
    useEffect(() => {
        findData()
    }, [findData])
    const configConverstation = {
        data: converstations,
        xField: 'date',
        yField: 'name',
        xAxis: {
            label: {
                autoRotate: false,
            },
        },
        slider: {
            start: 0.1,
            end: 0.9,
        },
    };
    const configPredicts = {
        data: predicts,
        padding: 'auto',
        xField: 'date',
        yField: 'answer',
        yAxis: false,
    };
    const configWord = {
        appendPadding: 10,
        data: words,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: 'Words Content',
            },
        },
    };
    if (isLoading) return <Spin />
    return (
        <>
            <div>
                <div className="text-3xl text-center">Report Page</div>
                <div className="flex flex-col border-2 border-dashed border-black rounded-lg">
                    <div className="flex flex-col">
                        <div className="text-2xl text-center">Converstation Report</div>
                        <div>
                            <Column {...configConverstation} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-2xl text-center">Predict Report</div>
                        <div>
                            <Line {...configPredicts} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-2xl text-center">Word Report</div>
                        <div>
                            <Pie {...configWord} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportPage