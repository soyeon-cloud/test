document.addEventListener('DOMContentLoaded', () => {
    console.log('[app] loaded');

    // ===== DOM =====
    const $ = (s) => document.querySelector(s);
    const split = $('#split');

    // File UI
    const fileInput = $('#fileInput');
    const btnPick = $('#btnPick');
    const btnPick2 = $('#btnPick2');
    const btnClear = $('#btnClear');
    const btnExport = $('#btnExport');
    const dropzone = $('#dropzone');
    const placeholder = $('#placeholder');
    const img = $('#img');
    const pdf = $('#pdf');
    const ink = $('#ink');

    // Ink controls
    const drawToggle = $('#drawToggle');
    const penSize = $('#penSize');
    const penColor = $('#penColor');
    const btnUndo = $('#btnUndo');
    const btnRedo = $('#btnRedo');
    const btnEraser = $('#btnEraser');

    // Notes
    const note = $('#note');
    const preview = $('#preview');
    const previewToggle = $('#previewToggle');
    const btnCopy = $('#btnCopy');
    const btnSave = $('#btnSave');

    // State
    let currentFile = null; // { name, type, url }
    let strokes = [];       // [{points:[{x,y}], size,color, erase:false}]
    let redoStack = [];
    let drawing = false;
    let erasing = false;
    let ctx = null;

    // ===== Helpers =====
    function key() { return 'note::' + (currentFile?.name || 'default'); }
    function sameDisplay(el, v) { el.style.display = v; }

    // ===== File trigger =====
    btnPick?.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            if (fileInput?.showPicker) fileInput.showPicker();
            else fileInput?.click();
        } catch (err) {
            console.error(err);
            alert('파일 선택 창을 열 수 없습니다. 브라우저 보안 설정을 확인해 주세요.');
        }
    });
    btnPick2?.addEventListener('click', (e) => {
        e.preventDefault();
        if (fileInput?.showPicker) fileInput.showPicker(); else fileInput?.click();
    });
    fileInput?.addEventListener('change', handleFiles);

    // 드래그 해서 넣는 코드
    ['dragenter', 'dragover'].forEach(evt =>
        dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('hover'); })
    );
    ['dragleave', 'drop'].forEach(evt =>
        dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('hover'); })
    );
    dropzone.addEventListener('drop', (e) => {
        const f = e.dataTransfer?.files?.[0];
        if (f) openFile(f);
    });

    // Clear
    btnClear?.addEventListener('click', () => { clearStage(); note.value = ''; saveNote(); });

    // ===== File handlers =====
    function handleFiles() {
        const f = fileInput.files && fileInput.files[0];
        if (!f) { console.warn('handleFiles: no file'); return; }
        console.log('[app] selected:', f.name, f.type, f.size);
        openFile(f);
    }

    function openFile(f) {
        const url = URL.createObjectURL(f);
        placeholder.style.display = 'none';
        strokes = []; redoStack = [];

        if (f.type.startsWith('image/')) {
            sameDisplay(pdf, 'none');
            sameDisplay(img, 'block');
            sameDisplay(ink, 'block');
            img.onload = () => resizeCanvasToImage();
            img.src = url;

        } else if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
            sameDisplay(img, 'none');
            sameDisplay(ink, 'none');
            sameDisplay(pdf, 'block');
            pdf.setAttribute('data', url + '#toolbar=1&navpanes=0&view=FitH');

        } else {
            alert('PDF 또는 이미지 파일만 지원합니다.');
            return;
        }

        currentFile = { name: f.name, type: f.type, url };
        loadNote();
    }

    function clearStage() {
        img.src = ''; pdf.removeAttribute('data');
        placeholder.style.display = 'grid';
        sameDisplay(img, 'none'); sameDisplay(pdf, 'none'); sameDisplay(ink, 'none');
        strokes = []; redoStack = []; redraw();
    }

    // 이미지 일때
    function resizeCanvasToImage() {
        // 이미지가 렌더된 실제 크기에 맞춰 캔버스 사이즈  맟추기
        const r = img.getBoundingClientRect();
        ink.width = Math.max(1, Math.floor(r.width));
        ink.height = Math.max(1, Math.floor(r.height));
        
        ink.style.left = img.offsetLeft + 'px';
        ink.style.top = img.offsetTop + 'px';
        ctx = ink.getContext('2d');
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        redraw();
    }

    window.addEventListener('resize', () => {
        if (img.style.display === 'block' && img.complete) resizeCanvasToImage();
    });

    ink.addEventListener('pointerdown', (e) => {
        if (!drawToggle.checked) return;
        drawing = true; ink.setPointerCapture(e.pointerId);
        const p = getPos(e);
        const stroke = { points: [p], size: +penSize.value, color: penColor.value, erase: erasing };
        strokes.push(stroke); redoStack = []; redraw();
    });
    ink.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = getPos(e); const cur = strokes[strokes.length - 1];
        cur.points.push(p); redraw();
    });
    ink.addEventListener('pointerup', () => { drawing = false; });

    function getPos(e) {
        const r = ink.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function redraw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, ink.width, ink.height);
        for (const s of strokes) {
            ctx.save();
            ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
            ctx.strokeStyle = s.color; ctx.lineWidth = s.size;
            ctx.beginPath();
            const pts = s.points;
            if (!pts.length) { ctx.restore(); continue; }
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
            ctx.restore();
        }
    }

    btnEraser?.addEventListener('click', () => { erasing = !erasing; btnEraser.classList.toggle('active', erasing); });
    btnUndo?.addEventListener('click', () => { if (strokes.length) { redoStack.push(strokes.pop()); redraw(); } });
    btnRedo?.addEventListener('click', () => { if (redoStack.length) { strokes.push(redoStack.pop()); redraw(); } });

    btnExport?.addEventListener('click', () => {
        if (img.style.display !== 'block') { alert('이미지에서만 지원됩니다. PDF는 브라우저 인쇄/저장을 사용하세요.'); return; }
        const off = document.createElement('canvas');
        off.width = img.naturalWidth; off.height = img.naturalHeight;
        const octx = off.getContext('2d');

        const base = new Image();
        base.onload = () => {
            octx.drawImage(base, 0, 0, off.width, off.height);
            const sx = off.width / ink.width, sy = off.height / ink.height;
            octx.lineCap = 'round'; octx.lineJoin = 'round';
            for (const s of strokes) {
                octx.save();
                octx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
                octx.strokeStyle = s.color; octx.lineWidth = s.size * ((sx + sy) / 2);
                octx.beginPath();
                const pts = s.points; if (!pts.length) { octx.restore(); continue; }
                octx.moveTo(pts[0].x * sx, pts[0].y * sy);
                for (let i = 1; i < pts.length; i++) octx.lineTo(pts[i].x * sx, pts[i].y * sy);
                octx.stroke(); octx.restore();
            }
            const url = off.toDataURL('image/png');
            const a = document.createElement('a'); a.href = url; a.download = (currentFile?.name || 'annotated') + '_annotated.png'; a.click();
        };
        base.src = img.src;
    });

    // 노트 필기
    function loadNote() { const v = localStorage.getItem(key()); if (v != null) { note.value = v; if (previewToggle.checked) renderPreview(); } }
    function saveNote() { localStorage.setItem(key(), note.value || ''); }

    btnCopy?.addEventListener('click', () => { note.select(); document.execCommand('copy'); alert('노트를 클립보드에 복사했어요'); });
    btnSave?.addEventListener('click', () => { saveNote(); alert('저장 완료'); });
    previewToggle?.addEventListener('change', () => {
        const on = previewToggle.checked;
        preview.style.display = on ? 'block' : 'none';
        note.style.display = on ? 'none' : 'block';
        if (on) renderPreview();
    });
    note?.addEventListener('input', () => { if (previewToggle.checked) renderPreview(); });

    function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
    function md(s) {
        s = escapeHtml(s || '');
        s = s.replace(/^###### (.*)$/gm, '<h6>$1</h6>') //정규 표현식 이용
            .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
            .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
            .replace(/^### (.*)$/gm, '<h3>$1</h3>')
            .replace(/^## (.*)$/gm, '<h2>$1</h2>')
            .replace(/^# (.*)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+?)`/g, '<code>$1</code>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>');
        s = s.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        return '<p>' + s + '</p>';
    }
    function renderPreview() { preview.innerHTML = md(note.value); }

    // 좌우 조절 하여 가지고 만드는 것 
    (function initSplitter() {
        const gutter = document.createElement('div');
        gutter.className = 'gutter';
        split.appendChild(gutter);
        let dragging = false, startX = 0, startW = 0;
        gutter.addEventListener('mousedown', (e) => { dragging = true; startX = e.clientX; startW = split.children[0].getBoundingClientRect().width; document.body.classList.add('no-select'); });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const total = split.getBoundingClientRect().width;
            const left = Math.max(280, Math.min(total - 240, startW + dx));
            const lPct = (left / total) * 100;
            split.style.gridTemplateColumns = lPct + '% ' + (100 - lPct) + '%';
            if (img.style.display === 'block') resizeCanvasToImage();
        });
        window.addEventListener('mouseup', () => { dragging = false; document.body.classList.remove('no-select'); });
    })();

    //노트 아이템의 초기화 버튼 
    const v = localStorage.getItem(key()); if (v) note.value = v;
});
