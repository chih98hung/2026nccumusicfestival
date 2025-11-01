// --- 外部連結設定 ---
// 【🚨 區塊 1：請修改這裡的外部連結 🚨】
// 請將這裡的三個佔位符替換為您實際的外部網址！
const LINK_GROUP_A = "https://your-external-link-A.com/lesson"; 
const LINK_GROUP_B = "https://your-external-link-B.com/lesson";
const LINK_GROUP_C = "https://your-external-link-C.com/lesson";

// --- 測驗結果定義 (與您的圖片名稱和連結完全對應) ---
// 【🚨 區塊 2：請檢查這裡的圖片名稱和分數範圍 🚨】
const results = [
    // 0~4 分 -> 靜霧 (連結 A)
    { scoreRange: [0, 4], title: "靜霧", resultImage: "result_foggy.jpg", link: LINK_GROUP_A },
    // 5~9 分 -> 晨曦 (連結 A)
    { scoreRange: [5, 9], title: "晨曦", resultImage: "result_dawn.jpg", link: LINK_GROUP_A }, 
    // 10~14 分 -> 辰星 (連結 B)
    { scoreRange: [10, 14], title: "辰星", resultImage: "result_star.jpg", link: LINK_GROUP_B },
    // 15~19 分 -> 幻月 (連結 B)
    { scoreRange: [15, 19], title: "幻月", resultImage: "result_moon.jpg", link: LINK_GROUP_B },
    // 20~24 分 -> 朝陽 (連結 C)
    { scoreRange: [20, 24], title: "朝陽", resultImage: "result_sun.jpg", link: LINK_GROUP_C },
    // 25~30 分 -> 餘暉 (連結 C)
    { scoreRange: [25, 30], title: "餘暉", resultImage: "result_sunset.jpg", link: LINK_GROUP_C }
];

// --- 測驗題目資料 (圖片名稱與分數權重) ---
// 【🚨 區塊 3：請檢查這裡的圖片名稱 🚨】
// 確保您的題目圖片名稱是 q1.jpg, q2.jpg...
const questions = [
    { image: "q1.jpg", values: [3, 1, 0, 5] },
    { image: "q2.jpg", values: [5, 1, 3, 4] },
    { image: "q3.jpg", values: [2, 4, 3, 1] },
    { image: "q4.jpg", values: [1, 5, 3, 0] },
    { image: "q5.jpg", values: [5, 1, 3, 2] },
    { image: "q6.jpg", values: [1, 3, 4, 0] }
];

// --- 狀態追蹤變數 (保持不變) ---
let currentQuestionIndex = 0;
let totalScore = 0;
let finalResult = null; 
let currentExternalLink = "";

// 確保所有程式碼在 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', () => {

    // --- 元素選取 (保持不變) ---
    const mainImageEl = document.getElementById('main-image');
    const progressEl = document.getElementById('progress');
    const hotspotA = document.getElementById('hotspot-a');
    const hotspotB = document.getElementById('hotspot-b');
    const hotspotC = document.getElementById('hotspot-c');
    const hotspotButtons = document.querySelectorAll('.hotspot');
    
    // --- 函式定義 ---

    /** 設定 Hotspot 樣式和點擊功能 */
    function setHotspots(mode, clickHandler) {
        hotspotButtons.forEach(btn => {
            btn.classList.remove('active', 'q-btn', 'single-btn', 'result-btn');
            btn.onclick = null; 
        });

        if (mode === 'quiz') {
            hotspotButtons.forEach((btn) => {
                btn.classList.add('active', 'q-btn');
            });
        } else if (mode === 'single') {
            hotspotA.classList.add('active', 'single-btn');
            hotspotA.onclick = clickHandler; 
        } else if (mode === 'result') {
            hotspotA.classList.add('active', 'result-btn');
            hotspotB.classList.add('active', 'result-btn');
            hotspotC.classList.add('active', 'result-btn');
            
            hotspotA.onclick = shareResult;
            hotspotB.onclick = location.reload;
            hotspotC.onclick = goToExternalLink;
        }
    }


    /** 封面頁進入導言頁 */
    function showIntroduction() {
        // 【圖片：intro.jpg】
        mainImageEl.src = "intro.jpg"; 
        setHotspots('single', startQuiz);
    }

    /** 開始測驗：載入第一道題目 */
    window.startQuiz = function() {
        currentQuestionIndex = 0;
        totalScore = 0;
        loadQuestion(currentQuestionIndex);
        progressEl.classList.remove('hidden'); 
    }

    /** 載入指定索引的題目圖片 */
    function loadQuestion(index) {
        if (index >= questions.length) {
            showGoToResult();
            return;
        }

        const q = questions[index];
        progressEl.textContent = `第 ${index + 1}/${questions.length} 題`;
        // 【圖片：q1.jpg ~ q6.jpg】
        mainImageEl.src = q.image; 
        
        setHotspots('quiz');
        
        hotspotButtons.forEach((btn, idx) => {
            const scoreValue = q.values[idx]; 
            btn.onclick = () => handleAnswer(scoreValue);
        });
    }

    /** 處理使用者點擊的答案 (保持不變) */
    function handleAnswer(value) {
        totalScore += value;
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }

    /** 題目答完，進入「確認結果」中繼頁 */
    function showGoToResult() {
        finalResult = results.find(r => 
            totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]
        );

        currentExternalLink = finalResult.link;
        
        // 【圖片：gotoresult.jpg】
        mainImageEl.src = "gotoresult.jpg";
        progressEl.classList.add('hidden');
        setHotspots('single', showResult);
    }

    /** 顯示最終結果頁 */
    function showResult() {
        // 【圖片：result_*.jpg】
        mainImageEl.src = finalResult.resultImage || 'default_result.jpg'; 
        setHotspots('result'); 
    }

    /** 分享功能 (保持不變) */
    function shareResult() {
        if (navigator.share) {
            navigator.share({
                title: finalResult.title + ' - 日曆心理測驗',
                text: '我在日曆心理測驗中測出了「' + finalResult.title + '」！快來看看你的內在色彩是什麼吧。',
                url: window.location.href,
            }).catch((error) => console.log('分享失敗', error));
        } else {
            alert('請長按或右鍵儲存圖片後，手動分享至社群媒體。');
        }
    }

    /** 前往外部講座連結 (使用客製化連結) */
    function goToExternalLink() {
        if (currentExternalLink) {
            window.open(currentExternalLink, '_blank');
        } else {
            alert('連結尚未設定。');
        }
    }

    // --- 程式初始化 (網站載入) ---
    // 【圖片：cover.jpg】
    setHotspots('single', showIntroduction); 
});
