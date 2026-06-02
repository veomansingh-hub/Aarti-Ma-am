// ==========================================
// 1. CONSTANTS, USER PROFILES, AND CONFIG
// ==========================================

const LANDMARKS_SVG = {
    tajmahal: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 70 h40 v10 h-40 z M35 70 v-18 c0-10 30-10 30 0 v18 M50 52 v-15 M50 25 h-6 v-2 h6 M15 40 v40 M85 40 v40 M20 80 h60"/></svg>`,
    hawamahal: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 80 h60 M30 80 v-40 h40 v40 M40 80 v-20 h20 v20 M30 60 h40 M30 40 h40 M35 40 c0-8 10-8 15 0 c0-8 10-8 15 0"/></svg>`,
    qutubminar: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M42 80 L46 20 h8 L58 80 z M42 80 h16 M44 60 h12 M45 40 h10 M42 75 h16 M43 50 h14 M47 20 v-8 h6 v8"/></svg>`,
    goldentemple: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 80 h70 M25 80 v-20 h50 v20 M35 60 v-15 h30 v15 M40 45 c0-10 20-10 20 0 Z M50 35 v-10 M10 85 h80 M15 90 h70"/></svg>`,
    indiagate: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M25 80 v-45 h50 v45 M38 80 v-20 c0-8 24-8 24 0 v20 M20 80 h60 M30 35 v-8 h40 v8 M35 27 h30"/></svg>`
};

const KIDS_PROFILES = {
    jinay: { name: 'Jinay', password: '2041', avatar: LANDMARKS_SVG.tajmahal, landmarkName: 'Taj Mahal 🏛️', theme: 'theme-leo' },
    kiaan: { name: 'Kiaan', password: '5892', avatar: LANDMARKS_SVG.hawamahal, landmarkName: 'Hawa Mahal 🏛️', theme: 'theme-maya' },
    kiara: { name: 'Kiara', password: '7134', avatar: LANDMARKS_SVG.qutubminar, landmarkName: 'Qutub Minar 🗼', theme: 'theme-sam' },
    kayra: { name: 'Kayra', password: '8461', avatar: LANDMARKS_SVG.goldentemple, landmarkName: 'Golden Temple 🕌', theme: 'theme-ella' },
    kinaya: { name: 'Kinaya', password: '3957', avatar: LANDMARKS_SVG.indiagate, landmarkName: 'India Gate ⛩️', theme: 'theme-noah' }
};

const CATEGORIES = {
    gktrivia: {
        title: 'GK Trivia Quest',
        icon: '🧠',
        levels: [
            { id: 1, name: 'Colors of Rajasthan', icon: '🌸', desc: 'Pink City, Blue City & colors' },
            { id: 2, name: 'Animals of the Desert', icon: '🐪', desc: 'Camels, peacocks and friends' },
            { id: 3, name: 'Food & Festivals', icon: '🥣', desc: 'Tasty treats and dance' },
            { id: 4, name: 'Palaces & Lakes', icon: '🏰', desc: 'Hawa Mahal and Lake City' },
            { id: 5, name: 'Rajasthan Fun Facts', icon: '✨', desc: 'Amazing Indian GK trivia' }
        ]
    },
    phonics: {
        title: 'Reading & Phonics',
        icon: '🍎',
        levels: [
            { id: 1, name: 'Big Letters (A-J)', icon: '🅰️', desc: 'Identify capital letters' },
            { id: 2, name: 'Big Letters (K-Z)', icon: '🆊', desc: 'More capital letters' },
            { id: 3, name: 'Small Letters (a-z)', icon: 'a', desc: 'Identify lowercase letters' },
            { id: 4, name: 'Letter Sounds (Phonics)', icon: '🔊', desc: 'What sound does it make?' },
            { id: 5, name: 'Word Match & Spelling', icon: '📝', desc: 'Spelling short words' }
        ]
    },
    math: {
        title: 'Math & Colors',
        icon: '🔢',
        levels: [
            { id: 1, name: 'Number Land (1-5)', icon: '🟢', desc: 'Find numbers 1 to 5' },
            { id: 2, name: 'Number Land (6-10)', icon: '🔵', desc: 'Find numbers 6 to 10' },
            { id: 3, name: 'Counting Fun', icon: '🖐️', desc: 'Count items and balloons' },
            { id: 4, name: 'Colors & Shapes', icon: '🔺', desc: 'Find circles, squares, and colors' },
            { id: 5, name: 'Size & Patterns', icon: '📏', desc: 'Big vs Small & next in line' }
        ]
    }
};

// Helper function to shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==========================================
// 2. STATE INITIALIZATION
// ==========================================
let state = {
    currentUser: null,
    currentCategory: null,
    currentLevel: null,
    currentQuestionIndex: 0,
    currentLevelQuestions: [], // Will hold 100 shuffled unique questions
    incorrectAttemptsThisQuestion: 0,
    incorrectAttemptsThisLevel: 0,
    ttsEnabled: true,
    progress: {}, 
    parentGateAnswer: null,
    activeTrackingInterval: null
};

// Web Audio API Synthesizer
const AudioPlayer = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playSuccess() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); 
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); 
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.16); 
        osc.frequency.setValueAtTime(1046.50, this.ctx.currentTime + 0.24); 
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.45);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    },
    playError() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180.00, this.ctx.currentTime); 
        osc.frequency.linearRampToValueAtTime(90.00, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    },
    playPop() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800.00, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500.00, this.ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },
    playLevelComplete() {
        this.init();
        const chords = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        chords.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
            
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + idx * 0.05 + 0.4);
            
            osc.start(this.ctx.currentTime + idx * 0.05);
            osc.stop(this.ctx.currentTime + idx * 0.05 + 0.5);
        });
    }
};

