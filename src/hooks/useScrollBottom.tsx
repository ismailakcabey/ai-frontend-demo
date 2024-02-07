import { useEffect, useRef } from "react";

export const useScrollBottom = (messageStack: any) => {
    const bottomRef = useRef(null);
    useEffect(() => {
        const scrollToBottom = () => {
            // 👇️ scroll to bottom every time messages change
            //@ts-ignore
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        };

        scrollToBottom();
    }, [messageStack]);
    return bottomRef;
};
