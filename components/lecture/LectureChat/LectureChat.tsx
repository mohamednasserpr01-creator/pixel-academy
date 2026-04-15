// FILE: components/lecture/LectureChat/LectureChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaEllipsisV, FaRobot, FaUserTie, FaPaperPlane } from 'react-icons/fa';

export default function LectureChat({ lang }: { lang: string }) {
    const [chatMsgs, setChatMsgs] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [showInitialOpts, setShowInitialOpts] = useState(true);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const generateId = () => Date.now() + Math.random();

    useEffect(() => {
        setChatMsgs([{ id: generateId(), sender: 'bot', text: lang === 'ar' ? 'أهلاً بك يا بطل! كيف تفضل المساعدة اليوم؟' : 'Hello! How can I help you today?' }]);
    }, [lang]);

    useEffect(() => { if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; }, [chatMsgs]);

    const handleChatOption = (type: 'ai'|'human') => {
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: type === 'ai' ? (lang === 'ar' ? 'أريد التحدث مع المساعد الذكي' : 'I want AI Assistant') : (lang === 'ar' ? 'أريد التحدث مع مدرس حقيقي' : 'I want human teacher') }]);
        setTimeout(() => {
            setChatMsgs(prev => [...prev, { id: generateId(), sender: 'bot', text: type === 'human' ? (lang === 'ar' ? 'تواصل مع الدعم عبر الواتساب.' : 'Contact support via WhatsApp.') : (lang === 'ar' ? 'أنا بيكسل AI! تفضل بسؤالك.' : 'I am Pixel AI! Ask your question.') }]);
        }, 600);
    };

    const sendChat = () => {
        if(!chatInput.trim()) return;
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: chatInput }]);
        setChatInput("");
        
        const botMsgId = generateId();
        setTimeout(() => { 
            setChatMsgs(prev => [...prev, { id: botMsgId, sender: 'bot', text: lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...' }]); 
            setTimeout(() => {
                setChatMsgs(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: lang === 'ar' ? 'إجابة سؤالك موجودة في الدقيقة 12:00 من الفيديو.' : 'The answer is at 12:00 in the video.' } : msg));
            }, 1500);
        }, 600);
    };

    return (
        <div className="chat-section">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaComments /> {lang === 'ar' ? 'مركز المساعدة الذكي' : 'Smart Help Center'}</div>
                <FaEllipsisV style={{ cursor: 'pointer' }} />
            </div>
            <div id="chat-msgs" ref={chatBoxRef}>
                {chatMsgs.map((msg) => (
                    <div key={msg.id} className={`msg ${msg.sender}`}>
                        {msg.text}
                        {msg.id === chatMsgs[0]?.id && showInitialOpts && (
                            <div className="chat-options">
                                <button className="chat-opt-btn" onClick={() => handleChatOption('ai')}><FaRobot /> {lang==='ar'?'مساعد ذكي (AI)':'AI Assistant'}</button>
                                <button className="chat-opt-btn" onClick={() => handleChatOption('human')}><FaUserTie /> {lang==='ar'?'مدرس حقيقي':'Human Teacher'}</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChat()} placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'} />
                <button onClick={sendChat}><FaPaperPlane /></button>
            </div>
        </div>
    );
}