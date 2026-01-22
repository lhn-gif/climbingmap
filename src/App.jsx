import React, { useEffect, useState } from 'react';

const App = () => {
  const [activePage, setActivePage] = useState('home'); // home, detail, workout
  const [currentGym, setCurrentGym] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // 샘플 데이터
  const gyms = [
    { id: 1, name: "손상원짐 강남", status: "혼잡", count: 42, max: 50, lat: 37.4925, lng: 127.0315, address: "서울 강남구 역삼로 123 B1", phone: "02-1234-5678", hours: "월-금 12:00 ~ 23:00", price: "1일권 20,000원", setting: "지구력벽 리뉴얼", insta: "#" },
    { id: 2, name: "클팍 강남", status: "여유", count: 8, max: 60, lat: 37.5045, lng: 127.0240, address: "서울 강남구 강남대로 456 B2", hours: "매일 10:00 ~ 23:00", price: "1일권 22,000원", setting: "볼더링 섹터 1,2 교체", insta: "#" }
  ];

  useEffect(() => {
    // 지도 초기화 (컴포넌트가 마운트될 때 한 번만 실행)
    if (window.L) {
      const map = window.L.map('map', { zoomControl: false }).setView([37.4980, 127.0270], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      gyms.forEach(gym => {
        const colorClass = gym.status === '혼잡' ? 'bg-red-500' : 'bg-green-500';
        const customIcon = window.L.divIcon({
          className: 'custom-pin',
          html: `<div class="${colorClass} text-white px-2 py-1 rounded-full border-2 border-white font-bold text-xs shadow-lg whitespace-nowrap">${gym.name}</div>`,
          iconSize: [80, 30]
        });

        window.L.marker([gym.lat, gym.lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            setCurrentGym(gym);
            setActivePage('detail');
          });
      });
    }
  }, []);

  // 타이머 로직
  const startTimer = () => {
    setActivePage('workout');
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100 overflow-hidden font-sans">
      <div className="w-full max-w-[400px] bg-white h-full relative flex flex-col shadow-2xl overflow-hidden">
        
        {/* Search Header */}
        <div className="absolute top-4 left-4 right-4 z-[900]">
          <div className="bg-white rounded-lg shadow-md p-2 flex items-center">
            <input type="text" className="w-full p-2 outline-none text-sm" placeholder="지역명 검색 (예: 강남)" />
            <button className="px-2">🔍</button>
          </div>
        </div>

        {/* Map Area */}
        <div id="map" className="flex-1 z-0"></div>

        {/* Detail Page Overlay */}
        {currentGym && (
          <div className={`absolute inset-0 bg-white z-[1000] transition-transform duration-300 ${activePage === 'detail' || activePage === 'workout' ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex items-center border-bottom border-gray-100">
              <button onClick={() => setActivePage('home')} className="text-2xl mr-4">←</button>
              <h2 className="font-bold text-lg">{currentGym.name}</h2>
            </div>
            <div className="p-5 overflow-y-auto h-full pb-32">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 mb-5 text-center">
                <div className="text-xl font-bold mb-2 flex items-center justify-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${currentGym.status === '혼잡' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  {currentGym.status}함
                </div>
                <div className="text-sm text-gray-500 mb-4">현재 {currentGym.count}명 이용 중</div>
                <button 
                  onClick={startTimer}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold"
                >
                  📍 지금 여기서 운동 시작하기
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <p><b>주소:</b> {currentGym.address}</p>
                <p><b>이용가:</b> {currentGym.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Workout Page Overlay */}
        <div className={`absolute inset-0 bg-white z-[2000] transition-transform duration-500 ${activePage === 'workout' ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="p-10 text-center bg-gray-50">
            <div className="text-gray-400 text-xs mb-2">TOTAL TIME</div>
            <div className="text-5xl font-black tracking-widest">{formatTime(timer)}</div>
          </div>
          <div className="p-6">
             <h3 className="font-bold mb-4">운동 인증샷 AI 분석</h3>
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 cursor-pointer">
               📷 사진 업로드
             </div>
             <button 
               onClick={() => {
                 clearInterval(timerInterval);
                 setActivePage('home');
                 setTimer(0);
                 alert('운동이 저장되었습니다!');
               }}
               className="w-full bg-red-500 text-white py-4 rounded-xl font-bold mt-10"
             >
               ⏹ 운동 종료 및 저장
             </button>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="h-16 border-t flex justify-around items-center bg-white z-[500]">
          <div className="text-center text-xs text-black">🏠<br/>홈</div>
          <div className="text-center text-xs text-gray-400">📝<br/>기록</div>
          <div className="text-center text-xs text-gray-400">👤<br/>MY</div>
        </div>
      </div>
    </div>
  );
};

export default App;
