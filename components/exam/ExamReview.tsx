// FILE: components/exam/ExamReview.tsx
import React from 'react';
import { FaClipboardCheck, FaArrowRight } from 'react-icons/fa';
import { Exam } from '../../types';

interface Props {
    exam: Exam;
    lang: string;
    answers: Record<number, any>;
    onBackToResult: () => void;
}

export default function ExamReview({ exam, lang, answers, onBackToResult }: Props) {
    return (
        <div>
            <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid var(--h-bg)' }}>
                <h2 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaClipboardCheck /> {lang === 'ar' ? 'مراجعة الإجابات' : 'Review Answers'}</h2>
                <button className="btn-continue" onClick={onBackToResult} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontWeight: 'bold' }}>
                    <FaArrowRight style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /> 
                    {lang === 'ar' ? 'العودة للنتيجة' : 'Back'}
                </button>
            </div>

            {exam.questions.map((q, i) => {
                const isCorrect = q.type === 'mcq' ? answers[q.id] === q.correctAns : null; 
                
                return (
                    <div key={q.id} className="review-box" style={{ background: 'var(--bg)', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: `1px solid ${q.type === 'mcq' ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--warning)'}` }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--txt)', lineHeight: '1.5' }}>
                            <span style={{ color: 'var(--p-purple)', marginRight: lang==='ar'?'0':'10px', marginLeft: lang==='ar'?'10px':'0' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}:</span> 
                            {lang === 'ar' ? q.textAr : q.textEn}
                        </h3>
                        
                        <div style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '10px' }}>
                            {q.type === 'mcq' && (
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '50px', background: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        {isCorrect ? (lang === 'ar' ? 'إجابتك صحيحة' : 'Correct') : (lang === 'ar' ? 'إجابة خاطئة' : 'Wrong')}
                                    </span>
                                </div>
                            )}
                            
                            <div style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> <br/>
                                <span style={{ display: 'inline-block', marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                                    {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr?.[answers[q.id]] : q.optionsEn?.[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                </span>
                            </div>
                            
                            <div style={{ color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--success)' }}>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> <br/>
                                <span style={{ display: 'inline-block', marginTop: '5px' }}>
                                    {lang === 'ar' ? q.explanationAr : q.explanationEn}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}