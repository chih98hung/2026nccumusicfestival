// --- 測驗資料定義 (假設圖片名稱為 .jpg) ---
const questions = [
    { image: "q1.jpg", values: [3, 1, 0, 5] },
    { image: "q2.jpg", values: [5, 1, 3, 4] },
    { image: "q3.jpg", values: [2, 4, 3, 1] },
    { image: "q4.jpg", values: [1, 5, 3, 0] },
    { image: "q5.jpg", values: [5, 1, 3, 2] },
    { image: "q6.jpg", values: [1, 3, 4, 0] }
];

// --- 測驗結果定義 (與您的圖片名稱完全對應) ---
const results = [
    // 0~4 分 -> 霧 (foggy)
    { scoreRange: [0, 4], title: "靜霧", resultImage: "result_foggy.jpg" },
    // 5~9 分 -> 晨 (dawn)
    { scoreRange: [5, 9], title: "晨曦", resultImage: "result_dawn.jpg" },
    // 10~14 分 -> 星 (star)
    { scoreRange: [10, 14], title: "辰星", resultImage: "result_star.jpg" },
    // 15~19 分 -> 月 (moon)
    { scoreRange: [15, 19], title: "幻月", resultImage: "result_moon.jpg" },
    // 20~24 分 -> 陽 (sun)
    { scoreRange: [20, 24], title: "朝陽", resultImage: "result_sun.jpg" },
    // 25~30 分 -> 暉 (sunset)
    { scoreRange: [25, 30], title: "餘暉", resultImage: "result_sunset.jpg" }
];

// --- 外部連結設定 ---
// 這裡請替換成您實際的網站連結！
const EXTERNAL_LINK = "https://your-event-website.com/";


// --- 狀態追蹤變數 (承襲上次設定) ---
let currentQuestionIndex = 0;
let totalScore = 0;
let finalResult = null; 

document.addEventListener('DOMContentLoaded', () => {

    // --- 元素選取 ---
    const mainImageEl = document.getElementById('main-image');
    const progressEl = document.getElementById('progress');
    const hotspotA = document.getElementById('hotspot-a');
    const hotspotB = document.getElementById('hotspot-b');
    const hotspotC = document.getElementById('hotspot-c');
    const hotspotButtons = document.querySelectorAll('.hotspot');


    // --- Hotspot 狀態管理 ---

    /** 設定 Hotspot 樣式和點擊功能 */
    function setHotspots(mode, clickHandler) {
        // 隱藏所有 Hotspot 並清除樣式
        hotspotButtons.forEach(btn => {
            btn.classList.remove('active', 'q-btn', 'single-btn', 'result-btn');
            btn.onclick = null;
        });

        if (mode === 'quiz') {
            // 題目模式：顯示所有 4 個 Hotspot，並設定為題目樣式
            hotspotButtons.forEach((btn) => {
                btn.classList.add('active', 'q-btn');
            });
            // 點擊事件在 loadQuestion 裡動態設置
        } else if (mode === 'single') {
            // 單按鈕模式：只顯示 hotspot-a
            hotspotA.classList.add('active', 'single-btn');
            hotspotA.onclick = clickHandler;
        } else if (mode === 'result') {
            // 結果頁模式：顯示 A, B, C 三個結果按鈕
            hotspotA.classList.add('active', 'result-btn');
            hotspotB.classList.add('active', 'result-btn');
            hotspotC.classList.add('active', 'result-btn');
            
            // 設定結果頁三個按鈕的功能
            hotspotA.onclick = shareResult;        // 分享
            hotspotB.onclick = location.reload;    // 再玩一次
            hotspotC.onclick = goToExternalLink;   // 報名講座
        }
    }


    // --- 頁面功能函數 ---
    
    // (showIntroduction, startQuiz, loadQuestion, handleAnswer 函數保持不變)
    window.showIntroduction = function() {
        mainImageEl.src = "intro.jpg"; 
        setHotspots('single', startQuiz);
    }
    
    window.startQuiz = function() {
        currentQuestionIndex = 0;
        totalScore = 0;
        loadQuestion(currentQuestionIndex);
        progressEl.classList.remove('hidden'); 
    }
    
    function loadQuestion(index) {
        if (index >= questions.length) {
            showGoToResult();
            return;
        }

        const q = questions[index];
        progressEl.textContent = `第 ${index + 1}/${questions.length} 題`;
        mainImageEl.src = q.image; 
        
        setHotspots('quiz');
        
        hotspotButtons.forEach((btn, idx) => {
            const scoreValue = q.values[idx]; 
            btn.onclick = () => handleAnswer(scoreValue);
        });
    }

    function handleAnswer(value) {
        totalScore += value;
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }

    function showGoToResult() {
        finalResult = results.find(r => 
            totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]
        );

        mainImageEl.src = "gotoresult.jpg";
        progressEl.classList.add('hidden');
        setHotspots('single', showResult);
    }
    
    // --- 新增：結果頁功能 ---
    
    /** 顯示最終結果頁 */
    function showResult() {
        mainImageEl.src = finalResult.resultImage || 'default_result.jpg'; 
        // 顯示結果圖片後，設定三個功能按鈕 Hotspot
        setHotspots('result'); 
    }

    /** 分享功能 (使用 Web Share API 或彈出提示) */
    function shareResult() {
        if (navigator.share) {
             // 現代瀏覽器分享 API
            navigator.share({
                title: finalResult.title + ' - 日曆心理測驗',
                text: '我在日曆心理測驗中測出了「' + finalResult.title + '」！快來看看你的內在色彩是什麼吧。',
                url: window.location.href,
            }).catch((error) => console.log('分享失敗', error));
        } else {
             // 不支援分享 API 的瀏覽器，彈出提示
            alert('請長按或右鍵儲存圖片後，手動分享至社群媒體。');
        }
    }

    /** 前往外部講座連結 */
    function goToExternalLink() {
        window.open(EXTERNAL_LINK, '_blank');
    }

    // --- 程式初始化 (網站載入) ---
    setHotspots('single', showIntroduction); 
});
