// FILE: app/teacher/lessons/page.tsx
"use client";
import React, { useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useTeacherLessons } from '../../../features/teacherLessons/hooks/useTeacherLessons';

// Components (هنعملها مع بعض)
import LessonsHeader from '../../../features/teacherLessons/components/LessonsHeader';
import LessonsFilters from '../../../features/teacherLessons/components/LessonsFilters';
import LessonsTable from '../../../features/teacherLessons/components/LessonsTable';
import LessonsPagination from '../../../features/teacherLessons/components/LessonsPagination';
import CreateLessonModal from '../../../features/teacherLessons/components/CreateLessonModal';

export default function TeacherLessonsPage() {
    // 1. States (UI فقط)
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 2. Debounce (لتأخير البحث)
    const debouncedSearch = useDebounce(search, 500);

    // 3. Data Fetching (React Query)
    const { data, isLoading, isError } = useTeacherLessons(currentPage, debouncedSearch, activeStage);

    // 4. Handlers
    const handleFilterChange = (stage: string) => {
        setActiveStage(stage);
        setCurrentPage(1); // تصفير الصفحة عند تغيير الفلتر
    };

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1); // تصفير الصفحة عند البحث
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* الهيدر وزرار الإضافة */}
            <LessonsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* الفلاتر والبحث */}
                <LessonsFilters 
                    activeStage={activeStage} 
                    onStageChange={handleFilterChange} 
                    searchValue={search} 
                    onSearchChange={handleSearchChange} 
                />

                {/* الجدول */}
                <LessonsTable 
                    lessons={data?.data || []} 
                    isLoading={isLoading} 
                />

                {/* Pagination */}
                {!isLoading && data?.totalPages && data.totalPages > 1 && (
                    <LessonsPagination 
                        currentPage={currentPage} 
                        totalPages={data.totalPages} 
                        totalItems={data.total}
                        onPageChange={setCurrentPage} 
                    />
                )}
            </div>

            {/* مودال الإنشاء */}
            <CreateLessonModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}