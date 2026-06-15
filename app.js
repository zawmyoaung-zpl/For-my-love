// ၁။ Page နှင့် Navigation ဆိုင်ရာ Variable များ
const pages = ['main-menu-page', 'detail-page', 'album-page', 'wishes-page', 'video-page'];
const menuLinks = document.querySelectorAll('.menu-list a');
const videoElements = document.querySelectorAll('#video-page video');

// Page ID နှင့် Audio ID ချိတ်ဆက်မှု
const pageAudios = {
    'main-menu-page': 'audio-home',
    'detail-page': 'audio-luv',
    'album-page': 'audio-memories',
    'wishes-page': 'audio-wishes'
};

// ၂။ Audio နှင့် Video အားလုံးကို ရပ်တန့်သည့် Function
function stopAllMedia() {
    // Audio အားလုံးကို ရပ်
    Object.values(pageAudios).forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    // Video အားလုံးကို ရပ်
    videoElements.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
}

// ၃။ Page ပြောင်းသည့် Function
function showPage(pageId) {
    // အရင်ဆုံးရှိသမျှ Audio/Video အကုန်ရပ်
    stopAllMedia();

    // Page အားလုံးကို ဖျောက်
    pages.forEach(id => {
        const p = document.getElementById(id);
        if (p) p.classList.add('hidden');
    });
    
    // ရွေးထားသည့် Page ကို ပြ
    const target = document.getElementById(pageId);
    if (target) target.classList.remove('hidden');

    // Active Menu ပြောင်းရန်
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // ရောက်သွားတဲ့ Page မှာ Audio ရှိရင် ဖွင့်မယ်
    if (pageAudios[pageId]) {
        const currentAudio = document.getElementById(pageAudios[pageId]);
        if (currentAudio) {
            currentAudio.play().catch(e => console.log("Audio play blocked:", e));
        }
    }
}

// ၄။ Video တစ်ခုဖွင့်ရင် ကျန်တဲ့ Video တွေ အလိုအလျောက် ရပ်စေရန်
videoElements.forEach(video => {
    video.addEventListener('play', () => {
        videoElements.forEach(otherVideo => {
            if (otherVideo !== video) {
                otherVideo.pause();
                // video တစ်ခုဖွင့်ရင် background music ကိုပါ ရပ်ချင်ရင် အောက်က line ကို သုံးနိုင်ပါတယ်
                stopAllAudiosOnly(); 
            }
        });
    });
});

// Audio သီးသန့်ရပ်ဖို့ function (Video ဖွင့်ချိန် သုံးရန်)
function stopAllAudiosOnly() {
    Object.values(pageAudios).forEach(id => {
        const audio = document.getElementById(id);
        if (audio) audio.pause();
    });
}

// ၅။ Menu Click Events
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.getAttribute('data-page'));
    });
});

// App စဖွင့်ချိန်
window.onload = () => {
    showPage('main-menu-page');
};

// ၆။ Matrix Waterfall Effect
const canvas = document.getElementById('matrixCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const textToDisplay = "HAPPYBIRTHDAY";
    const fontSize = 14;
    let columns;
    let drops = [];
    let charIndices = [];

    function setupMatrix() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        drops = [];
        charIndices = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100;
            charIndices[x] = 0;
        }
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0F0";
        ctx.font = "bold " + fontSize + "px monospace";

        for (let i = 0; i < columns; i++) {
            const text = textToDisplay[charIndices[i]];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                charIndices[i] = 0;
            }
            drops[i]++;
            charIndices[i] = (charIndices[i] + 1) % textToDisplay.length;
        }
    }

    window.addEventListener('resize', setupMatrix);
    setupMatrix();
    setInterval(drawMatrix, 33);
}
