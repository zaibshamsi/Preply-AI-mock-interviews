'use client'

import Image from "next/image";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { Vapi } from '@/lib/vapi.sdk';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: 'user'| 'system'| 'assistant';
    content: string;
}
const  Agent = ({userName, userId, type}:AgentProps) => {
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript}

                setMessages((prev) => [...prev, newMessage]);
            }
        }
        const onSpeachStart = () => setIsSpeaking(true);
        const onSpeachEnd = () => setIsSpeaking(false);

        const onError = (error:Error) => console.log('Error', error)

        Vapi.on('call-start', onCallStart);
        Vapi.on('call-end', onCallEnd);
        Vapi.on('message', onMessage);
        Vapi.on('speech-start', onSpeachStart);
        Vapi.on('speech-end', onSpeachEnd);
        Vapi.on('error', onError);

        return () => {
            Vapi.off('call-start', onCallStart);
            Vapi.off('call-end', onCallEnd);
            Vapi.off('message', onMessage);
            Vapi.off('speech-start', onSpeachStart);
            Vapi.off('speech-end', onSpeachEnd);
            Vapi.off('error', onError);
        }

    }, [])

    useEffect(() => {
        if(callStatus === CallStatus.FINISHED) router.push('/');

    },[messages, callStatus, type, userId])

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        await Vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
            variableValues: {
                username: userName,
                userid: userId,
            }
        })
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);

        Vapi.stop();
    }

    const latestMessage = messages[messages.length -1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus ===
    CallStatus.FINISHED;

    const lastMessage = messages[messages.length - 1];
    return (
        <>
        <div className="call-view">
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover"/>
                    {isSpeaking && <span className="animate-speak"/>}
                </div>
                <h3>AI Interviewer</h3>
            </div>

            <div className="card-border">
                <div className="card-content">
                    <Image src="/user-avatar.png" alt="user avatar"
                           width={540} height={540} className="rounded-full object-cover size-[120px]"/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={latestMessage} className={cn(
                            'transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100'
                        )}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call" onClick={handleCall}>
                                <span
                                  className={cn(
                                        "absolute animate-ping rounded-full opacity-75",
                                        callStatus !== "CONNECTING" && "hidden"
                                    )}
                                />
                                <span className="relative">
                                    {isCallInactiveOrFinished
                                        ? "Call"
                                        : ". . ."}
                                </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export  default Agent;