"use client";
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, ExternalLink, Info } from 'lucide-react';

export default function BusanApp() {
  const [items, setItems] = useState<any[]>([]);
  const [lang, setLang] = useState('Kr');
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  // 1. 거리 계산 함수 (Haversine)
  const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => {
      setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude });
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/travel?lang=${lang}`);
      const data = await res.json();
      // API 응답 구조에 맞게 데이터 추출 [cite: 35, 47]
      let list = data[`getRecommended${lang}`]?.item || [];
      
      if (userLoc) {
        list = list.map((item: any) => ({
          ...item,
          dist: getDist(userLoc.lat, userLoc.lng, parseFloat(item.LAT), parseFloat(item.LNG))
        })).sort((a: any, b: any) => a.dist - b.dist);
      }
      setItems(list);
      setLoading(false);
    };
    load();
  }, [lang, userLoc]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* 고정 상단바 */}
      <nav className="sticky top-0 bg-white/70 backdrop-blur-lg border-b p-4 flex justify-between items-center z-50">
        <h1 className="font-extrabold text-xl text-blue-600">Busan Travel</h1>
        <div className="flex gap-1">
          {['Kr', 'En', 'Ja', 'Zhs'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-xs rounded ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{l}</button>
          ))}
        </div>
      </nav>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {loading ? <p className="text-center py-20 font-medium">부산의 이야기를 가져오는 중...</p> : 
          items.map((item, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border overflow-hidden transition-all hover:shadow-md">
              <img src={item.MAIN_IMG_NORMAL} className="w-full h-56 object-cover" alt={item.MAIN_TITLE} />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{item.CATE2_NM}</span>
                  {item.dist && <span className="text-xs text-gray-400 font-mono">{item.dist.toFixed(1)} km away</span>}
                </div>
                <h2 className="text-xl font-bold leading-tight">{item.MAIN_TITLE}</h2>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} /> <span>{item.GUGUN_NM} {item.ADDR1}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.TITLE}</p>
                
                {/* 기능 최대한 활용: 상세내용, 교통정보 등  */}
                <div className="pt-4 border-t flex gap-2">
                  <button onClick={() => alert(item.ITEMCNTNTS.replace(/<[^>]*>/g, ''))} className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
                    <Info size={16} /> 정보 보기
                  </button>
                  <a href={`https://map.kakao.com/link/to/${item.MAIN_TITLE},${item.LAT},${item.LNG}`} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Navigation size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
