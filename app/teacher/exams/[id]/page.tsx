// FILE: app/teacher/exams/[id]/page.tsx
"use client";
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaListOl, FaPlus, FaTrash, FaSave, FaImage } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../context/ToastContext';

type QuestionType = 'mcq' | 'tf' | 'essay';
type EssayFormat = 'text' | 'image' | 'both';

interface Option {
    id: number;
    text: string;
    image: string | null;
    isCorrect: boolean;
}

interface Question {
    id: number;
    type: QuestionType;
    text: string;
    image: string | null;
    score: number;
    options?: Option[]; 
    isTrueFalseCorrect?: boolean; 
    essayFormat?: EssayFormat; 
}

export default function ExamBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('questions');
    const [examTitle, setExamTitle] = useState('امتحان الباب الأول');

    const [questions, setQuestions] = useState<Question[]>([
        { 
            id: 1, type: 'mcq', text: 'ما هي وحدة قياس القوة؟', image: null, score: 2, 
            options: [
                { id: 11, text: 'نيوتن', image: null, isCorrect: true },
                { id: 12, text: 'جول', image: null, isCorrect: false }
            ] 
        }
    ]);

    const handleAddQuestion = (type: QuestionType) => {
        const newQ: Question = { id: Date.now(), type, text: '', image: null, score: 1 };
        if (type === 'mcq') newQ.options = [{ id: Date.now() + 1, text: '', image: null, isCorrect: true }, { id: Date.now() + 2, text: '', image: null, isCorrect: false }];
        if (type === 'tf') newQ.isTrueFalseCorrect = true;
        if (type === 'essay') newQ.essayFormat = 'both';
        setQuestions([...questions, newQ]);
    };

    const updateQuestion = (id: number, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    // 💡 دالة جديدة لرفع الصور من الجهاز وعرضها فوراً (Local Preview)
    const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            // بنعمل لينك محلي مؤقت للصورة عشان نعرضها قبل ما تترفع فعلياً للسيرفر
            const previewUrl = URL.createObjectURL(file);
            callback(previewUrl);
            showToast('تم إرفاق الصورة بنجاح', 'success');
        }
        // تصفير الـ input عشان لو حب يرفع نفس الصورة تاني يشتغل
        e.target.value = ''; 
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/exams')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>
                    مُنشئ الامتحانات: <span style={{ color: 'var(--p-purple)' }}>{examTitle}</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الامتحان</button>
                    <button onClick={() => setActiveTab('questions')} style={getTabStyle(activeTab === 'questions')}><FaListOl /> بناء الأسئلة</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h2 style={{ color: 'var(--txt)', marginBottom: '20px' }}>الإعدادات العامة</h2>
                            <Input label="اسم الامتحان" value={examTitle} onChange={e => setExamTitle(e.target.value)} />
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم الحفظ', 'success')} style={{ marginTop: '20px' }}>حفظ الإعدادات</Button>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>أسئلة الامتحان</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => handleAddQuestion('mcq')}>اختيار من متعدد</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => handleAddQuestion('tf')}>صح وخطأ</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => handleAddQuestion('essay')}>سؤال مقالي</Button>
                                </div>
                            </div>

                            {questions.map((q, qIndex) => (
                                <div key={q.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', padding: '25px', marginBottom: '25px', position: 'relative' }}>
                                    <button onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', zIndex: 10 }}><FaTrash /></button>
                                    
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                                        <span style={{ background: 'var(--p-purple)', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>سؤال {qIndex + 1}</span>
                                        <h4 style={{ color: 'var(--txt)', margin: 0 }}>
                                            {q.type === 'mcq' ? 'اختيار من متعدد' : q.type === 'tf' ? 'صح وخطأ' : 'سؤال مقالي'}
                                        </h4>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div style={{ flex: 3 }}>
                                            <Input label="نص السؤال (يمكنك تركه فارغاً إذا قمت بإرفاق صورة)" value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Input label="الدرجة" type="number" value={q.score.toString()} onChange={e => updateQuestion(q.id, 'score', Number(e.target.value))} />
                                        </div>
                                    </div>
                                    
                                    {/* 🖼️ رفع ومعاينة صورة السؤال */}
                                    <div style={{ marginBottom: '20px' }}>
                                        {!q.image ? (
                                            <label style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--p-purple)', border: '1px dashed rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', transition: '0.3s' }}>
                                                <FaImage size={20} /> إرفاق صورة لتكون هي السؤال
                                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageUpload(e, (url) => updateQuestion(q.id, 'image', url))} />
                                            </label>
                                        ) : (
                                            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
                                                <img src={q.image} alt="Question" style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                                                <button onClick={() => updateQuestion(q.id, 'image', null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(231,76,60,0.9)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <FaTrash size={12} /> حذف الصورة
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 💡 الاختيار من متعدد */}
                                    {q.type === 'mcq' && (
                                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '15px', fontWeight: 'bold' }}>الاختيارات (حدد الإجابة الصحيحة)</label>
                                            {q.options?.map((opt, optIdx) => (
                                                <div key={opt.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                                                    <input 
                                                        type="radio" 
                                                        name={`correct_${q.id}`} 
                                                        checked={opt.isCorrect} 
                                                        onChange={() => {
                                                            const newOptions = q.options!.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                                                            updateQuestion(q.id, 'options', newOptions);
                                                        }}
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--p-purple)' }}
                                                    />
                                                    
                                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                                        <input 
                                                            type="text" 
                                                            value={opt.text} 
                                                            onChange={(e) => {
                                                                const newOptions = [...q.options!];
                                                                newOptions[optIdx].text = e.target.value;
                                                                updateQuestion(q.id, 'options', newOptions);
                                                            }} 
                                                            placeholder={`الاختيار ${optIdx + 1} (يمكن تركه لو أضفت صورة)`} 
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} 
                                                        />
                                                    </div>

                                                    {/* 🖼️ رفع ومعاينة صورة الاختيار */}
                                                    {!opt.image ? (
                                                        <label style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--p-purple)', border: '1px dashed rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', cursor: 'pointer', height: '42px', display: 'flex', alignItems: 'center' }} title="إرفاق صورة للاختيار">
                                                            <FaImage size={18} />
                                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageUpload(e, (url) => {
                                                                const newOptions = [...q.options!];
                                                                newOptions[optIdx].image = url;
                                                                updateQuestion(q.id, 'options', newOptions);
                                                            })} />
                                                        </label>
                                                    ) : (
                                                        <div style={{ position: 'relative', width: '80px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                            <img src={opt.image} alt={`Option ${optIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            <button onClick={() => {
                                                                const newOptions = [...q.options!];
                                                                newOptions[optIdx].image = null;
                                                                updateQuestion(q.id, 'options', newOptions);
                                                            }} style={{ position: 'absolute', top: '0', right: '0', background: 'rgba(231,76,60,0.9)', color: 'white', border: 'none', width: '100%', height: '100%', cursor: 'pointer', opacity: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'} title="حذف الصورة">
                                                                <FaTrash size={12} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {q.options!.length > 2 && (
                                                        <button onClick={() => updateQuestion(q.id, 'options', q.options!.filter(o => o.id !== opt.id))} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => updateQuestion(q.id, 'options', [...q.options!, { id: Date.now(), text: '', image: null, isCorrect: false }])} style={{ marginTop: '10px' }}>+ إضافة اختيار</Button>
                                        </div>
                                    )}

                                    {/* 💡 صح وخطأ */}
                                    {q.type === 'tf' && (
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '10px' }}>
                                            <label style={{ color: 'var(--txt-mut)', fontWeight: 'bold' }}>الإجابة الصحيحة:</label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                                                <input type="radio" checked={q.isTrueFalseCorrect === true} onChange={() => updateQuestion(q.id, 'isTrueFalseCorrect', true)} style={{ accentColor: '#2ecc71', width: '18px', height: '18px' }} /> صح
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                                                <input type="radio" checked={q.isTrueFalseCorrect === false} onChange={() => updateQuestion(q.id, 'isTrueFalseCorrect', false)} style={{ accentColor: '#e74c3c', width: '18px', height: '18px' }} /> خطأ
                                            </label>
                                        </div>
                                    )}

                                    {/* 💡 السؤال المقالي */}
                                    {q.type === 'essay' && (
                                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '10px' }}>
                                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}>كيف يجيب الطالب على هذا السؤال؟</label>
                                            <select 
                                                value={q.essayFormat} 
                                                onChange={(e) => updateQuestion(q.id, 'essayFormat', e.target.value)}
                                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}
                                            >
                                                <option value="both" style={{background: '#1e1e2d'}}>كتابة نص + إرفاق صورة (موصى به)</option>
                                                <option value="text" style={{background: '#1e1e2d'}}>كتابة نص فقط</option>
                                                <option value="image" style={{background: '#1e1e2d'}}>إرفاق صورة للحل فقط (بدون كتابة)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ الأسئلة بنجاح!', 'success')} style={{ width: '100%', padding: '15px' }}>حفظ التعديلات والأسئلة</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', 
    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent', color: isActive ? 'var(--p-purple)' : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? '4px solid var(--p-purple)' : '4px solid transparent'
});