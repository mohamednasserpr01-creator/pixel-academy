// FILE: features/teacherExams/components/QuestionCard.tsx
import React, { memo } from 'react';
import { FaTrash, FaImage } from 'react-icons/fa';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Question } from '../types';
import { useToast } from '../../../context/ToastContext';

interface Props { q: Question; index: number; dispatch: React.Dispatch<any>; }

export const QuestionCard = memo(({ q, index, dispatch }: Props) => {
    const { showToast } = useToast();
    const updateQ = (field: keyof Question, value: any) => dispatch({ type: 'UPDATE_QUESTION', payload: { id: q.id, field, value } });

    const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            callback(URL.createObjectURL(file));
            showToast('تم إرفاق الصورة بنجاح', 'success');
        }
        e.target.value = ''; 
    };

    return (
        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', padding: '25px', marginBottom: '25px', position: 'relative' }}>
            <button onClick={() => dispatch({ type: 'DELETE_QUESTION', payload: q.id })} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', zIndex: 10 }}><FaTrash /></button>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ background: 'var(--p-purple)', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>سؤال {index + 1}</span>
                <h4 style={{ color: 'var(--txt)', margin: 0 }}>{q.type === 'mcq' ? 'اختياري' : q.type === 'tf' ? 'صح وخطأ' : 'مقالي'}</h4>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 3, minWidth: '200px' }}><Input label="نص السؤال" value={q.text} onChange={e => updateQ('text', e.target.value)} /></div>
                <div style={{ flex: 1, minWidth: '100px' }}><Input label="الدرجة" type="number" value={q.score.toString()} onChange={e => updateQ('score', Number(e.target.value))} /></div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                {!q.previewUrl ? (
                    <label style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--p-purple)', border: '1px dashed rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                        <FaImage size={20} /> إرفاق صورة للسؤال
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageUpload(e, (url) => updateQ('previewUrl', url))} />
                    </label>
                ) : (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '10px', overflow: 'hidden' }}>
                        <img src={q.previewUrl} alt="Q" style={{ width: '100%' }} />
                        <button onClick={() => { URL.revokeObjectURL(q.previewUrl!); updateQ('previewUrl', null); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                )}
            </div>

            {q.type === 'mcq' && (
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '10px' }}>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '15px', fontWeight: 'bold' }}>الاختيارات</label>
                    {q.options?.map((opt, optIdx) => (
                        <div key={opt.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                            <input type="radio" checked={opt.isCorrect} onChange={() => { const newOptions = q.options!.map(o => ({ ...o, isCorrect: o.id === opt.id })); updateQ('options', newOptions); }} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} />
                            <div style={{ flex: 1 }}><input type="text" value={opt.text} onChange={(e) => { const newOptions = [...q.options!]; newOptions[optIdx].text = e.target.value; updateQ('options', newOptions); }} placeholder={`الاختيار ${optIdx + 1}`} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} /></div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => updateQ('options', [...q.options!, { id: Date.now().toString(), text: '', image: null, previewUrl: null, isCorrect: false }])}>+ إضافة اختيار</Button>
                </div>
            )}
        </div>
    );
});