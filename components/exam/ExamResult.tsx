// FILE: components/exam/ExamResult.tsx
import React from 'react';
import { FaEye, FaPlayCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Props {
    lang: string;
    scorePercentage: number;
    onReview: () => void;
}

export default function ExamResult({ lang, scorePercentage, onReview }: Props) {
    const router = useRouter();
    const isSuccess = scorePercentage >= 50;

    return (
        <div className="result-card" style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: 'var(--txt)', marginBottom: '30px' }}>{lang === 'ar' ? 'نتيجة الامتحان' : 'Exam Result'}</h2>
            
            <div className="score-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', background: isSuccess ? 'linear-gradient(45deg, var(--success), #2ecc71)' : 'linear-gradient(45deg, var(--danger), #e74c3c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, margin: '0 auto 30px', boxShadow: isSuccess ? '0 10px 30px rgba(46, 204, 113, 0.4)' : '0 10px 30px rgba(231, 76, 60, 0.4)' }}>
                {scorePercentage}%
            </div>
            
            <h3 style={{ color: isSuccess ? 'var(--success)' : 'var(--danger)', marginBottom: '40px', fontWeight: 900, fontSize: '1.5rem' }}>
                {isSuccess 
                    ? (lang === 'ar' ? 'لقد اجتزت الامتحان بنجاح 🎉' : 'You passed the exam successfully 🎉')
                    : (lang === 'ar' ? 'للأسف لم تجتز الامتحان، راجع إجاباتك 😔' : 'Unfortunately, you failed the exam 😔')}
            </h3>
            
            <div className="action-buttons-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-nav-exam glow-btn" onClick={onReview} style={{ padding: '12px 25px', borderRadius: '50px', background: 'var(--p-purple)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <FaEye /> {lang === 'ar' ? 'عرض الإجابات' : 'Review Answers'}
                </button>
                <button className="btn-continue glow-btn" onClick={() => router.back()} style={{ padding: '12px 25px', borderRadius: '50px', background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <FaPlayCircle /> {lang === 'ar' ? 'العودة للمحاضرة' : 'Back to Lecture'}
                </button>
            </div>
        </div>
    );
}