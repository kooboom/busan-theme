"use client";
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Info, Globe } from 'lucide-react';

export default function BusanTravelPage() {
  const [items, setItems] = useState<any[]>([]);
  const [lang, setLang] = useState('Kr');
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  // 거리 계산 공식 (Haversine)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    // 현재 위치 파악
    navigator.geolocation.getCurrentPosition(
      (p) => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => console.log("위치 정보 접근 거부")
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/travel?lang=${lang}`);
        const data = await res.json();
        // 각 언어별 API 응답 구조에 맞춰 데이터 추출 [cite: 23, 32, 44]
        let list = data[`getRecommended${lang}`]?.item || [];
        
        if (userLoc && list.length > 0) {
          list = list.map((item: any) => ({
            ...item,
            dist: getDistance(userLoc.lat, userLoc.lng, parseFloat(item.LAT), parseFloat(item.LNG))
          })).sort((a: any, b: any) => a.dist - b.dist); // 가까운 순 정렬
        }
        setItems(list);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [lang, userLoc]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b p-4 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-600 tracking-tighter">BUSAN THEME</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['Kr', 'En', 'Ja', 'Zhs'].map(l => (
              <button 
                key={l} 
                onClick={() => setLang(l)} 
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${lang === l ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center py-20 font-semibold text-slate-400">부산의 여행지를 찾고 있습니다...</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={item.MAIN_IMG_NORMAL} className="w-full h-64 object-cover" alt={item.MAIN_TITLE} />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-medium">
                  {item.CATE2_NM}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold tracking-tight">{item.MAIN_TITLE}</h2>
                  {item.dist && (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                      {item.dist.toFixed(1)} km
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPin size={14} className="text-blue-500" />
                  <span>{item.GUGUN_NM}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.TITLE}</p>
                
                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => alert(item.ITEMCNTNTS.replace(/<[^>]*>/g, ''))}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold active:scale-95 transition"
                  >
                    상세 정보 [cite: 32]
                  </button>
                  <a 
                    href={`https://map.kakao.com/link/to/${item.MAIN_TITLE},${item.LAT},${item.LNG}`}
                    target="_blank"
                    className="aspect-square bg-slate-100 p-4 rounded-2xl flex items-center justify-center text-slate-600"
                  >
                    <Navigation size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
