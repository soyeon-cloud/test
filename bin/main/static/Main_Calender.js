const year = 2025;
const month = 11; 

const calendar = document.getElementById("calendar");

// 오늘 날짜 정보
const now = new Date();
const todayYear = now.getFullYear();
const todayMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하니까 +1
const todayDate = now.getDate();

// 제목 (2025년 11월 이런거)
const title = document.createElement("h3");
title.textContent = `${year}년 ${month}월`;
title.style.textAlign = "center";
title.style.color = "#357dad";
calendar.appendChild(title);


const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
const headerRow = document.createElement("div");
headerRow.className = "calendar-header";

daysOfWeek.forEach(day => {
    const cell = document.createElement("div");
    cell.textContent = day;
    headerRow.appendChild(cell);
});
calendar.appendChild(headerRow);


const firstDay = new Date(year, month - 1, 1).getDay();
const lastDate = new Date(year, month, 0).getDate();

const grid = document.createElement("div");
grid.className = "calendar-grid";


for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell empty";
    grid.appendChild(empty);
}


for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    cell.textContent = date;

    if (year === todayYear && month === todayMonth && date === todayDate) {
        cell.classList.add("today");
    }
    //클릭 이벤트 추가
    cell.addEventListener("click", (e) => {
        selectedDate = `${year}-${String(month).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
        console.log("선택된 날짜:", selectedDate, " (엘리먼트:)", e.currentTarget);

        // UI 선택 강조
        document.querySelectorAll(".calendar-cell").forEach(c => c.classList.remove("selected"));
        cell.classList.add("selected");

        // 할 일 불러오기 (에러가 있어도 실행 중단 안되게 try/catch)
        try {
            loadTodos(selectedDate);
        } catch (err) {
            console.error("loadTodos 호출 중 에러:", err);
        }
    });

    grid.appendChild(cell);
}

calendar.appendChild(grid);

