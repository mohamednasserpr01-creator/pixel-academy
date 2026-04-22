import { Lecture, CurriculumAction } from '../types/curriculum.types';

// مكتبة صغيرة مساعدة عشان نقل العناصر جوه الـ Array
const arrayMove = <T>(array: T[], from: number, to: number): T[] => {
    const newArray = [...array];
    const [item] = newArray.splice(from, 1);
    newArray.splice(to, 0, item);
    return newArray;
};

export const curriculumReducer = (state: Lecture[], action: CurriculumAction): Lecture[] => {
    switch (action.type) {
        
        case 'ADD_LECTURE':
            return [...state, { id: `lec-${Date.now()}`, title: action.payload.title, items: [] }];

        case 'UPDATE_LECTURE_TITLE':
            return state.map(lec => 
                lec.id === action.payload.lectureId ? { ...lec, title: action.payload.title } : lec
            );

        case 'REMOVE_LECTURE':
            return state.filter(lec => lec.id !== action.payload.lectureId);

        case 'ADD_ITEM':
            return state.map(lec => 
                lec.id === action.payload.lectureId 
                    ? { ...lec, items: [...lec.items, action.payload.item] } 
                    : lec
            );

        case 'UPDATE_ITEM':
            return state.map(lec => {
                if (lec.id !== action.payload.lectureId) return lec;
                return {
                    ...lec,
                    items: lec.items.map(item => 
                        item.id === action.payload.itemId ? { ...item, ...action.payload.updates } : item
                    )
                };
            });

        case 'REMOVE_ITEM':
            return state.map(lec => {
                if (lec.id !== action.payload.lectureId) return lec;
                return { ...lec, items: lec.items.filter(item => item.id !== action.payload.itemId) };
            });

        // 🚀 ترتيب جوه نفس المحاضرة
        case 'REORDER_ITEMS':
            return state.map(lec => {
                if (lec.id !== action.payload.lectureId) return lec;
                return {
                    ...lec,
                    items: arrayMove(lec.items, action.payload.oldIndex, action.payload.newIndex)
                };
            });

        // 🚀 نقل من محاضرة لمحاضرة تانية (أهم ميزة للـ dnd-kit)
        case 'MOVE_ITEM_BETWEEN_LECTURES': {
            const { sourceLectureId, targetLectureId, itemId, newIndex } = action.payload;
            
            const sourceLecture = state.find(l => l.id === sourceLectureId);
            const itemToMove = sourceLecture?.items.find(i => i.id === itemId);
            
            if (!itemToMove) return state;

            return state.map(lec => {
                // شيل العنصر من المحاضرة القديمة
                if (lec.id === sourceLectureId) {
                    return { ...lec, items: lec.items.filter(i => i.id !== itemId) };
                }
                // حط العنصر في المحاضرة الجديدة في المكان الصح
                if (lec.id === targetLectureId) {
                    const newItems = [...lec.items];
                    newItems.splice(newIndex, 0, itemToMove);
                    return { ...lec, items: newItems };
                }
                return lec;
            });
        }

        case 'SET_CURRICULUM':
            return action.payload;

        default:
            return state;
    }
};