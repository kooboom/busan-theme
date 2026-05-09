'use client';

import { useEffect, useState } from 'react';

export default function BusanThemePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/theme?numOfRows=12');
      const data = await res.json();
      // 데이터 경로가 공공데이터포털 특유의 복잡한 구조일 수 있으니 확인 후 매핑
      const result = data.getRecommendedKr?.item || [];
      setItems(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 깔끔한 상단 바 */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <span className="text-xl font-black text-blue-600 tracking-tighter">BUSAN TRAVEL</span>
          <button 
            onClick={fetchData}
            className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            새로고침
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-3">부산 테마 여행</h2>
          <p className="text-gray-500 font-medium">교육대학원생들과 함께 떠나는 부산 탐구 생활</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-300 font-bold animate-pulse">데이터 수신 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* 사진 영역: 크기를 딱 고정했습니다! */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.MAIN_IMG_NORMAL} 
                    alt={item.MAIN_TITLE}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm">
                      {item.GUGUN_NM || '부산'}
                    </span>
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div className="p-7">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors truncate">
                    {item.MAIN_TITLE}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                    {item.ITEMCNTNTS}
                  </p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <span className="text-[11px] font-bold text-gray-400">
                      📍 {item.ADDR1.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <a 
                      href={`https://map.kakao.com/?q=${encodeURIComponent(item.MAIN_TITLE)}`} 
                      target="_blank"
                      className="text-[11px] font-black text-blue-600 hover:underline"
                    >
                      지도보기 →
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
