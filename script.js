// --- 測驗資料定義 (假設圖片名稱為 .jpg) ---
const questions = [
    { image: "q1.jpg", values: [3, 1, 0, 5] },
    { image: "q2.jpg", values: [5, 1, 3, 4] },
    { image: "q3.jpg", values: [2, 4, 3, 1] },
    { image: "q4.jpg", values: [1, 5, 3, 0] },
    { image: "q5.jpg", values: [5, 1, 3, 2] },
    { image: "q6.jpg", values: [1, 3, 4, 0] }
];

// --- 測驗結果定義 ---
const results = [
    // 0~4 分
    { scoreRange: [0, 4], title: "💎 沉靜的藍寶石", description: "你內斂、觀察力強...", resultImage: "result_blue.jpg" },
    // ... 依此類推，請確保您有六張結果圖
    { scoreRange: [25, 30], title: "⚡ 閃耀的黃水晶", description: "...", resultImage: "result_gold.jpg" }
];

// --- 狀態追蹤變數 ---
let currentQuestionIndex = 0;
let totalScore = 0;
let finalResult = null; // 用於儲存最終結果物件

document.addEventListener('DOMContentLoaded', () => {

    // --- 元素選取 ---
    const mainImageEl = document.getElementById('main-image');
    const hotspotAreaEl = document.getElementById('hotspot-area');
    const resultTextAreaEl = document.getElementById('result-text-area');
    const progressEl = document.getElementById('progress');
    const resultTitleEl = document.getElementById('result-title');
    const resultDescEl = document.getElementById('result-description');
    const hotspotA = document.getElementById('hotspot-a');
    const hotspotButtons = document.querySelectorAll('.hotspot');


    // --- Hotspot 狀態管理 ---

    /** 設定 Hotspot 樣式和點擊功能 */
    function setHotspots(mode, clickHandler) {
        // 隱藏所有 Hotspot
        hotspotButtons.forEach(btn => {
            btn.classList.remove('active', 'q-btn', 'single-btn');
            btn.onclick = null;
        });

        if (mode === 'quiz') {
            // 題目模式：顯示所有 4 個 Hotspot，並設定為題目樣式
            hotspotButtons.forEach((btn, idx) => {
                btn.classList.add('active', 'q-btn');
            });
            // 點擊事件在 loadQuestion 裡動態設置
        } else if (mode === 'single') {
            // 單按鈕模式：只顯示 hotspot-a，並設定為單按鈕樣式
            hotspotA.classList.add('active', 'single-btn');
            hotspotA.onclick = clickHandler;
        }
    }


    // --- 頁面邏輯 ---

    /** 封面頁進入導言頁 */
    function showIntroduction() {
        mainImageEl.src = "intro.jpg";
        setHotspots('single', startQuiz);
    }

    /** 開始測驗：載入第一道題目 */
    window.startQuiz = function() {
        currentQuestionIndex = 0;
        totalScore = 0;
        loadQuestion(currentQuestionIndex);
        resultTextAreaEl.classList.remove('active'); // 確保結果區隱藏
        progressEl.classList.remove('hidden'); 
    }

    /** 載入指定索引的題目圖片 */
    function loadQuestion(index) {
        if (index >= questions.length) {
            showGoToResult(); // 答完最後一題，進入中繼頁
            return;
        }

        const q = questions[index];
        
        progressEl.textContent = `第 ${index + 1}/${questions.length} 題`;
        mainImageEl.src = q.image; 
        
        setHotspots('quiz'); // 設定為 Hotspot 答題模式
        
        // 設定 Hotspot 按鈕的點擊事件和分數
        hotspotButtons.forEach((btn, idx) => {
            const scoreValue = q.values[idx]; 
            btn.onclick = () => handleAnswer(scoreValue);
        });
    }

    /** 處理使用者點擊的答案 */
    function handleAnswer(value) {
        totalScore += value;
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }

    /** 題目答完，進入「確認結果」中繼頁 */
    function showGoToResult() {
        // 找出最終結果
        finalResult = results.find(r => 
            totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]
        );

        mainImageEl.src = "gotoresult.jpg"; // 顯示前往結果圖片
        progressEl.classList.add('hidden');
        setHotspots('single', showResult); // 點擊單一按鈕進入結果
    }

    /** 顯示最終結果頁 */
    function showResult() {
        mainImageEl.src = finalResult.resultImage || 'default_result.jpg'; 
        
        resultTitleEl.textContent = finalResult.title;
        resultDescEl.textContent = finalResult.description;
        
        resultTextAreaEl.classList.add('active'); // 顯示結果文字區
        setHotspots('none'); // 隱藏所有 Hotspot
    }


    // --- 程式初始化 (網站載入) ---
    setHotspots('single', showIntroduction); // 封面頁點擊「開始測驗」
    resultTextAreaEl.classList.remove('active'); // 初始隱藏結果區
});
