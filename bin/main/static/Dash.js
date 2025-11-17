/* board.js — 게시판 메인 전용 최소 구현
   - 사이드바 카테고리 클릭
   - 글 목록 렌더
   - 모던한 목(mock) → 실서버 전환 스위치
*/

const MOCK_MODE = true;                  // ← 실서버 붙일 땐 false
const API_BASE  = "http://localhost:3000"; // 실서버 base URL (원하면 수정)

// ---------- 유틸 ----------
const $  = (sel, root=document)=> root.querySelector(sel);
const $$ = (sel, root=document)=> Array.from(root.querySelectorAll(sel));
const fmt = d => new Date(d).toISOString().slice(0,10);

// ---------- 상태 ----------
const state = {
  category: new URLSearchParams(location.search).get("category") || "notice",
  posts: []
};

// ---------- 목 데이터 ----------
const mockPosts = [
  { id: 101, title:"자료구조 시험 공지 안내", author:"관리자", category:"notice", createdAt:"2025-11-07", summary:"범위 및 일정 안내" },
  { id: 102, title:"헷갈리는 부분 질문드립니다", author:"김영웅", category:"question", createdAt:"2025-11-06", summary:"이중포인터에서..." },
  { id: 103, title:"정리 PDF 공유", author:"김영웅", category:"tips", createdAt:"2025-11-05", summary:"캡처 방식 비교" },
  { id: 104, title:"자유게시판 테스트", author:"테스터", category:"free", createdAt:"2025-11-04", summary:"안녕하세요" },
];

// ---------- API 래퍼 ----------
async function api(path, opts={}) {
  if (MOCK_MODE) return mockApi(path, opts);
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type":"application/json", ...(opts.headers||{}) },
    credentials: "include",
    ...opts
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function mockApi(path, opts){
  // GET /api/feed?category=xxx
  if (path.startsWith("/api/feed")) {
    const url = new URL("http://x"+path); // 가짜 호스트로 URL 파싱
    const cat = url.searchParams.get("category");
    const data = cat && cat !== "all"
      ? mockPosts.filter(p => p.category === cat)
      : mockPosts.slice();
    // 최신순
    data.sort((a,b)=> (b.createdAt > a.createdAt ? 1 : -1));
    return data;
  }
  return [];
}

// ---------- 렌더 ----------
function setActiveCategory(cat){
  $$(".sidebar a").forEach(a=>{
    a.classList.toggle("active", a.getAttribute("href").includes(cat));
  });
  $(".board-header h2").textContent = labelOf(cat) + " - 게시판";
}

function labelOf(cat){
  return {
    notice:"공지",
    free:"자유",
    question:"질문",
    tips:"팁",
    all:"전체"
  }[cat] || cat;
}

function renderList(items){
  const ul = $(".post-list");
  ul.innerHTML = "";

  if (!items.length){
    ul.innerHTML = `<li class="post-item"><span class="title">게시글이 없습니다.</span>
      <span class="author"></span><span class="meta"></span></li>`;
    return;
  }

  const frag = document.createDocumentFragment();
  items.forEach(p=>{
    const li = document.createElement("li");
    li.className = "post-item";
    li.innerHTML = `
      <span class="title" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</span>
      <span class="author">${escapeHtml(p.author || "익명")}</span>
      <span class="meta">
        <span class="badge ${p.category}">${labelOf(p.category)}</span>
        <span class="date">${escapeHtml(p.createdAt || fmt(Date.now()))}</span>
      </span>
    `;
    // 제목 클릭 시 상세로 이동(추후 post.html?id=XXX 사용)
    li.querySelector(".title").addEventListener("click", ()=>{
      location.href = `post.html?id=${p.id}`;
    });
    frag.appendChild(li);
  });
  ul.appendChild(frag);
}

function escapeHtml(s=""){
  return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// ---------- 데이터 로드 ----------
async function load(category){
  // 카테고리 반영
  state.category = category;
  setActiveCategory(category);

  // 데이터 가져오기
  const qs = `?category=${encodeURIComponent(category)}`;
  state.posts = await api(`/api/feed${qs}`);

  // 렌더
  renderList(state.posts);

  // URL 동기화(SPA 느낌)
  const url = new URL(location.href);
  url.searchParams.set("category", category);
  history.replaceState(null, "", url);
}

// ---------- 이벤트 바인딩 ----------
function bind(){
  // 사이드바 카테고리
  $$(".sidebar a").forEach(a=>{
    a.addEventListener("click", e=>{
      e.preventDefault();
      const href = a.getAttribute("href");              // "?category=notice"
      const cat = new URLSearchParams(href.slice(1)).get("category");
      load(cat || "notice");
    });
  });

  // 글쓰기 버튼(지금은 안내만)
  $(".write-btn")?.addEventListener("click", ()=>{
    alert("글쓰기는 다음 단계에서 붙입니다!");
  });
}

// ---------- 시작 ----------
document.addEventListener("DOMContentLoaded", async ()=>{
  bind();
  await load(state.category);
});
