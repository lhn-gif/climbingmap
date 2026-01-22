import React, { useEffect, useState } from 'react';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [currentGym, setCurrentGym] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const gyms = [
    { 
      id: 1, name: "손상원짐 강남", status: "혼잡", count: 42, max: 50, lat: 37.4925, lng: 127.0315, 
      address: "서울 강남구 역삼로 123 B1", phone: "02-1234-5678", 
      hours: "월-금 12:00 ~ 23:00 / 주말 10:00 ~ 20:00", 
      price: "1일권 20,000원", setting: "지구력벽 리뉴얼", 
      insta: true, blog: false, web: true 
    },
    { 
      id: 2, name: "클팍 강남", status: "여유", count: 8, max: 60, lat: 37.5045, lng: 127.0240, 
      address: "서울 강남구 강남대로 456 B2", hours: "매일 10:00 ~ 23:00", 
      price: "1일권 22,000원", setting: "볼더링 섹터 1,2 교체", 
      insta: true, blog: true, web: false 
    }
  ];

  // 샘플 아바타 이미지들
  const avatars = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4"
  ];

  useEffect(() => {
    if (window.L && !window.mapInitialized) {
      const map = window.L.map('map', { zoomControl: false }).setView([37.4980, 127.0270], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      window.mapInitialized = true;

      gyms.forEach(gym => {
        const colorClass = gym.status === '혼잡' ? 'bg-red-500' : 'bg-green-500';
        const customIcon = window.L.divIcon({
          className: 'custom-pin',
          html: `<div class="${colorClass} text-white px-3 py-1.5 rounded-full border-2 border-white font-bold text-xs shadow-xl whitespace-nowrap">${gym.name}</div>`,
          iconSize: [100, 40]
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

  const startTimer = () => {
    setActivePage('workout');
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    setTimerInterval(interval);
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="flex justify-center h-screen bg-gray-200 overflow-hidden font-sans text-gray-900">
      <div className="w-full max-w-[400px] bg-white h-full relative flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Search */}
        <div className="absolute top-4 left-4 right-4 z-[900]">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-2 flex items-center border border-gray-100">
            <input type="text" className="w-full p-2 outline-none text-sm bg-transparent" placeholder="클라이밍장 이름을 검색해보세요" />
            <button className="px-3 text-gray-400">🔍</button>
          </div>
        </div>

        {/* Map */}
        <div id="map" className="flex-1 z-0 bg-gray-100"></div>

        {/* Detail Page Overlay */}
        {currentGym && (
          <div className={`absolute inset-0 bg-[#f8f9fa] z-[1000] transition-transform duration-300 ease-out flex flex-col ${activePage === 'detail' || activePage === 'workout' ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex items-center bg-white">
              <button onClick={() => setActivePage('home')} className="text-2xl mr-4">←</button>
              <h2 className="font-extrabold text-lg">{currentGym.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
              {/* Status Card */}
              <div className="m-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className={`text-2xl font-black mb-1 flex items-center justify-center ${currentGym.status === '혼잡' ? 'text-red-500' : 'text-green-500'}`}>
                  <span className={`w-3 h-3 rounded-full mr-3 ${currentGym.status === '혼잡' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  {currentGym.status}함
                </div>
                <div className="text-gray-500 text-sm mb-4">현재 <span className="font-bold text-gray-800">{currentGym.count}명</span> 운동 중</div>
                
                {/* Avatar Stack */}
                <div className="flex justify-center mb-6">
                  {avatars.map((url, i) => (
                    <img key={i} src={url} className={`w-10 h-10 rounded-full border-2 border-white shadow-sm ${i > 0 ? '-ml-3' : ''}`} alt="user" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 -ml-3 shadow-sm">
                    +{currentGym.count - avatars.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${currentGym.status === '혼잡' ? 'bg-red-500 w-[85%]' : 'bg-green-500 w-[30%]'}`}></div>
                </div>
              </div>

              {/* Info Sections */}
              <div className="px-5 space-y-6">
                <div>
                  <h3 className="font-bold text-sm mb-3">기본 정보</h3>
                  <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-gray-50">
                    <div className="flex text-sm"><span className="w-20 text-gray-400 font-bold">주소</span><span className="flex-1 text-gray-700">{currentGym.address}</span></div>
                    <div className="flex text-sm"><span className="w-20 text-gray-400 font-bold">운영시간</span><span className="flex-1 text-gray-700 whitespace-pre-line">{currentGym.hours}</span></div>
                    <div className="flex text-sm"><span className="w-20 text-gray-400 font-bold">전화번호</span><span className="flex-1 text-gray-700">{currentGym.phone || '정보 없음'}</span></div>
                    <div className="flex text-sm"><span className="w-20 text-gray-400 font-bold">이용요금</span><span className="flex-1 text-gray-700">{currentGym.price}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm mb-3">온라인 & 세팅</h3>
                  <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-gray-50">
                    <div className="flex text-sm"><span className="w-20 text-gray-400 font-bold">세팅정보</span><span className="flex-1 text-gray-700">{currentGym.setting}</span></div>
                    <div className="flex text-sm items-center">
                      <span className="w-20 text-gray-400 font-bold">링크</span>
                      <div className="flex gap-2">
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${currentGym.insta ? 'bg-pink-50 text-pink-500 border border-pink-100' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>Insta</span>
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${currentGym.blog ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>Blog X</span>
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${currentGym.web ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>Web</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full">
              <button onClick={startTimer} className="w-full bg-[#333] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg">
                📍 지금 여기서 운동 시작하기
              </button>
            </div>
          </div>
        )}

        {/* Workout Page (Timer) */}
        <div className={`absolute inset-0 bg-white z-[2000] transition-transform duration-500 ease-in-out flex flex-col ${activePage === 'workout' ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="p-10 text-center bg-gray-50 flex-none">
             <div className="text-gray-400 text-xs font-bold mb-2 tracking-widest">TOTAL TIME</div>
             <div className="text-6xl font-black tracking-tighter text-gray-900 font-mono">{formatTime(timer)}</div>
           </div>
           <div className="flex-1 p-6 overflow-y-auto pb-32">
             <div className="mb-8">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-900">운동 인증샷 & AI 분석</h3>
               </div>
               <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 hover:bg-gray-50 transition-colors">
                 📷 사진/영상 업로드 (Click!)<br/><span className="text-[10px] mt-2 block">업로드 시 난이도가 자동 집계됩니다.</span>
               </div>
             </div>
             
             <div className="mb-8">
               <h3 className="font-bold text-gray-900 mb-4">난이도 기록 (자동/수동)</h3>
               <div className="grid grid-cols-3 gap-3">
                 {['red', 'blue', 'green'].map(color => (
                   <div key={color} className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                     <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${color === 'red' ? 'bg-red-400' : color === 'blue' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                     <div className="text-xl font-black">0</div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
           <div className="p-4 bg-white border-t border-gray-100">
             <button 
               onClick={() => { clearInterval(timerInterval); setActivePage('home'); setTimer(0); alert('기록이 저장되었습니다!'); }} 
               className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-red-200 shadow-lg"
             >
               ⏹ 운동 종료 및 저장
             </button>
           </div>
        </div>

        {/* Navigation */}
        <div className="h-16 border-t flex justify-around items-center bg-white z-[500] flex-none">
          <div className="flex flex-col items-center gap-1"><span className="text-lg">🏠</span><span className="text-[10px] font-bold text-gray-900">홈</span></div>
          <div className="flex flex-col items-center gap-1 opacity-30"><span className="text-lg">📝</span><span className="text-[10px] font-bold">기록</span></div>
          <div className="flex flex-col items-center gap-1 opacity-30"><span className="text-lg">👤</span><span className="text-[10px] font-bold">MY</span></div>
        </div>
      </div>
    </div>
  );
};

export default App;
