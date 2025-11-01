// --- 測驗資料定義 (只有圖片路徑和分數邏輯) ---
// 注意：這裡的 value 必須與 HTML 中 .option-btn 的 data-value 一致
const questions = [
    { text: "Q1", image: "q1.png", values: [3, 1, 0, 5] },
    { text: "Q2", image: "q2.png", values: [5, 1, 3, 4] },
    { text: "Q3", image: "q3.png", values: [2, 4, 3, 1] },
    { text: "Q4", image: "q4.png", values: [1, 5, 3, 0] },
    { text: "Q5", image: "q5.png", values: [5, 1, 3, 2] },
    { text: "Q6", image: "q6.png", values: [1, 3, 4, 0] }
];

// --- 測驗結果定義 (六選一，根據總分範圍) ---
const results = [
    // 0~4 分
    { scoreRange: [0, 4], title: "💎 沉靜的藍寶石", description: "你內斂、觀察力強，是個思想深邃的哲學家。喜歡獨處，注重內心的平靜與穩定，不輕易表達情感，但一旦建立連結，你的關係將堅不可摧。", resultImage: "result_blue.png" },
    // 5~9 分
    { scoreRange: [5, 9], title: "🌿 穩定的翡翠", description: "你務實、可靠，追求結構和秩序。你腳踏實地，善於分析，是團隊中不可或缺的基石。你不太喜歡突然的改變，傾向於按部就班地達成目標。", resultImage: "result_green.png" },
    // 10~14 分
    { scoreRange: [10, 14], title: "💡 透明的鑽石", description: "你善於溝通與協調，擁有平衡的個性。你既能理性思考，也能兼顧情感，是個優秀的橋樑。你擅長適應環境，總能保持客觀公正。", resultImage: "result_white.png" },
    // 15~19 分
    { scoreRange: [15, 19], title: "☀️ 溫暖的琥珀", description: "你熱心、友善，是天生的社交家。你樂於助人，擁有極佳的同理心。你的周圍總是充滿歡笑和正能量，人們喜歡與你分享心事。", resultImage: "result_yellow.png" },
    // 20~24 分
    { scoreRange: [20, 24], title: "🔥 熱情的紅寶石", description: "你充滿活力、衝動且富有行動力。你傾向於憑直覺行事，熱衷於探索和冒險。你勇於表達自我，擁有強大的個人魅力和領導潛力。", resultImage: "result_red.png" },
    // 25~30 分
    { scoreRange: [25, 30], title: "⚡ 閃耀的黃水晶", description: "你外向、充滿自信，追求刺激與樂趣。你擅長激勵他人，是群體中的點火者。你擁有強烈的目標導向，且不畏懼挑戰，隨時準備好迎接新的驚喜。", resultImage: "result_gold.png" }
];

// --- 狀態追蹤變數 ---
let currentQuestionIndex = 0;
let totalScore = 0;

// --- 元素選取 ---
const mainImageEl = document.getElementById('main-image');
const mainButtonEl = document.getElementById('main-button');
const controlPageEl = document.getElementById('control-page');
const quizPageEl = document.getElementById('quiz-page');
const resultPageEl = document.getElementById('result-page');
const progressEl = document.getElementById('progress');
const resultTitleEl = document.getElementById('result-title');
const resultDescEl = document.getElementById('result-description');
const optionButtons = document.querySelectorAll('.option-btn'); // 選項按鈕集合

// --- 導航函數 ---

/** 隱藏/顯示頁面 */
function showPage(pageId) {
    [controlPageEl, quizPageEl, resultPageEl].forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

/** 封面頁進入導言頁 */
function showIntroduction() {
    mainImageEl.src = "intro.png"; // 切換到導言圖片
    mainButtonEl.onclick = startQuiz; // 更改按鈕功能
    mainButtonEl.textContent = "我準備好了！";
    showPage('control-page');
}

/** 開始測驗：初始化並載入第一道題目 */
function startQuiz() {
    currentQuestionIndex = 0;
    totalScore = 0;
    loadQuestion(currentQuestionIndex);
    showPage('quiz-page');
}

/** 載入指定索引的題目圖片 */
function loadQuestion(index) {
    if (index >= questions.length) {
        showResult();
        return;
    }

    const q = questions[index];
    
    // 1. 更新進度顯示
    progressEl.textContent = `第 ${index + 1}/${questions.length} 題`;
    
    // 2. 切換圖片
    mainImageEl.src = q.image;
    
    // 3. 重新設定選項按鈕的點擊事件 (確保使用當前題目的分數)
    optionButtons.forEach((btn, idx) => {
        const scoreValue = q.values[idx]; // 從 questions 陣列中取出對應的分數
        btn.onclick = () => handleAnswer(scoreValue);
    });
}

/** 處理使用者點擊的答案 */
function handleAnswer(value) {
    totalScore += value; // 累積分數
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex); // 載入下一題或顯示結果
}

/** 顯示最終結果 */
function showResult() {
    // 根據總分找到對應的結果
    const finalResult = results.find(r => 
        totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]
    );

    // 顯示結果圖片
    mainImageEl.src = finalResult.resultImage || 'default_result.png'; // 假設您會準備結果圖片
    
    resultTitleEl.textContent = finalResult.title;
    resultDescEl.textContent = finalResult.description;
    
    // 顯示結果頁
    showPage('result-page');
}


// 初始化頁面顯示
showPage('control-page');