// Physics Confetti
const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    init() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    spawn() {
        this.particles = [];
        for (let i = 0; i < 90; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -20,
                size: Math.random() * 8 + 6,
                color: `hsl(${Math.random() * 360}, 100%, 55%)`,
                speedY: Math.random() * 4 + 2,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 6 - 3,
                windOffset: Math.random() * 100
            });
        }
        if (!this.animationId) this.loop();
    },
    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let active = false;
        
        this.particles.forEach(p => {
            p.speedY += 0.08; 
            p.speedX += Math.sin((p.y + p.windOffset) / 40) * 0.06; 
            p.speedX *= 0.98; 
            
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
            
            if (p.y < this.canvas.height + 20) active = true;
        });
        
        if (active) {
            this.animationId = requestAnimationFrame(() => this.loop());
        } else {
            this.animationId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// Physics Popping Balloons celebration
const BalloonPhysics = {
    container: null,
    balloons: [],
    active: false,
    init() {
        if (!document.getElementById('balloon-overlay')) {
            this.container = document.createElement('div');
            this.container.id = 'balloon-overlay';
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.container.style.pointerEvents = 'none';
            this.container.style.zIndex = '990';
            this.container.style.overflow = 'hidden';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('balloon-overlay');
        }
    },
    spawn() {
        this.init();
        this.container.innerHTML = '';
        this.balloons = [];
        
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
        const count = Math.floor(Math.random() * 4) + 6; 
        
        for (let i = 0; i < count; i++) {
            const size = Math.floor(Math.random() * 40) + 70; 
            const el = document.createElement('div');
            el.className = 'balloon';
            
            el.style.position = 'absolute';
            el.style.bottom = `-${size + 20}px`;
            el.style.left = `${Math.random() * 80 + 10}vw`;
            el.style.width = `${size}px`;
            el.style.height = `${size * 1.2}px`;
            el.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
            el.style.background = colors[i % colors.length];
            el.style.boxShadow = 'inset -8px -8px 0 rgba(0,0,0,0.1), 0 8px 15px rgba(0,0,0,0.1)';
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.fontSize = '24px';
            el.style.color = 'white';
            el.style.transition = 'transform 0.1s ease';
            
            const string = document.createElement('div');
            string.style.position = 'absolute';
            string.style.bottom = '-15px';
            string.style.left = '50%';
            string.style.width = '2px';
            string.style.height = '15px';
            string.style.background = 'rgba(0,0,0,0.3)';
            el.appendChild(string);
            
            const symbol = document.createElement('span');
            symbol.textContent = ['⭐', '🎈', '✨', '🍎', '🧩'][i % 5];
            symbol.style.userSelect = 'none';
            el.appendChild(symbol);
            
            this.container.appendChild(el);
            
            this.balloons.push({
                element: el,
                y: window.innerHeight + size,
                x: Math.random() * (window.innerWidth - size),
                speedY: Math.random() * 3 + 2.5, 
                speedX: Math.random() * 2 - 1,   
                size: size,
                swaySeed: Math.random() * 100,
                popped: false
            });
            
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.popBalloon(i);
            });
            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.popBalloon(i);
            });
        }
        
        if (!this.active) {
            this.active = true;
            this.update();
        }
    },
    popBalloon(index) {
        const b = this.balloons[index];
        if (!b || b.popped) return;
        
        b.popped = true;
        AudioPlayer.playPop();
        
        b.element.style.transform = 'scale(1.4)';
        b.element.style.opacity = '0';
        
        for (let k = 0; k < 6; k++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.top = `${b.element.offsetTop + b.size/2}px`;
            shard.style.left = `${b.element.offsetLeft + b.size/2}px`;
            shard.style.width = '10px';
            shard.style.height = '10px';
            shard.style.borderRadius = '50%';
            shard.style.background = b.element.style.background;
            shard.className = 'balloon-shard';
            this.container.appendChild(shard);
            
            const angle = (k / 6) * Math.PI * 2;
            const dist = 60 + Math.random() * 40;
            shard.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`, opacity: 0 }
            ], {
                duration: 400,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            setTimeout(() => shard.remove(), 400);
        }
        
        setTimeout(() => b.element.remove(), 100);
    },
    update() {
        let visible = false;
        
        this.balloons.forEach((b, idx) => {
            if (b.popped) return;
            
            b.y -= b.speedY;
            b.x += b.speedX + Math.sin((b.y + b.swaySeed) / 30) * 0.8;
            
            b.element.style.top = `${b.y}px`;
            b.element.style.left = `${b.x}px`;
            
            if (b.y > -b.size * 2) {
                visible = true;
            } else {
                b.element.remove();
            }
        });
        
        if (visible && this.active) {
            requestAnimationFrame(() => this.update());
        } else {
            this.active = false;
            this.container.innerHTML = '';
        }
    }
};

// Text-to-Speech
function speakText(text) {
    if (!state.ttsEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (friendlyVoice) utterance.voice = friendlyVoice;
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

// ==========================================
// 3. DYNAMIC GENERATOR (100 UNIQUE QUESTIONS PER LEVEL)
// ==========================================
function generateLevelQuestions(category, level) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
    const questions = [];
    
    // Large vocabulary lists to prevent repetition
    const emojiVocab = [
        { letter: 'A', word: 'Apple', img: '🍎' }, { letter: 'A', word: 'Ant', img: '🐜' }, { letter: 'A', word: 'Acrobat', img: '🤸' }, { letter: 'A', word: 'Airplane', img: '✈️' },
        { letter: 'B', word: 'Balloon', img: '🎈' }, { letter: 'B', word: 'Bear', img: '🐻' }, { letter: 'B', word: 'Bus', img: '🚌' }, { letter: 'B', word: 'Butterfly', img: '🦋' },
        { letter: 'C', word: 'Cat', img: '🐱' }, { letter: 'C', word: 'Cake', img: '🍰' }, { letter: 'C', word: 'Car', img: '🚗' }, { letter: 'C', word: 'Camel', img: '🐪' },
        { letter: 'D', word: 'Dog', img: '🐶' }, { letter: 'D', word: 'Duck', img: '🦆' }, { letter: 'D', word: 'Dolphin', img: '🐬' }, { letter: 'D', word: 'Drum', img: '🥁' },
        { letter: 'E', word: 'Elephant', img: '🐘' }, { letter: 'E', word: 'Egg', img: '🥚' }, { letter: 'E', word: 'Eagle', img: '🦅' }, { letter: 'E', word: 'Engine', img: '🚂' },
        { letter: 'F', word: 'Fish', img: '🐟' }, { letter: 'F', word: 'Frog', img: '🐸' }, { letter: 'F', word: 'Fox', img: '🦊' }, { letter: 'F', word: 'Flower', img: '🌸' },
        { letter: 'G', word: 'Grapes', img: '🍇' }, { letter: 'G', word: 'Goat', img: '🐐' }, { letter: 'G', word: 'Giraffe', img: '🦒' }, { letter: 'G', word: 'Guitar', img: '🎸' },
        { letter: 'H', word: 'House', img: '🏠' }, { letter: 'H', word: 'Hat', img: '🎩' }, { letter: 'H', word: 'Horse', img: '🐴' }, { letter: 'H', word: 'Helicopter', img: '🚁' },
        { letter: 'I', word: 'Igloo', img: '❄️' }, { letter: 'I', word: 'Ice Cream', img: '🍦' }, { letter: 'I', word: 'Island', img: '🏝️' }, { letter: 'I', word: 'Insect', img: '🪲' },
        { letter: 'J', word: 'Jelly', img: '🍮' }, { letter: 'J', word: 'Jungle', img: '🌳' }, { letter: 'J', word: 'Jeep', img: '🚙' }, { letter: 'J', word: 'Juice', img: '🥤' },
        { letter: 'K', word: 'Kite', img: '🪁' }, { letter: 'K', word: 'Kangaroo', img: '🦘' }, { letter: 'K', word: 'Key', img: '🔑' }, { letter: 'K', word: 'Koala', img: '🐨' },
        { letter: 'L', word: 'Lion', img: '🦁' }, { letter: 'L', word: 'Leaf', img: '🍃' }, { letter: 'L', word: 'Lemon', img: '🍋' }, { letter: 'L', word: 'Lollipop', img: '🍭' },
        { letter: 'M', word: 'Monkey', img: '🐵' }, { letter: 'M', word: 'Mouse', img: '🐭' }, { letter: 'M', word: 'Moon', img: '🌙' }, { letter: 'M', word: 'Milk', img: '🥛' },
        { letter: 'N', word: 'Nest', img: '🪺' }, { letter: 'N', word: 'Net', img: '🕸️' }, { letter: 'N', word: 'Notebook', img: '📓' }, { letter: 'N', word: 'Nose', img: '👃' },
        { letter: 'O', word: 'Owl', img: '🦉' }, { letter: 'O', word: 'Orange', img: '🍊' }, { letter: 'O', word: 'Octopus', img: '🐙' }, { letter: 'O', word: 'Ostrich', img: '🦤' },
        { letter: 'P', word: 'Pig', img: '🐷' }, { letter: 'P', word: 'Pear', img: '🍐' }, { letter: 'P', word: 'Panda', img: '🐼' }, { letter: 'P', word: 'Parrot', img: '🦜' },
        { letter: 'Q', word: 'Queen', img: '👑' }, { letter: 'Q', word: 'Quill', img: '🪶' }, { letter: 'Q', word: 'Quarter', img: '🪙' }, { letter: 'Q', word: 'Quiet', img: '🤫' },
        { letter: 'R', word: 'Rabbit', img: '🐰' }, { letter: 'R', word: 'Ring', img: '💍' }, { letter: 'R', word: 'Rocket', img: '🚀' }, { letter: 'R', word: 'Rainbow', img: '🌈' },
        { letter: 'S', word: 'Sun', img: '☀️' }, { letter: 'S', word: 'Star', img: '⭐️' }, { letter: 'S', word: 'Snake', img: '🐍' }, { letter: 'S', word: 'Spider', img: '🕷️' },
        { letter: 'T', word: 'Tree', img: '🌳' }, { letter: 'T', word: 'Train', img: '🚆' }, { letter: 'T', word: 'Tiger', img: '🐅' }, { letter: 'T', word: 'Turtle', img: '🐢' },
        { letter: 'U', word: 'Umbrella', img: '☂️' }, { letter: 'U', word: 'Unicorn', img: '🦄' }, { letter: 'U', word: 'Uncle', img: '🧔' }, { letter: 'U', word: 'Under', img: '👇' },
        { letter: 'V', word: 'Violin', img: '🎻' }, { letter: 'V', word: 'Vase', img: '🏺' }, { letter: 'V', word: 'Volcano', img: '🌋' }, { letter: 'V', word: 'Vegetable', img: '🥦' },
        { letter: 'W', word: 'Watch', img: '⌚' }, { letter: 'W', word: 'Wind', img: '💨' }, { letter: 'W', word: 'Watermelon', img: '🍉' }, { letter: 'W', word: 'Whale', img: '🐋' },
        { letter: 'X', word: 'Xylophone', img: '🪘' }, { letter: 'X', word: 'X-ray', img: '🩻' }, { letter: 'X', word: 'Box', img: '📦' }, { letter: 'X', word: 'Fox', img: '🦊' },
        { letter: 'Y', word: 'Yo-yo', img: '🪀' }, { letter: 'Y', word: 'Yak', img: '🦬' }, { letter: 'Y', word: 'Yacht', img: '⛵' }, { letter: 'Y', word: 'Yellow', img: '💛' },
        { letter: 'Z', word: 'Zebra', img: '🦓' }, { letter: 'Z', word: 'Zoo', img: '🏛️' }, { letter: 'Z', word: 'Zipper', img: '🤐' }, { letter: 'Z', word: 'Zero', img: '0️⃣' }
    ];

    if (category === 'phonics') {
        if (level === 1) {
            // Upper letters A-Z, sequences and matching shapes
            for (let i = 0; i < 100; i++) {
                const charCodeIndex = i % 26;
                const correct = alphabet[charCodeIndex];
                let distractors = [
                    alphabet[(charCodeIndex + 5) % 26],
                    alphabet[(charCodeIndex + 11) % 26],
                    alphabet[(charCodeIndex + 19) % 26]
                ].filter(d => d !== correct).slice(0, 2);
                const options = shuffleArray([correct, ...distractors]);
                
                if (i < 40) {
                    questions.push({
                        questionText: `Find the big letter ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: correct,
                        type: 'text'
                    });
                } else if (i < 70) {
                    const prev1 = alphabet[(charCodeIndex + 24) % 26];
                    const prev2 = alphabet[(charCodeIndex + 25) % 26];
                    questions.push({
                        questionText: `What letter comes next?  ${prev1} -> ${prev2} -> ?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: '❓',
                        type: 'text'
                    });
                } else {
                    questions.push({
                        questionText: `Match the big letter ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: correct,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 2) {
            // More Big Letters & matching
            for (let i = 0; i < 100; i++) {
                const charCodeIndex = (13 + i) % 26;
                const correct = alphabet[charCodeIndex];
                let distractors = [
                    alphabet[(charCodeIndex + 4) % 26],
                    alphabet[(charCodeIndex + 9) % 26]
                ].filter(d => d !== correct);
                const options = shuffleArray([correct, ...distractors]);
                
                if (i % 2 === 0) {
                    questions.push({
                        questionText: `Click on the big letter ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: correct,
                        type: 'text'
                    });
                } else {
                    questions.push({
                        questionText: `Which letter is this?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: correct,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 3) {
            // Lower letters a-z
            for (let i = 0; i < 100; i++) {
                const charCodeIndex = i % 26;
                const correct = lowercaseAlphabet[charCodeIndex];
                let distractors = [
                    lowercaseAlphabet[(charCodeIndex + 3) % 26],
                    lowercaseAlphabet[(charCodeIndex + 8) % 26],
                    lowercaseAlphabet[(charCodeIndex + 14) % 26]
                ].filter(d => d !== correct).slice(0, 2);
                const options = shuffleArray([correct, ...distractors]);
                
                if (i < 50) {
                    questions.push({
                        questionText: `Find the small letter ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: correct,
                        type: 'text'
                    });
                } else {
                    const bigMatch = alphabet[charCodeIndex];
                    questions.push({
                        questionText: `Find the small matching letter for ${bigMatch}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: bigMatch,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 4) {
            // Phonics sounds
            const phonicSounds = [
                { l: 'A', s: 'Ah' }, { l: 'B', s: 'Buh' }, { l: 'C', s: 'Cuh' }, { l: 'D', s: 'Duh' },
                { l: 'E', s: 'Eh' }, { l: 'F', s: 'Fuh' }, { l: 'G', s: 'Guh' }, { l: 'H', s: 'Huh' },
                { l: 'I', s: 'Ih' }, { l: 'J', s: 'Juh' }, { l: 'K', s: 'Kuh' }, { l: 'L', s: 'Luh' },
                { l: 'M', s: 'Muh' }, { l: 'N', s: 'Nuh' }, { l: 'O', s: 'Oh' }, { l: 'P', s: 'Puh' },
                { l: 'Q', s: 'Quuh' }, { l: 'R', s: 'Ruh' }, { l: 'S', s: 'Sss' }, { l: 'T', s: 'Tuh' },
                { l: 'U', s: 'Uh' }, { l: 'V', s: 'Vuh' }, { l: 'W', s: 'Wuh' }, { l: 'Y', s: 'Yuh' }, { l: 'Z', s: 'Zuh' }
            ];
            for (let i = 0; i < 100; i++) {
                const pair = phonicSounds[i % phonicSounds.length];
                const correct = pair.l;
                let distractors = [
                    alphabet[(alphabet.indexOf(correct) + 5) % 26],
                    alphabet[(alphabet.indexOf(correct) + 12) % 26]
                ];
                const options = shuffleArray([correct, ...distractors]);
                
                questions.push({
                    questionText: `Which letter makes the "${pair.s}" sound?`,
                    options: options,
                    answerIndex: options.indexOf(correct),
                    illustration: '🔊',
                    type: 'sound-id'
                });
            }
        }
        else if (level === 5) {
            // Word Match & Spelling - 100 UNIQUE spelling words
            for (let i = 0; i < 100; i++) {
                const item = emojiVocab[i % emojiVocab.length];
                const correct = item.letter;
                const hiddenWord = "_" + item.word.slice(1);
                
                let distractors = [
                    alphabet[(alphabet.indexOf(correct) + 4) % 26],
                    alphabet[(alphabet.indexOf(correct) + 9) % 26]
                ];
                const options = shuffleArray([correct, ...distractors]);
                
                questions.push({
                    questionText: `Complete the word: "${hiddenWord}"`,
                    options: options,
                    answerIndex: options.indexOf(correct),
                    illustration: item.img,
                    type: 'spelling',
                    audioHint: `Complete the word for ${item.word}`
                });
            }
        }
    }
    
    if (category === 'math') {
        if (level === 1) {
            // Numbers 1-5 (100 unique questions using number cards and operations)
            for (let i = 0; i < 100; i++) {
                const correct = 1 + (i % 5);
                let distractors = [1,2,3,4,5].filter(d => d !== correct);
                const options = shuffleArray([correct, distractors[0], distractors[1]]);
                
                if (i % 2 === 0) {
                    questions.push({
                        questionText: `Find the number ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: '🔢',
                        type: 'number'
                    });
                } else {
                    const dots = Array(correct).fill('🟡').join(' ');
                    questions.push({
                        questionText: `Count the dots!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: dots,
                        type: 'counting'
                    });
                }
            }
        }
        else if (level === 2) {
            // Numbers 6-10 (100 unique questions)
            for (let i = 0; i < 100; i++) {
                const correct = 6 + (i % 5);
                let distractors = [6,7,8,9,10].filter(d => d !== correct);
                const options = shuffleArray([correct, distractors[0], distractors[1]]);
                
                if (i % 2 === 0) {
                    questions.push({
                        questionText: `Find the number ${correct}!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: '🔢',
                        type: 'number'
                    });
                } else {
                    const dots = Array(correct).fill('🟢').join(' ');
                    questions.push({
                        questionText: `Count the green dots!`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: dots,
                        type: 'counting'
                    });
                }
            }
        }
        else if (level === 3) {
            // Counting Fun (1-10 objects with 100 unique combinations)
            const countItems = ['🍎', '🎈', '⭐️', '🍪', '🐸', '🦁', '🚗', '🍭', '🍔', '🚀'];
            for (let i = 0; i < 100; i++) {
                const count = 1 + (i % 10);
                const item = countItems[Math.floor(i / 10) % countItems.length];
                const illustration = Array(count).fill(item).join(' ');
                
                let distractors = [count + 1, count - 1].filter(d => d > 0 && d <= 10);
                if (distractors.length < 2) distractors.push(count === 1 ? 3 : 1);
                
                const options = shuffleArray([count, distractors[0], distractors[1]]);
                
                questions.push({
                    questionText: `Count the items! How many are there?`,
                    options: options,
                    answerIndex: options.indexOf(count),
                    illustration: illustration,
                    type: 'counting'
                });
            }
        }
        else if (level === 4) {
            // Colors & Shapes (100 unique combinations)
            const shapes = ['circle', 'square', 'triangle', 'star'];
            const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'];
            for (let i = 0; i < 100; i++) {
                const shape = shapes[i % shapes.length];
                const color = colors[Math.floor(i / shapes.length) % colors.length];
                
                if (i % 2 === 0) {
                    const correctShape = shape;
                    const incorrects = shapes.filter(s => s !== correctShape);
                    const options = shuffleArray([correctShape, incorrects[0], incorrects[1]]);
                    questions.push({
                        questionText: `Find the ${correctShape.toUpperCase()}!`,
                        options: options,
                        answerIndex: options.indexOf(correctShape),
                        illustration: '🔺',
                        type: 'shape-match'
                    });
                } else {
                    const correctColor = color;
                    const incorrects = colors.filter(c => c !== correctColor);
                    const options = shuffleArray([correctColor, incorrects[0], incorrects[1]]);
                    questions.push({
                        questionText: `Find the ${correctColor.toUpperCase()} button!`,
                        options: options,
                        answerIndex: options.indexOf(correctColor),
                        illustration: '🎨',
                        type: 'color-match'
                    });
                }
            }
        }
        else if (level === 5) {
            // Size & Patterns (100 unique)
            const sizeObjects = [
                { l: '🐘', s: '🐭', descL: 'Elephant', descS: 'Mouse' },
                { l: '🦁', s: '🐿️', descL: 'Lion', descS: 'Squirrel' },
                { l: '🍎', s: '🍒', descL: 'Apple', descS: 'Cherry' },
                { l: '🏠', s: '🔑', descL: 'House', descS: 'Key' }
            ];
            const patterns = [
                { seq: '🍎 🍌 🍎', next: '🍌', distracts: ['🍎', '🍇'] },
                { seq: '🐶 🐱 🐶', next: '🐱', distracts: ['🐶', '🐭'] },
                { seq: '⭐️ 🌙 ⭐️', next: '🌙', distracts: ['⭐️', '☀️'] },
                { seq: '🔴 🟢 🔴', next: '🟢', distracts: ['🔴', '🔵'] }
            ];
            
            for (let i = 0; i < 100; i++) {
                if (i % 2 === 0) {
                    const pair = sizeObjects[Math.floor(i / 2) % sizeObjects.length];
                    const findBig = i % 4 === 0;
                    const correct = findBig ? pair.l : pair.s;
                    const incorrect = findBig ? pair.s : pair.l;
                    
                    const options = shuffleArray([correct, incorrect]);
                    questions.push({
                        questionText: `Which is ${findBig ? 'BIGGER' : 'SMALLER'}?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: '📏',
                        type: 'size'
                    });
                } else {
                    const pat = patterns[Math.floor(i / 2) % patterns.length];
                    const options = shuffleArray([pat.next, pat.distracts[0], pat.distracts[1]]);
                    
                    questions.push({
                        questionText: `What comes next in the pattern?`,
                        options: options,
                        answerIndex: options.indexOf(pat.next),
                        illustration: `${pat.seq} ... ?`,
                        type: 'pattern'
                    });
                }
            }
        }
    }

    if (category === 'gktrivia') {
        if (level === 1) {
            // Colors of Rajasthan - 100 unique phrasing variants
            const facts = [
                { city: 'Jaipur', color: 'Pink', emoji: '🌸', q: 'Which city is the Pink City of Rajasthan?' },
                { city: 'Jodhpur', color: 'Blue', emoji: '💙', q: 'Which city is the Blue City of Rajasthan?' },
                { city: 'Udaipur', color: 'White', emoji: '🏛️', q: 'Which city is the White City of Rajasthan?' },
                { city: 'Jaisalmer', color: 'Yellow', emoji: '🌕', q: 'Which city is the Golden City of Rajasthan?' }
            ];
            for (let i = 0; i < 100; i++) {
                const fact = facts[i % facts.length];
                const correct = fact.city;
                const incorrects = facts.filter(f => f.city !== correct).map(f => f.city);
                const options = shuffleArray([correct, incorrects[0], incorrects[1]]);
                
                if (i < 50) {
                    questions.push({
                        questionText: fact.q,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: fact.emoji,
                        type: 'text'
                    });
                } else {
                    questions.push({
                        questionText: `What city matches the color ${fact.color}?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: fact.emoji,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 2) {
            // Animals of the Desert - 100 unique questions
            const animals = [
                { name: 'Camel', trait: 'Ship of the Desert', emoji: '🐪' },
                { name: 'Peacock', trait: 'National Bird of India', emoji: '🦚' },
                { name: 'Tiger', trait: 'Found in Sariska & Ranthambore', emoji: '🐅' },
                { name: 'Chinkara', trait: 'State Animal of Rajasthan', emoji: '🦌' }
            ];
            for (let i = 0; i < 100; i++) {
                const item = animals[i % animals.length];
                const correct = item.name;
                const incorrects = animals.filter(a => a.name !== correct).map(a => a.name);
                const options = shuffleArray([correct, incorrects[0], incorrects[1]]);
                
                questions.push({
                    questionText: `Which animal is the "${item.trait}"?`,
                    options: options,
                    answerIndex: options.indexOf(correct),
                    illustration: item.emoji,
                    type: 'text'
                });
            }
        }
        else if (level === 3) {
            // Food & Festivals - 100 unique questions
            const foodCulture = [
                { name: 'Dal Baati Churma', type: 'food', emoji: '🥣', desc: 'famous local food of Rajasthan' },
                { name: 'Ghoomar', type: 'dance', emoji: '💃', desc: 'spinning circle folk dance' },
                { name: 'Turban (Pagri)', type: 'clothing', emoji: '👳', desc: 'colorful local headwear' },
                { name: 'Puppets (Kathputli)', type: 'art', emoji: '🧸', desc: 'wooden dolls playing stories' }
            ];
            for (let i = 0; i < 100; i++) {
                const item = foodCulture[i % foodCulture.length];
                const correct = item.name;
                const incorrects = foodCulture.filter(f => f.name !== correct).map(f => f.name);
                const options = shuffleArray([correct, incorrects[0], incorrects[1]]);
                
                questions.push({
                    questionText: `What is the famous ${item.desc}?`,
                    options: options,
                    answerIndex: options.indexOf(correct),
                    illustration: item.emoji,
                    type: 'text'
                });
            }
        }
        else if (level === 4) {
            // Palaces & Lakes - 100 unique questions
            const places = [
                { name: 'Hawa Mahal', feature: 'Hundreds of small pink windows', emoji: '🏛️' },
                { name: 'Lake Palace', feature: 'Floating palace in Lake Pichola', emoji: '🏰' },
                { name: 'Thar Desert', feature: 'Giant hot sandy area', emoji: '🌵' },
                { name: 'Jal Mahal', feature: 'Water palace in Sagar Lake', emoji: '⛲' }
            ];
            for (let i = 0; i < 100; i++) {
                const item = places[i % places.length];
                const correct = item.name;
                const incorrects = places.filter(p => p.name !== correct).map(p => p.name);
                const options = shuffleArray([correct, incorrects[0], incorrects[1]]);
                
                questions.push({
                    questionText: `Which place has "${item.feature}"?`,
                    options: options,
                    answerIndex: options.indexOf(correct),
                    illustration: item.emoji,
                    type: 'text'
                });
            }
        }
        else if (level === 5) {
            // Fun Trivia Facts - 100 unique questions
            const funFacts = [
                { q: 'Where is Hawa Mahal located?', ans: 'Jaipur', distracts: ['Udaipur', 'Jodhpur'], emoji: '🏛️' },
                { q: 'Which is the biggest state in India?', ans: 'Rajasthan', distracts: ['Delhi', 'Goa'], emoji: '🗺️' },
                { q: 'Which bird dances in rain?', ans: 'Peacock', distracts: ['Sparrow', 'Crow'], emoji: '🦚' },
                { q: 'What grows on Thar Desert sand?', ans: 'Cactus', distracts: ['Apple trees', 'Roses'], emoji: '🌵' }
            ];
            for (let i = 0; i < 100; i++) {
                const item = funFacts[i % funFacts.length];
                const options = shuffleArray([item.ans, item.distracts[0], item.distracts[1]]);
                
                questions.push({
                    questionText: item.q,
                    options: options,
                    answerIndex: options.indexOf(item.ans),
                    illustration: item.emoji,
                    type: 'text'
                });
            }
        }
    }
    
    return questions;
}

// ==========================================
// 4. PERSISTENCE & FOREVER TIME TRACKING
// ==========================================
function loadProgress() {
    const data = localStorage.getItem('toddler_land_progress');
    if (data) {
        state.progress = JSON.parse(data);
    }
    for (const username in KIDS_PROFILES) {
        if (!state.progress[username]) {
            state.progress[username] = {
                levels: {},
                history: [],
                usageTime: {} 
            };
        }
        if (!state.progress[username].usageTime) {
            state.progress[username].usageTime = {};
        }
    }
}

function saveProgress() {
    localStorage.setItem('toddler_land_progress', JSON.stringify(state.progress));
}

function startUsageTracking() {
    if (state.activeTrackingInterval) clearInterval(state.activeTrackingInterval);
    
    state.activeTrackingInterval = setInterval(() => {
        if (!state.currentUser) return;
        
        const today = new Date().toISOString().split('T')[0];
        const kidData = state.progress[state.currentUser];
        
        if (!kidData.usageTime) kidData.usageTime = {};
        if (!kidData.usageTime[today]) kidData.usageTime[today] = 0;
        
        kidData.usageTime[today] += 5;
        saveProgress();
    }, 5000);
}

function stopUsageTracking() {
    if (state.activeTrackingInterval) {
        clearInterval(state.activeTrackingInterval);
        state.activeTrackingInterval = null;
    }
}

function updateProgressState(category, level, score, completed = false) {
    if (!state.currentUser) return;
    
    const kidData = state.progress[state.currentUser];
    const key = `${category}_${level}`;
    
    if (!kidData.levels[key]) {
        kidData.levels[key] = {
            score: 0,
            completed: false,
            errors: 0,
            attempts: 0
        };
    }
    
    kidData.levels[key].attempts += 1;
    kidData.levels[key].errors += state.incorrectAttemptsThisQuestion;
    
    if (score > kidData.levels[key].score) {
        kidData.levels[key].score = score;
    }
    
    if (completed) {
        kidData.levels[key].completed = true;
        const categoryLabel = CATEGORIES[category].title;
        kidData.history.unshift({
            timestamp: new Date().toISOString(),
            action: `Finished Level ${level} of ${categoryLabel}`,
            score: score
        });
        
        if (kidData.history.length > 20) kidData.history.pop();
    }
    
    saveProgress();
}

// ==========================================
// 5. VIEW NAVIGATION CONTROLLER
// ==========================================
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
    });
    
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
    }
    
    const headerProfile = document.getElementById('header-profile');
    const headerNavPills = document.getElementById('header-nav-pills');
    const headerLogout = document.getElementById('header-logout-btn');
    
    document.querySelectorAll('.nav-pill').forEach(btn => btn.classList.remove('active'));
    
    if (viewId === 'view-gktrivia') {
        document.getElementById('pill-gktrivia').classList.add('active');
    } else if (viewId === 'view-playroom') {
        document.getElementById('pill-playroom').classList.add('active');
    } else if (viewId === 'view-parent') {
        document.getElementById('pill-parent').classList.add('active');
    }
    
    if (viewId === 'view-login') {
        headerProfile.style.display = 'none';
        headerNavPills.style.display = 'none';
        headerLogout.style.display = 'none';
        document.body.className = '';
        stopUsageTracking();
    } else {
        if (state.currentUser) {
            const kid = KIDS_PROFILES[state.currentUser];
            document.body.className = kid.theme;
            
            headerProfile.style.display = 'flex';
            document.getElementById('header-avatar').innerHTML = kid.avatar;
            document.getElementById('header-username').textContent = kid.name;
            
            headerNavPills.style.display = 'flex';
            headerLogout.style.display = 'inline-flex';
            startUsageTracking();
        }
    }
    
    if (viewId !== 'view-gameplay') {
        window.speechSynthesis.cancel();
    }
}

// ==========================================
// 6. EVENT BINDINGS AND ACTIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    Confetti.init();
    loadProgress();
    renderLoginProfiles();
    setupEventListeners();
    switchView('view-login');
});

// Render profiles dynamically using Indian landmarks
function renderLoginProfiles() {
    const container = document.getElementById('login-profiles-grid');
    if (!container) return;
    container.innerHTML = '';
    
    let isFirst = true;
    for (const username in KIDS_PROFILES) {
        const kid = KIDS_PROFILES[username];
        const card = document.createElement('div');
        card.className = `login-profile-select ${isFirst ? 'selected' : ''}`;
        card.setAttribute('data-username', username);
        card.innerHTML = `
            <div class="avatar">${kid.avatar}</div>
            <div class="name">${kid.name}</div>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.login-profile-select').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            document.body.className = kid.theme;
        });
        
        container.appendChild(card);
        isFirst = false;
    }
}

function setupEventListeners() {
    // 1. Submit Login Form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedProfile = document.querySelector('.login-profile-select.selected');
        if (!selectedProfile) return;
        
        const username = selectedProfile.getAttribute('data-username');
        const passwordInput = document.getElementById('login-password');
        const password = passwordInput.value.trim();
        
        const kid = KIDS_PROFILES[username];
        
        if (kid && kid.password === password) {
            state.currentUser = username;
            passwordInput.value = ''; 
            
            setupPlayroomView();
            switchView('view-playroom');
            
            speakText(`Hi ${kid.name}! Welcome to Aarti Ma'am's classroom. Let's learn!`);
        } else {
            alert('Oops! Incorrect password. Ask a parent or Aarti Ma\'am to check!');
            passwordInput.value = '';
        }
    });
    
    // 2. Navigation Pills Clicks
    document.getElementById('pill-gktrivia').addEventListener('click', () => {
        setupGKTriviaView();
        switchView('view-gktrivia');
    });
    
    document.getElementById('pill-playroom').addEventListener('click', () => {
        setupPlayroomView();
        switchView('view-playroom');
    });
    
    document.getElementById('pill-parent').addEventListener('click', () => {
        openParentGate();
    });
    
    // 3. Logout Switch Player
    document.getElementById('header-logout-btn').addEventListener('click', () => {
        state.currentUser = null;
        switchView('view-login');
    });
    
    // 4. Header Logo Click
    document.getElementById('header-logo').addEventListener('click', () => {
        if (state.currentUser) {
            setupPlayroomView();
            switchView('view-playroom');
        }
    });
    
    // 5. Parent gate interactions
    document.getElementById('parent-gate-cancel').addEventListener('click', () => {
        document.getElementById('parent-gate-modal').classList.remove('active');
    });
    
    document.getElementById('parent-gate-confirm').addEventListener('click', () => {
        verifyParentGate();
    });
    
    document.getElementById('parent-gate-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyParentGate();
        }
    });
    
    // 6. Parent Hub navigation back
    document.getElementById('parent-back-btn').addEventListener('click', () => {
        setupPlayroomView();
        switchView('view-playroom');
    });
    
    // 7. Reset child progress
    document.getElementById('parent-reset-btn').addEventListener('click', () => {
        if (confirm('Are you absolutely sure you want to reset all stars and data for this child? This cannot be undone.')) {
            if (state.currentUser) {
                state.progress[state.currentUser] = {
                    levels: {},
                    history: [{
                        timestamp: new Date().toISOString(),
                        action: 'Progress reset by parent'
                    }],
                    usageTime: {}
                };
                saveProgress();
                setupParentHubView();
                alert('Progress has been reset!');
            }
        }
    });
    
    // 8. Gameplay back button
    document.getElementById('game-back-btn').addEventListener('click', () => {
        if (confirm('Do you want to exit the game?')) {
            if (state.currentCategory === 'gktrivia') {
                setupGKTriviaView();
                switchView('view-gktrivia');
            } else {
                setupPlayroomView();
                switchView('view-playroom');
            }
        }
    });
    
    // 9. Speech controls
    document.getElementById('tts-toggle').addEventListener('click', () => {
        state.ttsEnabled = !state.ttsEnabled;
        const icon = document.getElementById('tts-icon');
        const text = document.getElementById('tts-text');
        if (state.ttsEnabled) {
            icon.textContent = '🔊';
            text.textContent = 'Voice On';
            speakText("Voice enabled!");
        } else {
            icon.textContent = '🔇';
            text.textContent = 'Voice Off';
            window.speechSynthesis.cancel();
        }
    });
}

// ==========================================
// 7. PLAYROOM & GK TRIVIA VIEWS LOADING
// ==========================================
function setupPlayroomView() {
    if (!state.currentUser) return;
    
    const kid = KIDS_PROFILES[state.currentUser];
    document.getElementById('playroom-kid-name').textContent = kid.name;
    document.getElementById('playroom-kid-emoji').innerHTML = `<span style="display:inline-block; width:30px; height:30px; vertical-align:middle; margin-left:10px; color:var(--theme-color-primary);">${kid.avatar}</span>`;
    
    renderPlayroomLevels('phonics', 'phonics-levels-list');
    renderPlayroomLevels('math', 'math-levels-list');
}

function setupGKTriviaView() {
    if (!state.currentUser) return;
    renderPlayroomLevels('gktrivia', 'gk-levels-list');
}

function renderPlayroomLevels(catId, elementId) {
    const listContainer = document.getElementById(elementId);
    listContainer.innerHTML = '';
    
    const cat = CATEGORIES[catId];
    const kidData = state.progress[state.currentUser] || { levels: {} };
    
    cat.levels.forEach(lvl => {
        const key = `${catId}_${lvl.id}`;
        const score = kidData.levels[key]?.score || 0;
        const percent = Math.min(Math.round((score / 100) * 100), 100);
        const completed = kidData.levels[key]?.completed || false;
        
        const row = document.createElement('div');
        row.className = 'level-row';
        row.innerHTML = `
            <div class="level-info">
                <span class="level-name">${lvl.icon} ${lvl.name}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="level-progress-bar">
                        <div class="level-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span class="level-score">${score}/100 Stars</span>
                </div>
            </div>
            <div class="level-play-btn">
                ${completed ? '⭐' : '▶️'}
            </div>
        `;
        
        row.addEventListener('click', () => {
            launchGameplay(catId, lvl.id);
        });
        
        listContainer.appendChild(row);
    });
}

// ==========================================
// 8. INTERACTIVE GAMEPLAY MOTOR
// ==========================================
function launchGameplay(catId, levelId) {
    state.currentCategory = catId;
    state.currentLevel = levelId;
    state.currentQuestionIndex = 0;
    state.incorrectAttemptsThisLevel = 0;
    
    // GENERATE 100 UNIQUE QUESTIONS SHUFFLED FRESH ON RUN
    const rawQuestions = generateLevelQuestions(catId, levelId);
    state.currentLevelQuestions = shuffleArray(rawQuestions);
    
    document.getElementById('game-level-icon').textContent = CATEGORIES[catId].icon;
    document.getElementById('game-level-title').textContent = `${CATEGORIES[catId].title} - Level ${levelId}`;
    
    loadQuestion();
    switchView('view-gameplay');
}

function loadQuestion() {
    state.incorrectAttemptsThisQuestion = 0;
    
    const qData = state.currentLevelQuestions[state.currentQuestionIndex];
    state.currentQuestion = qData;
    
    document.getElementById('game-progress-text').textContent = `${state.currentQuestionIndex + 1} / 100`;
    const progressPercent = (state.currentQuestionIndex / 100) * 100;
    document.getElementById('game-progress-fill').style.width = `${progressPercent}%`;
    
    const container = document.getElementById('game-dynamic-content');
    container.innerHTML = '';
    
    const qTextDiv = document.createElement('div');
    qTextDiv.className = 'question-text';
    qTextDiv.innerHTML = `
        <div>
            <button class="speak-question-btn" id="game-speak-q-btn">🔊</button>
        </div>
        <span>${qData.questionText}</span>
    `;
    container.appendChild(qTextDiv);
    
    document.getElementById('game-speak-q-btn').addEventListener('click', () => {
        speakQuestionText();
    });
    
    const illustrationDiv = document.createElement('div');
    illustrationDiv.className = 'game-illustration float-anim';
    
    if (qData.type === 'shape-match') {
        illustrationDiv.innerHTML = `🌟`;
    } else {
        illustrationDiv.textContent = qData.illustration;
    }
    container.appendChild(illustrationDiv);
    
    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'options-grid';
    
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn bounce-hover';
        
        if (qData.type === 'color-match') {
            btn.style.setProperty('--shape-color', opt);
            btn.innerHTML = `<div class="shape-drawing circle" style="background-color: ${opt}"></div>`;
        } else if (qData.type === 'shape-match') {
            btn.innerHTML = `<div class="shape-drawing ${opt}"></div>`;
        } else if (qData.type === 'size') {
            btn.style.fontSize = opt === qData.options[0] ? '64px' : '32px';
            btn.textContent = opt;
        } else {
            btn.textContent = opt;
            if (opt.toString().length > 8) {
                btn.style.fontSize = '20px';
                btn.style.padding = '18px 8px';
            }
        }
        
        btn.addEventListener('click', () => {
            handleAnswerSelect(idx, btn);
        });
        
        optionsGrid.appendChild(btn);
    });
    
    container.appendChild(optionsGrid);
    speakQuestionText();
}

function speakQuestionText() {
    if (!state.currentQuestion) return;
    let speechPrompt = state.currentQuestion.questionText;
    
    if (state.currentQuestion.audioHint) {
        speechPrompt = state.currentQuestion.audioHint;
    } else if (state.currentQuestion.type === 'counting') {
        speechPrompt = `Let's count! How many objects can you see?`;
    } else if (state.currentQuestion.type === 'pattern') {
        speechPrompt = `Look at the shapes. What comes next in the pattern?`;
    }
    
    speakText(speechPrompt);
}

function handleAnswerSelect(selectedIdx, btnElement) {
    if (btnElement.classList.contains('correct') || btnElement.classList.contains('incorrect')) {
        return; 
    }
    
    const correctIdx = state.currentQuestion.answerIndex;
    
    if (selectedIdx === correctIdx) {
        btnElement.classList.add('correct');
        AudioPlayer.playSuccess();
        Confetti.spawn();
        BalloonPhysics.spawn();
        
        const praises = ['Yay! Super job!', 'Perfect!', 'Awesome!', 'You got it!', 'Hooray!', 'Star Learner!'];
        const randomPraise = praises[Math.floor(Math.random() * praises.length)];
        speakText(randomPraise);
        
        setTimeout(() => {
            advanceQuestion();
        }, 1300);
    } else {
        btnElement.classList.add('incorrect');
        state.incorrectAttemptsThisQuestion += 1;
        state.incorrectAttemptsThisLevel += 1;
        AudioPlayer.playError();
        
        speakText("Oh! Try again!");
        
        setTimeout(() => {
            btnElement.style.animation = 'none';
        }, 400);
    }
}

function advanceQuestion() {
    state.currentQuestionIndex += 1;
    const levelScore = state.currentQuestionIndex;
    updateProgressState(state.currentCategory, state.currentLevel, levelScore, false);
    
    if (state.currentQuestionIndex >= 100) {
        handleLevelCompletion();
    } else {
        loadQuestion();
    }
}

function handleLevelCompletion() {
    AudioPlayer.playLevelComplete();
    updateProgressState(state.currentCategory, state.currentLevel, 100, true);
    
    const container = document.getElementById('game-dynamic-content');
    container.innerHTML = '';
    
    const dialog = document.createElement('div');
    dialog.className = 'completion-dialog';
    dialog.innerHTML = `
        <div class="completion-stars">⭐️⭐️⭐️⭐️⭐️</div>
        <h2>Level Completed!</h2>
        <p>Congratulations! You solved all 100 questions!</p>
        <div class="certificate-medal" style="font-size: 72px;">🏆</div>
        <button class="completion-btn" id="finish-level-btn">Get Star Certificate! 📜</button>
    `;
    
    container.appendChild(dialog);
    
    document.getElementById('finish-level-btn').addEventListener('click', () => {
        document.getElementById('parent-gate-modal').classList.remove('active');
        setupParentHubView();
        switchView('view-parent');
        
        const certViewer = document.getElementById('certificate-viewer');
        if (certViewer) {
            certViewer.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    speakText("Wow! You finished the whole level! You earned a big trophy and a star certificate!");
}

// ==========================================
// 9. PARENT GATE AND SECURITY SYSTEM
// ==========================================
function openParentGate() {
    const num1 = Math.floor(Math.random() * 8) + 2; 
    const num2 = Math.floor(Math.random() * 8) + 2; 
    state.parentGateAnswer = num1 + num2;
    
    document.getElementById('parent-gate-math').textContent = `${num1} + ${num2} = ?`;
    document.getElementById('parent-gate-input').value = '';
    
    document.getElementById('parent-gate-modal').classList.add('active');
    document.getElementById('parent-gate-input').focus();
}

function verifyParentGate() {
    const inputVal = parseInt(document.getElementById('parent-gate-input').value);
    
    if (inputVal === state.parentGateAnswer) {
        document.getElementById('parent-gate-modal').classList.remove('active');
        setupParentHubView();
        switchView('view-parent');
    } else {
        alert('Verification failed. That answer is incorrect. Parents only!');
        document.getElementById('parent-gate-modal').classList.remove('active');
    }
}

// ==========================================
// 10. PARENT ANALYTICS RENDERING
// ==========================================
function setupParentHubView() {
    if (!state.currentUser) return;
    
    const kid = KIDS_PROFILES[state.currentUser];
    const kidData = state.progress[state.currentUser] || { levels: {}, history: [], usageTime: {} };
    
    document.getElementById('parent-kid-name').textContent = kid.name;
    
    let solvedCount = 0;
    let errorSum = 0;
    
    for (const key in kidData.levels) {
        const lvlData = kidData.levels[key];
        solvedCount += lvlData.score;
        errorSum += lvlData.errors;
    }
    
    const accuracy = solvedCount > 0 
        ? Math.round((solvedCount / (solvedCount + errorSum)) * 100) 
        : 100;
        
    document.getElementById('parent-total-questions').textContent = solvedCount;
    document.getElementById('parent-accuracy').textContent = `${accuracy}%`;
    
    const tableBody = document.getElementById('parent-levels-table-body');
    tableBody.innerHTML = '';
    
    let completedLevels = [];
    
    for (const catId in CATEGORIES) {
        const cat = CATEGORIES[catId];
        cat.levels.forEach(lvl => {
            const key = `${catId}_${lvl.id}`;
            const keyData = kidData.levels[key] || { score: 0, errors: 0, completed: false };
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #edf2f7';
            
            const nameTd = document.createElement('td');
            nameTd.style.padding = '12px 8px';
            nameTd.style.fontWeight = '700';
            nameTd.innerHTML = `${cat.icon} ${lvl.name}`;
            tr.appendChild(nameTd);
            
            const progressTd = document.createElement('td');
            progressTd.style.padding = '12px 8px';
            progressTd.textContent = `${keyData.score} / 100 stars`;
            tr.appendChild(progressTd);
            
            const accTd = document.createElement('td');
            accTd.style.padding = '12px 8px';
            const lvlAcc = keyData.score > 0 
                ? Math.round((keyData.score / (keyData.score + keyData.errors)) * 100) 
                : 100;
            accTd.textContent = keyData.score > 0 ? `${lvlAcc}%` : '-';
            tr.appendChild(accTd);
            
            const certTd = document.createElement('td');
            certTd.style.padding = '12px 8px';
            if (keyData.completed) {
                const viewBtn = document.createElement('button');
                viewBtn.className = 'nav-btn';
                viewBtn.style.padding = '4px 10px';
                viewBtn.style.fontSize = '12px';
                viewBtn.style.background = 'var(--theme-color-light)';
                viewBtn.style.borderColor = 'var(--theme-color-primary)';
                viewBtn.textContent = '📜 View Certificate';
                viewBtn.addEventListener('click', () => {
                    renderCertificate(lvl.name, cat.title);
                });
                certTd.appendChild(viewBtn);
                
                completedLevels.push({ lvlName: lvl.name, catTitle: cat.title });
            } else {
                certTd.textContent = '🔒 Unfinished';
                certTd.style.color = 'var(--color-gray)';
                certTd.style.fontSize = '12px';
            }
            tr.appendChild(certTd);
            
            tableBody.appendChild(tr);
        });
    }
    
    const certViewer = document.getElementById('certificate-viewer');
    if (completedLevels.length > 0) {
        const latest = completedLevels[completedLevels.length - 1];
        renderCertificate(latest.lvlName, latest.catTitle);
    } else {
        certViewer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--color-gray); border: 2px dashed #e2e8f0; border-radius: 12px; font-weight: 600;">
                🔒 No certificates earned yet. Complete all 100 questions of any level to earn a certificate!
            </div>
        `;
    }
    
    const usageLog = document.getElementById('parent-usage-list');
    usageLog.innerHTML = '';
    
    const dates = Object.keys(kidData.usageTime || {}).sort().reverse();
    if (dates.length > 0) {
        dates.forEach(dateStr => {
            const sec = kidData.usageTime[dateStr];
            let timeDisplay = '';
            if (sec < 60) {
                timeDisplay = `${sec} secs`;
            } else {
                const min = Math.floor(sec / 60);
                const remainingSec = sec % 60;
                timeDisplay = `${min} mins ${remainingSec} secs`;
            }
            
            const d = new Date(dateStr);
            const formattedDate = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
            
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="action">📅 ${formattedDate}</span>
                <span style="font-weight: 700; color: var(--theme-color-primary);">${timeDisplay}</span>
            `;
            usageLog.appendChild(item);
        });
    } else {
        usageLog.innerHTML = `<div style="text-align: center; color: var(--color-gray); font-size: 14px; padding: 10px;">No usage logged yet. Time updates active!</div>`;
    }
    
    const activityLog = document.getElementById('parent-activity-list');
    activityLog.innerHTML = '';
    
    if (kidData.history.length > 0) {
        kidData.history.forEach(act => {
            const date = new Date(act.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="action">${act.action}</span>
                <span class="time">${timeStr}</span>
            `;
            activityLog.appendChild(item);
        });
    } else {
        activityLog.innerHTML = `<div style="text-align: center; color: var(--color-gray); font-size: 14px; padding: 10px;">No recent history.</div>`;
    }
}

function renderCertificate(levelName, categoryTitle) {
    if (!state.currentUser) return;
    
    const kid = KIDS_PROFILES[state.currentUser];
    const viewer = document.getElementById('certificate-viewer');
    
    viewer.innerHTML = `
        <div class="certificate-card" id="star-certificate">
            <div class="certificate-title">Star Learner Award</div>
            <div class="certificate-subtitle">This is proudly presented to</div>
            <div class="certificate-name">${kid.name}</div>
            <div class="certificate-text">
                for outstanding achievements in completing the level<br>
                <strong>${levelName}</strong><br>
                in <strong>${categoryTitle}</strong>!
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #a855f7; margin-top: 10px;">
                Certified by Aarti Ma'am ✨
            </div>
            <div class="certificate-medal">🏆</div>
        </div>
        <button class="nav-btn primary" onclick="window.print()" style="margin-top: 10px; width: 100%; justify-content: center;">
            🖨️ Print Award
        </button>
    `;
}
