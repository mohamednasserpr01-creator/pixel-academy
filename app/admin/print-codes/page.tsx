"use client";
import React, { useEffect, useState } from 'react';

export default function PrintCodesPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // قراءة الداتا من المتصفح
        const stored = localStorage.getItem('print_codes_data');
        if (stored) {
            setData(JSON.parse(stored));
            // 💡 أمر الطباعة التلقائي بعد ثانية عشان الصورة تلحق تحمل
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, []);

    if (!data) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '2rem' }}>جاري التجهيز للطباعة... 🖨️</div>;

    // تقسيم الأكواد لمصفوفات كل مصفوفة فيها 27 كود (صفحة واحدة)
    const pages = [];
    for (let i = 0; i < data.codes.length; i += 27) {
        pages.push(data.codes.slice(i, i + 27));
    }

    return (
        <>
            {/* 💡 CSS مخصص للطباعة فقط (A4 Size) */}
            <style dangerouslySetInnerHTML={{__html: `
                @page { size: A4 portrait; margin: 0; }
                body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                /* مقاس صفحة الـ A4 بالمللي */
                .page-sheet { 
                    width: 210mm; 
                    height: 297mm; 
                    page-break-after: always; 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: repeat(9, 1fr); 
                    gap: 0; 
                    overflow: hidden; 
                }
                
                .code-card { 
                    position: relative; 
                    width: 100%; 
                    height: 100%; 
                    background-image: url('${data.background}'); 
                    background-size: 100% 100%; 
                    background-repeat: no-repeat; 
                    color: black; 
                    font-family: sans-serif; 
                }
                
                /* 💡 الإحداثيات مطابقة لكود الـ C# القديم بتاعك */
                .price-tag { position: absolute; top: 6%; left: 11%; font-size: 12px; font-weight: 900; }
                .serial-tag { position: absolute; bottom: 23%; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 900; letter-spacing: 1px; }
                .secret-code { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 900; letter-spacing: 1px; color: ${data.color}; }
                
                /* إخفاء أي حاجة تانية في الموقع وقت الطباعة */
                header, footer, .sidebar, .fab-container { display: none !important; }
            `}} />

            {/* رسم الصفحات */}
            {pages.map((pageCodes, pIdx) => (
                <div key={pIdx} className="page-sheet">
                    {pageCodes.map((c: any, i: number) => (
                        <div key={i} className="code-card">
                            <div className="price-tag">{c.price}</div>
                            <div className="serial-tag">{c.serial}</div>
                            <div className="secret-code">{c.code}</div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}