'use client';

import { useEffect, useState } from 'react';

export default function ThemeTravelPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 가져오기 함수
  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/theme?numOfRows=12');
      const data = await res.json();
      setItems(data.getRecommendedKr.item || []);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
            BUSAN VIBE
          </h1>
          <button 
            onClick={fetchThemes}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 text-sm"
          >
            새로고침
          </button>
        </div>
      </header>

      {/* 메인 섹션 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 mb-2">부산 테마 여행 코스</h2>
          <p className="text-slate-500">교육대학원 학생들과 함께 만드는 부산 여행 가이드</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400 font-medium">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item: any, index: number) => (
              <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                {/* 이미지 영역 */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={item.MAIN_IMG_NORMAL || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800'} 
                    alt={item.MAIN_TITLE}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur text-blue-600 px-3 py-1 rounded-full text-xs font-black shadow-sm">
                      {item.GUGUN_NM}
                    </span>
                  </div>
                </div>
                
                {/* 텍스트 영역 */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors truncate">
                    {item.MAIN_TITLE}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                    {item.ITEMCNTNTS}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      📍 {item.ADDR1.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <a 
                      href={`https://map.kakao.com/?q=${encodeURIComponent(item.MAIN_TITLE)}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-black text-blue-600 hover:text-indigo-700"
                    >
                      MAP
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
