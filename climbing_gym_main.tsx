import React, { useState } from 'react';
import { Search, Bell, List, MapPin, ChevronRight, X, Users, Clock, Star, Phone, Heart, Calendar, User, Compass } from 'lucide-react';

const ClimbingApp = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

  const gyms = [
    {
      id: 1,
      name: '더클라임 강남',
      address: '서울 강남구 테헤란로',
      fullAddress: '서울 강남구 테헤란로 123',
      distance: '800m',
      currentUsers: 18,
      capacity: 60,
      congestion: 'low',
      rating: 4.5,
      openTime: '06:00 - 23:00',
      position: { top: '33%', left: '33%' }
    },
    {
      id: 2,
      name: '클라이밍파크 홍대',
      address: '서울 마포구 홍익로',
      fullAddress: '서울 마포구 홍익로 45',
      distance: '1.2km',
      currentUsers: 45,
      capacity: 70,
      congestion: 'medium',
      rating: 4.7,
      openTime: '10:00 - 23:00',
      position: { top: '66%', left: '50%' }
    },
    {
      id: 3,
      name: '볼더링짐 성수',
      address: '서울 성동구 성수이로',
      fullAddress: '서울 성동구 성수이로 78',
      distance: '2.1km',
      currentUsers: 62,
      capacity: 70,
      congestion: 'high',
      rating: 4.3,
      openTime: '07:00 - 22:00',
      position: { top: '50%', left: '75%' }
    },
    {
      id: 4,
      name: '클라임온 용산',
      address: '서울 용산구 한강대로',
      fullAddress: '서울 용산구 한강대로 234',
      distance: '3.4km',
      currentUsers: 35,
      capacity: 90,
      congestion: 'low',
      rating: 4.6,
      openTime: '06:00 - 24:00',
      position: { top: '25%', left: '66%' }
    }
  ];

  const getCongestionColor = (level) => {
    switch(level) {
      case 'low': return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600', badge: 'bg-green-500', tagBg: 'bg-green-100' };
      case 'medium': return { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600', badge: 'bg-yellow-500', tagBg: 'bg-yellow-100' };
      case 'high': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'bg-red-500', tagBg: 'bg-red-100' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-600', badge: 'bg-gray-500', tagBg: 'bg-gray-100' };
    }
  };

  const getCongestionText = (level) => {
    switch(level) {
      case 'low': return '여유';
      case 'medium': return '보통';
      case 'high': return '혼잡';
      default: return '정보없음';
    }
  };

  const getCongestionPercentage = (gym) => {
    return Math.round((gym.currentUsers / gym.capacity) * 100);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-white font-sans">
      {/* Header */}
      <div className="z-50 bg-white px-5 pt-14 pb-4 border-b border-gray-100">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              className="w-full h-12 pl-11 pr-4 bg-gray-100 border-none rounded-2xl text-base focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400" 
              placeholder="클라이밍장 이름을 검색해보세요" 
              type="text"
            />
          </div>
          <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 text-gray-800">
            <Bell className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button className="shrink-0 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">내 주변</button>
          <button className="shrink-0 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-100">가까운 순</button>
          <button className="shrink-0 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-100">쾌적한 곳</button>
          <button className="shrink-0 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-100">즐겨찾기</button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-20">
              <path d="M20,30 Q40,20 60,30 T80,40 L75,70 Q60,80 40,70 T20,50 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="0.5"/>
            </svg>
          </div>

          {/* Gym Markers */}
          {gyms.map((gym) => {
            const colors = getCongestionColor(gym.congestion);
            return (
              <div 
                key={gym.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: gym.position.top, left: gym.position.left }}
              >
                <div 
                  className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => setSelectedGym(gym)}
                >
                  <div className={`w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 ${colors.border}`}>
                    <MapPin className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 bg-white rounded-full shadow-md border border-gray-100">
                    <span className={`text-xs font-bold ${colors.text}`}>{getCongestionText(gym.congestion)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* List View Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button 
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-full shadow-xl active:scale-95 transition-transform"
            onClick={() => setBottomSheetExpanded(true)}
          >
            <List className="w-5 h-5" />
            <span className="text-base font-bold">목록보기</span>
          </button>
        </div>

        {/* Bottom Sheet */}
        <div 
          className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
            bottomSheetExpanded ? '' : 'translate-y-1/2'
          }`}
          style={{ maxHeight: '60%' }}
        >
          <div 
            className="flex h-8 w-full items-center justify-center shrink-0 cursor-pointer" 
            onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          >
            <div className="h-1.5 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div className="px-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">지금 바로 클라이밍 🧗‍♂️</h2>
              <span className="text-xs text-gray-600 font-medium">서울 중심</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
            {gyms.map((gym) => {
              const colors = getCongestionColor(gym.congestion);
              return (
                <div 
                  key={gym.id}
                  className="bg-white p-5 rounded-3xl border border-gray-50 shadow-lg flex items-center justify-between cursor-pointer hover:shadow-xl transition-shadow" 
                  onClick={() => setSelectedGym(gym)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 ${colors.tagBg} ${colors.text} text-xs font-bold rounded-md`}>
                        {getCongestionText(gym.congestion)}
                      </span>
                      <span className="text-gray-400 text-xs font-medium">{gym.distance}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{gym.name}</h3>
                    <p className="text-xs text-gray-600">현재 {gym.currentUsers}명 이용 중 · 수용 {gym.capacity}명</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <ChevronRight className={`w-6 h-6 ${gym.congestion === 'low' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGym && (
        <div 
          className="fixed inset-0 z-50 flex items-end" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedGym(null)}
        >
          <div 
            className="bg-white w-full rounded-t-3xl overflow-y-auto" 
            style={{ maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedGym.name}</h2>
                  <p className="text-sm text-gray-600">{selectedGym.address}</p>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-xl" 
                  onClick={() => setSelectedGym(null)}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Congestion Status */}
              {(() => {
                const colors = getCongestionColor(selectedGym.congestion);
                const percentage = getCongestionPercentage(selectedGym);
                return (
                  <div className={`${colors.bg} rounded-3xl p-6 border-2 ${colors.border} border-opacity-20`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base font-bold text-gray-900">현재 혼잡도</span>
                      <span className={`px-3 py-1.5 ${colors.badge} text-white rounded-full text-xs font-bold`}>
                        {getCongestionText(selectedGym.congestion)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Users className="w-8 h-8 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-gray-900">{selectedGym.currentUsers}명</span>
                          <span className="text-gray-600">/ {selectedGym.capacity}명</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-3">
                          <div 
                            className={`${colors.badge} h-3 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                );
              })()}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-medium">운영시간</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedGym.openTime}</p>
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Star className="w-5 h-5" />
                    <span className="text-xs font-medium">평점</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedGym.rating} / 5.0</p>
                </div>
              </div>

              {/* Check-in Button */}
              <button className="w-full bg-blue-600 text-white font-bold py-5 rounded-3xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95">
                <ChevronRight className="w-6 h-6" />
                <span className="text-base">여기서 체크인하기</span>
              </button>

              {/* Additional Info */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">클라이밍장 정보</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{selectedGym.fullAddress}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>02-1234-5678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="relative z-50 bg-white bg-opacity-90 border-t border-gray-100 px-8 pt-3 pb-8 flex justify-between items-center" style={{ backdropFilter: 'blur(20px)' }}>
        <button 
          className="flex flex-col items-center gap-1" 
          onClick={() => setActiveTab('explore')}
        >
          <Compass className={`w-7 h-7 ${activeTab === 'explore' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${activeTab === 'explore' ? 'font-bold text-blue-600' : 'font-medium text-gray-400'}`}>탐색</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1" 
          onClick={() => setActiveTab('favorite')}
        >
          <Heart className={`w-7 h-7 ${activeTab === 'favorite' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${activeTab === 'favorite' ? 'font-bold text-blue-600' : 'font-medium text-gray-400'}`}>내 암장</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1" 
          onClick={() => setActiveTab('diary')}
        >
          <Calendar className={`w-7 h-7 ${activeTab === 'diary' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${activeTab === 'diary' ? 'font-bold text-blue-600' : 'font-medium text-gray-400'}`}>운동일지</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1" 
          onClick={() => setActiveTab('profile')}
        >
          <User className={`w-7 h-7 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${activeTab === 'profile' ? 'font-bold text-blue-600' : 'font-medium text-gray-400'}`}>마이</span>
        </button>
      </div>
    </div>
  );
};

export default ClimbingApp;