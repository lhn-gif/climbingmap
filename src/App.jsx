<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>클라이밍 앱 : 통합 프로토타입</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

<style>
  /* === 기본 스타일 === */
  body { margin: 0; padding: 0; background-color: #f0f2f5; font-family: 'Apple SD Gothic Neo', sans-serif; display: flex; justify-content: center; height: 100vh; overflow: hidden; }
  .mobile-container { width: 100%; max-width: 400px; background-color: white; height: 100%; position: relative; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }

  /* 지도 및 기본 UI */
  .header { position: absolute; top: 10px; left: 10px; right: 10px; z-index: 900; }
  .search-wrapper { background: white; border-radius: 8px; padding: 5px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; }
  .search-input { border: none; outline: none; width: 100%; padding: 10px; font-size: 14px; }
  .search-btn { border: none; background: none; cursor: pointer; font-size: 18px; }
  #map { flex: 1; width: 100%; height: 100%; z-index: 1; }
  .custom-pin { border-radius: 20px; color: white; font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.4); text-align: center; padding: 5px 10px; white-space: nowrap; border: 2px solid white; cursor: pointer; }
  .status-red { background-color: #e74c3c; } .status-green { background-color: #2ecc71; }
  .custom-pin::after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); border-width: 6px 6px 0; border-style: solid; }
  .status-red::after { border-color: #e74c3c transparent transparent transparent; } .status-green::after { border-color: #2ecc71 transparent transparent transparent; }
  .nav-bar { height:60px; background:white; display:flex; justify-content:space-around; align-items:center; border-top:1px solid #eee; position:absolute; bottom:0; width:100%; z-index:100; }

  /* === [페이지 1] 암장 상세 페이지 (정보 복구됨) === */
  .detail-page { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #f8f9fa; z-index: 2000; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s; }
  .detail-page.active { transform: translateX(0); }
  .detail-header { padding: 15px; background: white; display: flex; align-items: center; border-bottom: 1px solid #eee; }
  .btn-back { font-size: 24px; margin-right: 15px; cursor: pointer; background: none; border: none; }
  .detail-title { font-size: 18px; font-weight: bold; }
  
  /* 상세 컨텐츠 스타일 */
  .detail-content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 90px; }
  .status-card { background: white; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; }
  .big-status-text { font-size: 24px; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; }
  .status-dot { width: 15px; height: 15px; border-radius: 50%; display: inline-block; margin-right: 8px; }
  .progress-bg { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; width: 100%; }
  .progress-bar { height: 100%; width: 0%; transition: width 1s; }
  
  /* 프로필 아바타 (상세페이지용) */
  .avatar-row { display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
  .avatar-img { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-left: -12px; object-fit: cover; background: #eee; }
  .avatar-img:first-child { margin-left: 0; }
  .avatar-more { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; background-color: #eee; color: #777; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 13px; margin-left: -12px; z-index: 5; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

  /* 정보 섹션 스타일 */
  .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; margin-top: 20px; }
  .info-box { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .info-row { display: flex; margin-bottom: 15px; font-size: 14px; align-items: flex-start; }
  .info-label { width: 70px; color: #888; font-weight: bold; flex-shrink: 0; }
  .info-value { flex: 1; color: #333; line-height: 1.5; word-break: break-all; }
  .no-data { color: #e74c3c; font-weight: bold; font-size: 12px; background: #fde8e7; padding: 2px 6px; border-radius: 4px; }
  
  /* 링크 버튼 */
  .link-group { display: flex; gap: 10px; margin-top: 5px; }
  .btn-link { flex: 1; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-align: center; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; }
  .btn-insta { background: #fdf2f6; color: #E1306C; border-color: #fadce7; }
  .btn-blog { background: #f0fcf4; color: #2DB400; border-color: #d1e7dd; }
  .btn-web { background: #f1f3f5; color: #495057; border-color: #dee2e6; }
  .btn-disabled { background: #f8f9fa; color: #adb5bd; cursor: not-allowed; border-color: #eee; }

  /* 하단 버튼 */
  .detail-footer { padding: 15px; background: white; border-top: 1px solid #eee; position: absolute; bottom: 0; width: 100%; box-sizing: border-box; }
  .btn-checkin-large { background-color: #333; color: white; width: 100%; padding: 16px; border-radius: 12px; border: none; font-size: 16px; font-weight: bold; cursor: pointer; }


  /* === [페이지 2] 운동 기록 페이지 === */
  .workout-page {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-color: white; z-index: 3000; display: flex; flex-direction: column;
    transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .workout-page.active { transform: translateY(0); }
  .workout-header { padding: 20px; text-align: center; border-bottom: 1px solid #f1f3f5; }
  .workout-date { font-size: 12px; color: #868e96; margin-bottom: 5px; }
  .workout-gym-title { font-size: 18px; font-weight: bold; color: #333; }
  .timer-section { padding: 40px 0; text-align: center; background: #fafafa; }
  .timer-display { font-size: 48px; font-weight: 800; color: #333; font-variant-numeric: tabular-nums; letter-spacing: 2px; }
  .timer-dot { color: #e74c3c; animation: blink 1s infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  
  .workout-content { flex: 1; overflow-y: auto; padding: 20px; }
  .w-section { margin-bottom: 30px; }
  .w-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
  
  .upload-area { border: 2px dashed #dee2e6; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; color: #868e96; transition: 0.2s; }
  .upload-area:active { background: #f8f9fa; border-color: #adb5bd; }
  .uploaded-preview { display: flex; gap: 10px; overflow-x: auto; margin-top: 10px; padding-bottom: 5px; }
  .preview-img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid #eee; }

  .level-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .level-item { background: #f8f9fa; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; align-items: center; position: relative; }
  .level-color { width: 20px; height: 20px; border-radius: 50%; margin-bottom: 5px; }
  .level-count { font-size: 18px; font-weight: bold; }
  .level-name { font-size: 10px; color: #888; }
  .level-badge { position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; font-size: 9px; padding: 2px 6px; border-radius: 10px; opacity: 0; transform: scale(0.5); transition: 0.3s; }
  .level-badge.show { opacity: 1; transform: scale(1); }

  .friend-add-btn { background: #f1f3f5; border: none; padding: 8px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; color: #495057; }
  .friend-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .friend-tag { background: #e7f5ff; color: #1c7ed6; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; display: flex; align-items: center; }
  .friend-tag span { margin-left: 5px; cursor: pointer; opacity: 0.5; }

  .workout-footer { padding: 15px; border-top: 1px solid #eee; background: white; }
  .btn-finish { background-color: #fa5252; color: white; width: 100%; padding: 16px; border-radius: 12px; border: none; font-size: 16px; font-weight: bold; cursor: pointer; }

  /* 로딩 오버레이 */
  .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.9); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 5000; display: none; }
  .spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #333; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

</style>
</head>
<body>

<div class="mobile-container">
  
  <div class="header">
    <div class="search-wrapper">
      <input type="text" class="search-input" id="searchInput" placeholder="지역명 검색 (예: 강남)" onkeypress="handleEnter(event)">
      <button class="search-btn" onclick="searchLocation()">🔍</button>
    </div>
  </div>
  <div id="map"></div>
  <div class="nav-bar">
    <div style="text-align:center;color:#333;"><span>🏠</span>홈</div>
    <div style="text-align:center;color:#aaa;"><span>📝</span>기록</div>
    <div style="text-align:center;color:#aaa;"><span>👤</span>MY</div>
  </div>

  <div class="detail-page" id="detailPage">
    <div class="detail-header">
      <button class="btn-back" onclick="closeDetail()">←</button>
      <div class="detail-title" id="d_title">암장 이름</div>
    </div>
    
    <div class="detail-content">
      <div class="status-card">
        <div class="big-status-text">
          <span class="status-dot" id="d_dot"></span> <span id="d_status_msg">상태</span>
        </div>
        <div style="color:#666; font-size:14px; margin-bottom:15px;">현재 <b><span id="d_count">0</span>명</b> 운동 중</div>
        <div class="avatar-row" id="d_avatars"></div>
        <div class="progress-bg"><div class="progress-bar" id="d_bar"></div></div>
      </div>

      <div class="section-title">기본 정보</div>
      <div class="info-box">
        <div class="info-row"><div class="info-label">주소</div><div class="info-value" id="d_address">-</div></div>
        <div class="info-row"><div class="info-label">운영시간</div><div class="info-value" id="d_hours">-</div></div>
        <div class="info-row"><div class="info-label">전화번호</div><div class="info-value" id="d_phone">-</div></div>
        <div class="info-row"><div class="info-label">이용요금</div><div class="info-value" id="d_price">-</div></div>
      </div>

      <div class="section-title">온라인 & 세팅</div>
      <div class="info-box">
        <div class="info-row"><div class="info-label">세팅정보</div><div class="info-value" id="d_setting">-</div></div>
        <div class="info-row">
          <div class="info-label">링크</div>
          <div class="info-value" style="width: 100%;">
            <div class="link-group" id="d_links">
              </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-footer">
      <button class="btn-checkin-large" onclick="startWorkout()">📍 지금 여기서 운동 시작하기</button>
    </div>
  </div>

  <div class="workout-page" id="workoutPage">
    <div class="workout-header">
      <div class="workout-date" id="w_date">2024.01.20</div>
      <div class="workout-gym-title" id="w_gym_name">암장 이름</div>
    </div>

    <div class="timer-section">
      <div style="font-size:13px; color:#adb5bd; margin-bottom:10px;">TOTAL TIME</div>
      <div class="timer-display" id="timer">00:00:00</div>
    </div>

    <div class="workout-content">
      <div class="w-section">
        <div class="w-title">운동 인증샷 & AI 분석</div>
        <div class="upload-area" onclick="simulateAIUpload()">
          📷 사진/영상 업로드 (Click!)<br>
          <span style="font-size:11px; color:#adb5bd;">업로드 시 난이도가 자동 집계됩니다.</span>
        </div>
        <div class="uploaded-preview" id="previewArea"></div>
      </div>

      <div class="w-section">
        <div class="w-title">난이도 기록 (자동/수동)</div>
        <div class="level-grid">
          <div class="level-item"><div class="level-color" style="background:#ff6b6b"></div><span class="level-count" id="cnt_red">0</span><span class="level-name">빨강</span><div class="level-badge" id="badge_red">+1</div></div>
          <div class="level-item"><div class="level-color" style="background:#4dabf7"></div><span class="level-count" id="cnt_blue">0</span><span class="level-name">파랑</span><div class="level-badge" id="badge_blue">+1</div></div>
          <div class="level-item"><div class="level-color" style="background:#51cf66"></div><span class="level-count" id="cnt_green">0</span><span class="level-name">초록</span><div class="level-badge" id="badge_green">+1</div></div>
        </div>
      </div>

      <div class="w-section">
        <div class="w-title">함께한 친구 <button class="friend-add-btn" onclick="addFriendPrompt()">+ 친구 추가</button></div>
        <div class="friend-list" id="friendList"></div>
      </div>
    </div>

    <div class="workout-footer">
      <button class="btn-finish" onclick="finishWorkout()">⏹ 운동 종료 및 저장</button>
    </div>
    
    <div class="loading-overlay" id="aiLoading">
      <div class="spinner"></div>
      <div style="font-weight:bold;">AI 분석 중...</div>
    </div>
  </div>

</div>

<script>
  // --- 지도 설정 ---
  var map = L.map('map', { zoomControl: false }).setView([37.4980, 127.0270], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

  function createPin(name, status) {
    var colorClass = status === '혼잡' ? 'status-red' : 'status-green';
    return L.divIcon({ className: 'custom-pin-container', html: `<div class="custom-pin ${colorClass}">${name}</div>`, iconSize: [80, 30], iconAnchor: [40, 35] });
  }

  // --- 통합 데이터 (상세정보 + 위치) ---
  const sampleAvatars = ["https://i.pravatar.cc/100?img=1", "https://i.pravatar.cc/100?img=2", "https://i.pravatar.cc/100?img=3", "https://i.pravatar.cc/100?img=4"];

  const gyms = [
    { 
      id: 1, name: "손상원짐 강남", status: "혼잡", count: 42, max: 50, lat: 37.4925, lng: 127.0315,
      address: "서울 강남구 역삼로 123 B1", phone: "02-1234-5678", hours: "월-금 12:00 ~ 23:00\n주말 10:00 ~ 20:00",
      price: "1일권 20,000원", setting: "지구력벽 리뉴얼", insta: "https://instagram.com/son_gym", blog: null, web: "http://sonclimbing.com"
    },
    { 
      id: 2, name: "클팍 강남", status: "여유", count: 8, max: 60, lat: 37.5045, lng: 127.0240,
      address: "서울 강남구 강남대로 456 B2", phone: null, hours: "매일 10:00 ~ 23:00",
      price: "1일권 22,000원", setting: "볼더링 섹터 1,2 교체", insta: "https://instagram.com/climbingpark", blog: "https://blog.naver.com", web: null
    },
    { 
      id: 3, name: "더클 연남", status: "혼잡", count: 85, max: 100, lat: 37.5615, lng: 126.9255,
      address: "서울 마포구 양화로 123", phone: "02-333-4444", hours: "10:00-23:00",
      price: "20,000원", setting: "컴피벽 세팅", insta: "#", blog: "#", web: "#" 
    }
  ];

  gyms.forEach(gym => {
    L.marker([gym.lat, gym.lng], { icon: createPin(gym.name, gym.status) }).addTo(map).on('click', () => openDetail(gym));
  });

  // --- [페이지 1 Logic] 상세 페이지 열기 ---
  let currentGymName = "";

  function checkData(text) {
    if (!text) return '<span class="no-data">업데이트 필요</span>';
    return text.replace(/\n/g, '<br>');
  }

  function createLinkBtn(url, type, name) {
    if (url) return `<a href="${url}" target="_blank" class="btn-link btn-${type}">${name}</a>`;
    else return `<span class="btn-link btn-disabled">${name} X</span>`;
  }

  function openDetail(data) {
    currentGymName = data.name;
    document.getElementById('d_title').innerText = data.name;
    
    // 1. 정보 채우기
    document.getElementById('d_address').innerHTML = checkData(data.address);
    document.getElementById('d_phone').innerHTML = checkData(data.phone);
    document.getElementById('d_hours').innerHTML = checkData(data.hours);
    document.getElementById('d_price').innerHTML = checkData(data.price);
    document.getElementById('d_setting').innerHTML = checkData(data.setting);
    
    // 2. 링크 생성
    const linkContainer = document.getElementById('d_links');
    linkContainer.innerHTML = createLinkBtn(data.insta, 'insta', 'Insta') + createLinkBtn(data.blog, 'blog', 'Blog') + createLinkBtn(data.web, 'web', 'Web');

    // 3. 아바타 및 혼잡도
    const avatarContainer = document.getElementById('d_avatars');
    avatarContainer.innerHTML = '';
    let displayCount = Math.min(data.count, 4);
    for(let i=0; i < displayCount; i++) avatarContainer.innerHTML += `<img src="${sampleAvatars[i]}" class="avatar-img">`;
    if (data.count > 4) avatarContainer.innerHTML += `<div class="avatar-more">+${data.count - 4}</div>`;

    document.getElementById('d_count').innerText = data.count;
    var statusMsg = document.getElementById('d_status_msg');
    var dot = document.getElementById('d_dot');
    var bar = document.getElementById('d_bar');
    var percent = Math.min((data.count / data.max) * 100, 100);
    bar.style.width = percent + "%";

    if (data.status === '혼잡') {
      statusMsg.innerText = "혼잡함"; statusMsg.style.color = "#e74c3c"; dot.style.background = "#e74c3c"; bar.style.background = "#e74c3c";
    } else {
      statusMsg.innerText = "여유로움"; statusMsg.style.color = "#2ecc71"; dot.style.background = "#2ecc71"; bar.style.background = "#2ecc71";
    }
    document.getElementById('detailPage').classList.add('active');
  }

  function closeDetail() { document.getElementById('detailPage').classList.remove('active'); }

  // --- [페이지 2 Logic] 운동 기록 및 타이머 ---
  let timerInterval;
  let seconds = 0;

  function startWorkout() {
    // 오늘 날짜 및 암장명 설정
    const today = new Date();
    document.getElementById('w_date').innerText = today.toLocaleDateString();
    document.getElementById('w_gym_name').innerText = currentGymName;

    document.getElementById('workoutPage').classList.add('active');

    // 타이머 시작
    seconds = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerHTML = `${h}:${m}<span class="timer-dot">:</span>${s}`;
  }

  function simulateAIUpload() {
    document.getElementById('aiLoading').style.display = 'flex';
    setTimeout(() => {
      document.getElementById('aiLoading').style.display = 'none';
      const previewBox = document.getElementById('previewArea');
      previewBox.innerHTML += `<img src="https://source.unsplash.com/random/100x100/?climbing,wall&sig=${Math.random()}" class="preview-img">`;

      const colors = ['red', 'blue', 'green'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const countEl = document.getElementById(`cnt_${randomColor}`);
      const badgeEl = document.getElementById(`badge_${randomColor}`);
      
      countEl.innerText = parseInt(countEl.innerText) + 1;
      badgeEl.classList.add('show');
      setTimeout(() => badgeEl.classList.remove('show'), 1000);
      alert(`🤖 AI 분석 완료! ${randomColor} 문제 추가됨`);
    }, 1500);
  }

  function addFriendPrompt() {
    const name = prompt("친구 닉네임:");
    if (name) document.getElementById('friendList').innerHTML += `<div class="friend-tag">@${name} <span onclick="this.parentElement.remove()">x</span></div>`;
  }

  function finishWorkout() {
    if (confirm("운동 기록을 저장하시겠습니까?")) {
      clearInterval(timerInterval);
      alert("✅ 저장 완료!");
      document.getElementById('workoutPage').classList.remove('active');
      document.getElementById('detailPage').classList.remove('active');
      // 초기화 로직 (생략 가능)
      seconds = 0; document.getElementById('timer').innerText = "00:00:00";
      document.getElementById('previewArea').innerHTML = ""; document.getElementById('friendList').innerHTML = "";
    }
  }

  function searchLocation() {
    // 검색 로직 시뮬레이션
    alert("지금은 '강남' 데이터만 있어서 강남역으로 이동할게요!");
    map.setView([37.4980, 127.0270], 14);
  }
  function handleEnter(e) { if(e.key==='Enter') searchLocation(); }

</script>
</body>
</html>
