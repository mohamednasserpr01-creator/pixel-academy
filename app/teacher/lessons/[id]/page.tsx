// FILE: app/teacher/lessons/[id]/page.tsx
"use client";
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaVideo, FaFilePdf, FaLink, FaCog, FaPlus, FaTrash, FaSave, FaEye } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../context/ToastContext';

const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return url; 
};

export default function LessonDetailsManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'videos' | 'files' | 'references'>('videos');
    const [lessonTitle, setLessonTitle] = useState('الحصة الأولى: أساسيات المنهج');
    
    const [videos, setVideos] = useState([{ id: 1, title: '', url: '', order: 1 }]);
    const [files, setFiles] = useState([{ id: 1, title: '', fileName: '', isCompressing: false }]);
    const [references, setReferences] = useState([{ id: 1, title: '', url: '' }]);

    const handleAddVideo = () => setVideos([...videos, { id: Date.now(), title: '', url: '', order: videos.length + 1 }]);
    const handleRemoveVideo = (id: number) => setVideos(videos.filter(v => v.id !== id));

    const handleAddFile = () => setFiles([...files, { id: Date.now(), title: '', fileName: '', isCompressing: false }]);
    const handleRemoveFile = (id: number) => setFiles(files.filter(f => f.id !== id));

    const handleAddReference = () => setReferences([...references, { id: Date.now(), title: '', url: '' }]);
    const handleRemoveReference = (id: number) => setReferences(references.filter(r => r.id !== id));

    const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFiles = [...files];
            newFiles[index].fileName = file.name;
            newFiles[index].isCompressing = true;
            setFiles(newFiles);
            setTimeout(() => {
                const updatedFiles = [...files];
                updatedFiles[index].isCompressing = false;
                setFiles(updatedFiles);
                showToast(`تم ضغط ورفع ملف ${file.name} بنجاح!`, 'success');
            }, 2000);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/lessons')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>
                    محتوى الحصة: <span style={{ color: 'var(--p-purple)' }}>{lessonTitle}</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الحصة</button>
                    <button onClick={() => setActiveTab('videos')} style={getTabStyle(activeTab === 'videos')}><FaVideo /> الفيديوهات (Preview)</button>
                    <button onClick={() => setActiveTab('files')} style={getTabStyle(activeTab === 'files')}><FaFilePdf /> مذكرات الـ PDF</button>
                    <button onClick={() => setActiveTab('references')} style={getTabStyle(activeTab === 'references')}><FaLink /> المراجع والروابط</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    {activeTab === 'videos' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>إضافة فيديوهات للحصة</h2>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={handleAddVideo}>فيديو جديد</Button>
                            </div>

                            {videos.map((vid, idx) => {
                                const embedUrl = getEmbedUrl(vid.url);
                                return (
                                    <div key={vid.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '15px' }}>
                                            <div style={{ flex: '1 1 200px' }}><Input label="اسم الفيديو" value={vid.title} onChange={e => { const n = [...videos]; n[idx].title = e.target.value; setVideos(n); }} placeholder="مثال: الشرح الأساسي" /></div>
                                            <div style={{ flex: '2 1 300px' }}><Input label="لينك الفيديو (يوتيوب/فيميو/باني)" value={vid.url} onChange={e => { const n = [...videos]; n[idx].url = e.target.value; setVideos(n); }} placeholder="https://..." dir="ltr" /></div>
                                            <div style={{ width: '80px' }}><Input label="الترتيب" type="number" value={vid.order.toString()} onChange={e => { const n = [...videos]; n[idx].order = Number(e.target.value); setVideos(n); }} /></div>
                                            <button onClick={() => handleRemoveVideo(vid.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', height: '48px', width: '48px', borderRadius: '10px', cursor: 'pointer', marginTop: '28px' }}><FaTrash /></button>
                                        </div>
                                        
                                        {embedUrl ? (
                                            <div style={{ width: '100%', height: '250px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
                                                <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt-mut)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                <FaEye style={{ marginRight: '10px' }} /> ضع اللينك لرؤية المعاينة
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ الفيديوهات', 'success')}>حفظ الفيديوهات</Button>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>مذكرات الحصة (PDF)</h2>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={handleAddFile}>ملف جديد</Button>
                            </div>

                            {files.map((file, idx) => (
                                <div key={file.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                                    <div style={{ flex: 1 }}><Input label="اسم الملف" value={file.title} onChange={e => { const n = [...files]; n[idx].title = e.target.value; setFiles(n); }} placeholder="مثال: ملزمة الأسئلة" /></div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>رفع الملف (سيتم ضغطه)</label>
                                        <label style={{ background: 'var(--bg)', border: '1px dashed var(--p-purple)', padding: '12px', borderRadius: '10px', color: 'var(--p-purple)', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                            {file.isCompressing ? 'جاري ضغط الملف...' : (file.fileName || 'اختر ملف PDF')}
                                            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(idx, e)} disabled={file.isCompressing} />
                                        </label>
                                    </div>
                                    <button onClick={() => handleRemoveFile(file.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', height: '48px', width: '48px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            ))}
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ الملفات', 'success')}>حفظ الملفات</Button>
                        </div>
                    )}

                    {activeTab === 'references' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>المراجع والروابط الخارجية</h2>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={handleAddReference}>رابط جديد</Button>
                            </div>

                            {references.map((ref, idx) => (
                                <div key={ref.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                                    <div style={{ flex: 1 }}><Input label="اسم المرجع" value={ref.title} onChange={e => { const n = [...references]; n[idx].title = e.target.value; setReferences(n); }} placeholder="مثال: جروب التليجرام" /></div>
                                    <div style={{ flex: 2 }}><Input label="رابط المرجع (URL)" value={ref.url} onChange={e => { const n = [...references]; n[idx].url = e.target.value; setReferences(n); }} placeholder="https://..." dir="ltr" /></div>
                                    <button onClick={() => handleRemoveReference(ref.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', height: '48px', width: '48px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            ))}
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ المراجع', 'success')}>حفظ المراجع</Button>
                        </div>
                    )}
                    
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h2 style={{ color: 'var(--txt)', marginBottom: '20px' }}>الإعدادات الأساسية</h2>
                            <Input label="اسم الحصة" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} />
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم الحفظ', 'success')} style={{ marginTop: '20px' }}>حفظ الإعدادات</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', 
    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', 
    background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent',
    color: isActive ? 'var(--p-purple)' : 'var(--txt-mut)',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer', textAlign: 'right', transition: '0.2s',
    borderRight: isActive ? '4px solid var(--p-purple)' : '4px solid transparent'
});