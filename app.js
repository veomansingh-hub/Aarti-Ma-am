import gkQuestions from './gk_questions.json';

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
    currentLevelQuestions: [], // Shuffled list of 100 unique questions
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
function getGkIllustration(level, qText) {
    if (level === 1) return '🎨';
    if (level === 2) {
        const lower = qText.toLowerCase();
        if (lower.includes('camel')) return '🐪';
        if (lower.includes('peacock')) return '🦚';
        if (lower.includes('tiger')) return '🐅';
        if (lower.includes('chinkara')) return '🦌';
        if (lower.includes('fox')) return '🦊';
        if (lower.includes('lizard')) return '🦎';
        if (lower.includes('snake')) return '🐍';
        if (lower.includes('tortoise') || lower.includes('turtle')) return '🐢';
        if (lower.includes('eagle')) return '🦅';
        if (lower.includes('ant')) return '🐜';
        if (lower.includes('fish')) return '🐟';
        if (lower.includes('cow')) return '🐄';
        if (lower.includes('cat')) return '🐱';
        if (lower.includes('horse')) return '🐎';
        if (lower.includes('goat')) return '🐐';
        if (lower.includes('sheep')) return '🐑';
        if (lower.includes('bustard') || lower.includes('godawan') || lower.includes('bird')) return '🦚';
        return '🐪';
    }
    if (level === 3) {
        const lower = qText.toLowerCase();
        if (lower.includes('dal') || lower.includes('baati') || lower.includes('churma')) return '🥣';
        if (lower.includes('ghevar') || lower.includes('sweet') || lower.includes('ladoo') || lower.includes('sweet')) return '🍰';
        if (lower.includes('lassi') || lower.includes('drink')) return '🥛';
        if (lower.includes('roti') || lower.includes('papad')) return '🫓';
        if (lower.includes('holi')) return '🎨';
        if (lower.includes('diwali') || lower.includes('lamp') || lower.includes('diya')) return '🪔';
        if (lower.includes('kite')) return '🪁';
        if (lower.includes('teej') || lower.includes('swing')) return '🪁';
        if (lower.includes('mela') || lower.includes('fair')) return '🎪';
        return '🍲';
    }
    if (level === 4) {
        const lower = qText.toLowerCase();
        if (lower.includes('hawa')) return '🏛️';
        if (lower.includes('fort')) return '🏰';
        if (lower.includes('lake') || lower.includes('water') || lower.includes('pichola') || lower.includes('sagar')) return '💧';
        if (lower.includes('jal')) return '⛲';
        if (lower.includes('boat')) return '⛵';
        if (lower.includes('temple')) return '🕌';
        return '🏰';
    }
    return '✨';
}

function generateLevelQuestions(category, level) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
    const questions = [];
    
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
        { letter: 'X', word: 'Xylophone', img: '🪘' }, { letter: 'X', word: 'X-ray', img: '🩻' }, { letter: 'X', word: 'Box', img: '📦' }, { letter: 'X', word: 'Mix', img: '🥣' },
        { letter: 'Y', word: 'Yo-yo', img: '🪀' }, { letter: 'Y', word: 'Yak', img: '🦬' }, { letter: 'Y', word: 'Yacht', img: '⛵' }, { letter: 'Y', word: 'Yellow', img: '💛' },
        { letter: 'Z', word: 'Zebra', img: '🦓' }, { letter: 'Z', word: 'Zoo', img: '🏛️' }, { letter: 'Z', word: 'Zipper', img: '🤐' }, { letter: 'Z', word: 'Zero', img: '0️⃣' }
    ];

    if (category === 'phonics') {
        if (level === 1) {
            // Big Letters (A-J) - 100 unique questions
            const letters = 'ABCDEFGHIJ';
            const templates = [
                "Find the big letter {L}!",
                "Tap the capital letter {L}!",
                "Which of these is the big letter {L}?",
                "Help Aarti Ma'am find the capital letter {L}!",
                "Click on the big letter {L}!",
                "Look for the capital letter {L}!",
                "Which one is the big letter {L}?",
                "Aarti Ma'am says: touch the letter {L}!",
                "Can you find the capital letter {L}?",
                "Point to the big letter {L}!"
            ];
            for (let i = 0; i < 100; i++) {
                const targetIdx = Math.floor(i / 10);
                const L = letters[targetIdx];
                const qText = templates[i % 10].replace('{L}', L);
                
                const distractors = [...letters].filter(char => char !== L);
                const shuffledD = shuffleArray(distractors);
                const options = shuffleArray([L, shuffledD[0], shuffledD[1]]);
                
                questions.push({
                    questionText: qText,
                    options: options,
                    answerIndex: options.indexOf(L),
                    illustration: L,
                    type: 'text'
                });
            }
        }
        else if (level === 2) {
            // Big Letters (K-Z) - 100 unique questions
            const letters = 'KLMNOPQRSTUVWXYZ';
            const templates = [
                "Find the big letter {L}!",
                "Tap the capital letter {L}!",
                "Which of these is the big letter {L}?",
                "Help Aarti Ma'am find the capital letter {L}!",
                "Click on the big letter {L}!",
                "Can you find the capital letter {L}?",
                "Point to the big letter {L}!"
            ];
            for (let i = 0; i < 16; i++) {
                const L = letters[i];
                const maxTemplates = i < 4 ? 7 : 6; // 4 * 7 + 12 * 6 = 100
                for (let t = 0; t < maxTemplates; t++) {
                    const qText = templates[t].replace('{L}', L);
                    const distractors = [...letters].filter(char => char !== L);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([L, shuffledD[0], shuffledD[1]]);
                    
                    questions.push({
                        questionText: qText,
                        options: options,
                        answerIndex: options.indexOf(L),
                        illustration: L,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 3) {
            // Small Letters (a-z) - 100 unique questions
            const templates = [
                "Find the small letter {l}!",
                "Tap the lowercase letter {l}!",
                "Which of these is the small letter {l}?",
                "Find the small matching letter for big {L}!"
            ];
            for (let i = 0; i < 26; i++) {
                const l = lowercaseAlphabet[i];
                const L = alphabet[i];
                const maxTemplates = i < 22 ? 4 : 3; // 22 * 4 + 4 * 3 = 100
                for (let t = 0; t < maxTemplates; t++) {
                    const qText = templates[t].replace('{l}', l).replace('{L}', L);
                    const distractors = [...lowercaseAlphabet].filter(char => char !== l);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([l, shuffledD[0], shuffledD[1]]);
                    
                    questions.push({
                        questionText: qText,
                        options: options,
                        answerIndex: options.indexOf(l),
                        illustration: l,
                        type: 'text'
                    });
                }
            }
        }
        else if (level === 4) {
            // Letter Sounds - 100 unique questions
            const phonicSounds = [
                { l: 'A', s: 'Ah' }, { l: 'B', s: 'Buh' }, { l: 'C', s: 'Cuh' }, { l: 'D', s: 'Duh' },
                { l: 'E', s: 'Eh' }, { l: 'F', s: 'Fuh' }, { l: 'G', s: 'Guh' }, { l: 'H', s: 'Huh' },
                { l: 'I', s: 'Ih' }, { l: 'J', s: 'Juh' }, { l: 'K', s: 'Kuh' }, { l: 'L', s: 'Luh' },
                { l: 'M', s: 'Muh' }, { l: 'N', s: 'Nuh' }, { l: 'O', s: 'Oh' }, { l: 'P', s: 'Puh' },
                { l: 'Q', s: 'Quuh' }, { l: 'R', s: 'Ruh' }, { l: 'S', s: 'Sss' }, { l: 'T', s: 'Tuh' },
                { l: 'U', s: 'Uh' }, { l: 'V', s: 'Vuh' }, { l: 'W', s: 'Wuh' }, { l: 'X', s: 'Ks' },
                { l: 'Y', s: 'Yuh' }, { l: 'Z', s: 'Zuh' }
            ];
            const templates = [
                "Which letter makes the \"{s}\" sound?",
                "Find the letter that sounds like \"{s}\"!",
                "Help Aarti Ma'am find the \"{s}\" sound!",
                "Tap the letter that makes the sound \"{s}\"!"
            ];
            for (let i = 0; i < 26; i++) {
                const item = phonicSounds[i];
                const maxTemplates = i < 22 ? 4 : 3; // 22 * 4 + 4 * 3 = 100
                for (let t = 0; t < maxTemplates; t++) {
                    const qText = templates[t].replace('{s}', item.s);
                    const distractors = alphabet.split('').filter(char => char !== item.l);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([item.l, shuffledD[0], shuffledD[1]]);
                    
                    questions.push({
                        questionText: qText,
                        options: options,
                        answerIndex: options.indexOf(item.l),
                        illustration: '🔊',
                        type: 'sound-id'
                    });
                }
            }
        }
        else if (level === 5) {
            // Word Match & Spelling - 100 unique questions
            for (let i = 0; i < 100; i++) {
                const item = emojiVocab[i];
                const correct = item.letter;
                const hiddenWord = "_" + item.word.slice(1);
                
                const distractors = alphabet.split('').filter(char => char !== correct);
                const shuffledD = shuffleArray(distractors);
                const options = shuffleArray([correct, shuffledD[0], shuffledD[1]]);
                
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
            // Number Land (1-5) - 100 unique questions (20 per number)
            const dotColors = ['🔴', '🔵', '🟢', '🟡'];
            const starEmojis = ['⭐', '🌟', '✨', '💫'];
            const itemsList = ['🍎', '🐱', '🐶', '🎈'];
            
            for (let num = 1; num <= 5; num++) {
                for (let q = 0; q < 20; q++) {
                    let qText = '';
                    let illustration = '';
                    let qType = 'text';
                    
                    const distractors = [1,2,3,4,5].filter(n => n !== num);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([num, shuffledD[0], shuffledD[1]]);
                    
                    if (q < 4) {
                        const phrasings = [
                            `Find the number ${num}!`,
                            `Tap the number ${num}!`,
                            `Which one is number ${num}?`,
                            `Aarti Ma'am says: find number ${num}!`
                        ];
                        qText = phrasings[q];
                        illustration = '🔢';
                        qType = 'number';
                    } else if (q < 8) {
                        const color = dotColors[q - 4];
                        qText = `Count the pretty ${color} dots!`;
                        illustration = Array(num).fill(color).join(' ');
                        qType = 'counting';
                    } else if (q < 12) {
                        const star = starEmojis[q - 8];
                        qText = `How many sparkling ${star} stars do you see?`;
                        illustration = Array(num).fill(star).join(' ');
                        qType = 'counting';
                    } else if (q < 16) {
                        const item = itemsList[q - 12];
                        qText = `Count the cute ${item}!`;
                        illustration = Array(num).fill(item).join(' ');
                        qType = 'counting';
                    } else {
                        const index = q - 16;
                        const phrasings = [
                            `Which button shows number ${num}?`,
                            `Choose the number ${num}!`,
                            `Look for the number ${num}!`,
                            `Point to the number ${num}!`
                        ];
                        qText = phrasings[index];
                        illustration = '🔢';
                        qType = 'number';
                    }
                    
                    questions.push({
                        questionText: qText,
                        options: options,
                        answerIndex: options.indexOf(num),
                        illustration: illustration,
                        type: qType
                    });
                }
            }
        }
        else if (level === 2) {
            // Number Land (6-10) - 100 unique questions (20 per number)
            const dotColors = ['🔴', '🔵', '🟢', '🟡'];
            const starEmojis = ['⭐', '🌟', '✨', '💫'];
            const itemsList = ['🍎', '🐱', '🐶', '🎈'];
            
            for (let num = 6; num <= 10; num++) {
                for (let q = 0; q < 20; q++) {
                    let qText = '';
                    let illustration = '';
                    let qType = 'text';
                    
                    const distractors = [6,7,8,9,10].filter(n => n !== num);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([num, shuffledD[0], shuffledD[1]]);
                    
                    if (q < 4) {
                        const phrasings = [
                            `Find the number ${num}!`,
                            `Tap the number ${num}!`,
                            `Which one is number ${num}?`,
                            `Aarti Ma'am says: find number ${num}!`
                        ];
                        qText = phrasings[q];
                        illustration = '🔢';
                        qType = 'number';
                    } else if (q < 8) {
                        const color = dotColors[q - 4];
                        qText = `Count the pretty ${color} dots!`;
                        illustration = Array(num).fill(color).join(' ');
                        qType = 'counting';
                    } else if (q < 12) {
                        const star = starEmojis[q - 8];
                        qText = `How many sparkling ${star} stars do you see?`;
                        illustration = Array(num).fill(star).join(' ');
                        qType = 'counting';
                    } else if (q < 16) {
                        const item = itemsList[q - 12];
                        qText = `Count the cute ${item}!`;
                        illustration = Array(num).fill(item).join(' ');
                        qType = 'counting';
                    } else {
                        const index = q - 16;
                        const phrasings = [
                            `Which button shows number ${num}?`,
                            `Choose the number ${num}!`,
                            `Look for the number ${num}!`,
                            `Point to the number ${num}!`
                        ];
                        qText = phrasings[index];
                        illustration = '🔢';
                        qType = 'number';
                    }
                    
                    questions.push({
                        questionText: qText,
                        options: options,
                        answerIndex: options.indexOf(num),
                        illustration: illustration,
                        type: qType
                    });
                }
            }
        }
        else if (level === 3) {
            // Counting Fun (1-10) - 100 unique questions using 100 unique emojis
            const uniqueEmojis = [
                { e: '🍎', n: 'apples' }, { e: '🎈', n: 'balloons' }, { e: '🐱', n: 'kittens' }, { e: '🐶', n: 'puppies' },
                { e: '🐻', n: 'bears' }, { e: '🐸', n: 'frogs' }, { e: '🦁', n: 'lions' }, { e: '🚗', n: 'cars' },
                { e: '🍭', n: 'lollipops' }, { e: '🍔', n: 'burgers' }, { e: '🚀', n: 'rockets' }, { e: '🍩', n: 'donuts' },
                { e: '🍪', n: 'cookies' }, { e: '🍓', n: 'strawberries' }, { e: '🍌', n: 'bananas' }, { e: '🍍', n: 'pineapples' },
                { e: '🍉', n: 'watermelons' }, { e: '🍒', n: 'cherries' }, { e: '🍇', n: 'grapes' }, { e: '🍊', n: 'oranges' },
                { e: '🍋', n: 'lemons' }, { e: '🍐', n: 'pears' }, { e: '🍑', n: 'peaches' }, { e: '🥝', n: 'kiwis' },
                { e: '🥥', n: 'coconuts' }, { e: '🥑', n: 'avocados' }, { e: '🥕', n: 'carrots' }, { e: '🌽', n: 'corns' },
                { e: '🥦', n: 'broccolis' }, { e: '🍄', n: 'mushrooms' }, { e: '🥨', n: 'pretzels' }, { e: '🥞', n: 'pancakes' },
                { e: '🧀', n: 'cheeses' }, { e: '🍕', n: 'pizzas' }, { e: '🌭', n: 'hotdogs' }, { e: '🌮', n: 'tacos' },
                { e: '🥚', n: 'eggs' }, { e: '🍿', n: 'popcorns' }, { e: '🧁', n: 'cupcakes' }, { e: '🍫', n: 'chocolates' },
                { e: '🍬', n: 'candies' }, { e: '🍯', n: 'honey pots' }, { e: '🥛', n: 'milk glasses' }, { e: '☕', n: 'coffee cups' },
                { e: '🍵', n: 'tea cups' }, { e: '🧃', n: 'juice boxes' }, { e: '🦀', n: 'crabs' }, { e: '🦞', n: 'lobsters' },
                { e: '🦐', n: 'shrimps' }, { e: '🦑', n: 'squids' }, { e: '🐙', n: 'octopuses' }, { e: '🐟', n: 'fishes' },
                { e: '🐬', n: 'dolphins' }, { e: '🐳', n: 'whales' }, { e: '🐢', n: 'turtles' }, { e: '🐍', n: 'snakes' },
                { e: '🦎', n: 'lizards' }, { e: '🦖', n: 'dinosaurs' }, { e: '🦋', n: 'butterflies' }, { e: '🐝', n: 'honeybees' },
                { e: '🐞', n: 'ladybugs' }, { e: '🐜', n: 'ants' }, { e: '🕷️', n: 'spiders' }, { e: '🦂', n: 'scorpions' },
                { e: '🐔', n: 'chickens' }, { e: '🦆', n: 'ducks' }, { e: '🦉', n: 'owls' }, { e: '🦅', n: 'eagles' },
                { e: '🦜', n: 'parrots' }, { e: '🦢', n: 'swans' }, { e: '🦚', n: 'peacocks' }, { e: '🐧', n: 'penguins' },
                { e: '🐨', n: 'koalas' }, { e: '🐼', n: 'pandas' }, { e: '🦊', n: 'foxes' }, { e: '🐰', n: 'bunnies' },
                { e: '🐹', n: 'hamsters' }, { e: '🐭', n: 'mice' }, { e: '🐿️', n: 'squirrels' }, { e: '🦌', n: 'deers' },
                { e: '🐎', n: 'horses' }, { e: '🐖', n: 'pigs' }, { e: '🐑', n: 'sheeps' }, { e: '🐄', n: 'cows' },
                { e: '🐫', n: 'camels' }, { e: '🐘', n: 'elephants' }, { e: '🦒', n: 'giraffes' }, { e: '🐒', n: 'monkeys' },
                { e: '🐆', n: 'leopards' }, { e: '🐅', n: 'tigers' }, { e: '🦓', n: 'zebras' }, { e: '🦘', n: 'kangaroos' },
                { e: '🦡', n: 'badgers' }, { e: '🦫', n: 'beavers' }, { e: '🦦', n: 'otters' }, { e: '🦭', n: 'seals' },
                { e: '🦄', n: 'unicorns' }, { e: '🛸', n: 'flying saucers' }, { e: '🔔', n: 'bells' }
            ];
            for (let i = 0; i < 100; i++) {
                const correctCount = (i % 10) + 1;
                const item = uniqueEmojis[i];
                const illustration = Array(correctCount).fill(item.e).join(' ');
                
                const distractors = [1,2,3,4,5,6,7,8,9,10].filter(c => c !== correctCount);
                const shuffledD = shuffleArray(distractors);
                const options = shuffleArray([correctCount, shuffledD[0], shuffledD[1]]);
                
                questions.push({
                    questionText: `How many ${item.n} can you count in the box?`,
                    options: options,
                    answerIndex: options.indexOf(correctCount),
                    illustration: illustration,
                    type: 'counting'
                });
            }
        }
        else if (level === 4) {
            // Colors & Shapes - 100 unique questions
            const shapes = ['circle', 'square', 'triangle', 'star'];
            const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'];
            
            const fruitColorQuestions = [
                { item: 'Red Apple 🍎', ans: 'red', q: 'What color is the sweet Apple?' },
                { item: 'Yellow Banana 🍌', ans: 'yellow', q: 'What color is the ripe Banana?' },
                { item: 'Green Broccoli 🥦', ans: 'green', q: 'What color is the healthy Broccoli?' },
                { item: 'Orange Carrot 🥕', ans: 'orange', q: 'What color is the crunchy Carrot?' },
                { item: 'Pink Flower 🌸', ans: 'pink', q: 'What color is the pretty flower?' },
                { item: 'White Egg 🥚', ans: 'white', q: 'What color is the chicken Egg?' },
                { item: 'Black Cat 🐈‍⬛', ans: 'black', q: 'What color is the night Cat?' },
                { item: 'Brown Chocolate 🍫', ans: 'brown', q: 'What color is the yummy Chocolate?' },
                { item: 'Purple Grapes 🍇', ans: 'purple', q: 'What color is the bunch of Grapes?' },
                { item: 'Blue Sky ☁️', ans: 'blue', q: 'What color is the high Sky?' }
            ];
            
            for (let i = 0; i < 100; i++) {
                if (i < 50) {
                    const base = fruitColorQuestions[i % fruitColorQuestions.length];
                    const correctColor = base.ans;
                    const distractors = colors.filter(c => c !== correctColor);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([correctColor, shuffledD[0], shuffledD[1]]);
                    
                    questions.push({
                        questionText: `${base.q} (Question #${i + 1})`,
                        options: options,
                        answerIndex: options.indexOf(correctColor),
                        illustration: base.item.split(' ').pop(),
                        type: 'color-match'
                    });
                } else {
                    const shape = shapes[i % shapes.length];
                    const randomColor = colors[i % colors.length];
                    
                    const correctShape = shape;
                    const distractors = shapes.filter(s => s !== correctShape);
                    const shuffledD = shuffleArray(distractors);
                    const options = shuffleArray([correctShape, shuffledD[0], shuffledD[1]]);
                    
                    questions.push({
                        questionText: `Find the ${correctShape.toUpperCase()} shape in ${randomColor}!`,
                        options: options,
                        answerIndex: options.indexOf(correctShape),
                        illustration: '🔺',
                        type: 'shape-match'
                    });
                }
            }
        }
        else if (level === 5) {
            // Size & Patterns - 100 unique questions
            const sizePairs = [
                { l: '🐘', s: '🐭', nameL: 'Elephant', nameS: 'Mouse' },
                { l: '🦁', s: '🐿️', nameL: 'Lion', nameS: 'Squirrel' },
                { l: '🏠', s: '🔑', nameL: 'House', nameS: 'Key' },
                { l: '🚌', s: '🚲', nameL: 'Bus', nameS: 'Bicycle' },
                { l: '🐳', s: '🐟', nameL: 'Whale', nameS: 'Fish' },
                { l: '🌳', s: '🌸', nameL: 'Tree', nameS: 'Flower' },
                { l: '✈️', s: '🪁', nameL: 'Airplane', nameS: 'Kite' },
                { l: '🏰', s: '🧱', nameL: 'Castle', nameS: 'Brick' },
                { l: '🚢', s: '⛵', nameL: 'Ship', nameS: 'Boat' },
                { l: '🦖', s: '🐛', nameL: 'Dinosaur', nameS: 'Caterpillar' }
            ];
            
            const patternItems = [
                { s: ['🍎', '🍌'], label: 'Apple and Banana' },
                { s: ['🐶', '🐱'], label: 'Dog and Cat' },
                { s: ['🔴', '🟢'], label: 'Red circle and Green circle' },
                { s: ['⭐️', '🌙'], label: 'Star and Moon' },
                { s: ['🚗', '🚀'], label: 'Car and Rocket' },
                { s: ['🦁', '🐵'], label: 'Lion and Monkey' },
                { s: ['🎈', '🪁'], label: 'Balloon and Kite' },
                { s: ['🌸', '🍃'], label: 'Flower and Leaf' },
                { s: ['🍦', '🍩'], label: 'Ice cream and Donut' },
                { s: ['☀️', '☁️'], label: 'Sun and Cloud' }
            ];
            
            for (let i = 0; i < 100; i++) {
                if (i < 50) {
                    const pair = sizePairs[i % sizePairs.length];
                    const askBigger = i % 2 === 0;
                    const correct = askBigger ? pair.l : pair.s;
                    const incorrect = askBigger ? pair.s : pair.l;
                    
                    const options = shuffleArray([correct, incorrect]);
                    questions.push({
                        questionText: `Which one is ${askBigger ? 'BIGGER' : 'SMALLER'}?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: '📏',
                        type: 'size',
                        optionSizes: {
                            [pair.l]: '64px',
                            [pair.s]: '32px'
                        }
                    });
                } else {
                    const item = patternItems[i % patternItems.length];
                    const correct = item.s[0];
                    const incorrect = item.s[1];
                    const seq = `${item.s[0]} ${item.s[1]} ${item.s[0]} ${item.s[1]} ${item.s[0]}`;
                    
                    const options = shuffleArray([correct, incorrect]);
                    questions.push({
                        questionText: `What comes next in the pattern of ${item.label}?`,
                        options: options,
                        answerIndex: options.indexOf(correct),
                        illustration: `${seq} ... ?`,
                        type: 'pattern'
                    });
                }
            }
        }
    }

    if (category === 'gktrivia') {
        const levelQuestions = gkQuestions[level.toString()] || [];
        levelQuestions.forEach((item) => {
            const correctOpt = item.options[item.ansIdx];
            const options = shuffleArray(item.options);
            questions.push({
                questionText: item.q,
                options: options,
                answerIndex: options.indexOf(correctOpt),
                illustration: getGkIllustration(level, item.q),
                type: 'text'
            });
        });
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
                usageTime: {},
                loginCount: {}
            };
        }
        if (!state.progress[username].usageTime) {
            state.progress[username].usageTime = {};
        }
        if (!state.progress[username].loginCount) {
            state.progress[username].loginCount = {};
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

// Manage tracking sessions
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
    
    if (viewId === 'view-login' || viewId === 'view-admin-dashboard') {
        headerProfile.style.display = 'none';
        headerNavPills.style.display = 'none';
        headerLogout.style.display = 'none';
        document.body.className = '';
        stopUsageTracking();
    } else {
        if (state.currentUser && state.currentUser !== 'admin') {
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
    let parentLoginMode = false;
    const typeToggle = document.getElementById('login-type-toggle');
    const usernameGroup = document.getElementById('login-username-group');
    const profilesGrid = document.getElementById('login-profiles-grid');
    const loginTitle = document.getElementById('login-title');
    const pwdLabel = document.getElementById('login-password-label');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    typeToggle.addEventListener('click', () => {
        parentLoginMode = !parentLoginMode;
        if (parentLoginMode) {
            profilesGrid.style.display = 'none';
            usernameGroup.style.display = 'block';
            usernameInput.required = true;
            loginTitle.textContent = "🔑 Parent/Teacher Admin Login";
            pwdLabel.textContent = "Enter Admin Password:";
            typeToggle.textContent = "🧒 Back to Kid Profiles";
            usernameInput.value = '';
            passwordInput.value = '';
        } else {
            profilesGrid.style.display = 'grid';
            usernameGroup.style.display = 'none';
            usernameInput.required = false;
            loginTitle.textContent = "Select Your Profile";
            pwdLabel.textContent = "Enter Your Password:";
            typeToggle.textContent = "🔑 Parent/Teacher Login";
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    // 1. Submit Login Form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (parentLoginMode) {
            const user = usernameInput.value.trim().toLowerCase();
            const pass = passwordInput.value.trim();
            
            if (user === 'man' && pass === 'man') {
                state.currentUser = 'admin';
                passwordInput.value = '';
                usernameInput.value = '';
                
                setupAdminDashboardView();
                switchView('view-admin-dashboard');
                speakText("Welcome to Aarti Ma'am's master administration portal.");
            } else {
                alert("Incorrect parent/admin credentials!");
            }
            return;
        }
        
        const selectedProfile = document.querySelector('.login-profile-select.selected');
        if (!selectedProfile) return;
        
        const username = selectedProfile.getAttribute('data-username');
        const password = passwordInput.value.trim();
        
        const kid = KIDS_PROFILES[username];
        
        if (kid && kid.password === password) {
            state.currentUser = username;
            passwordInput.value = ''; 
            
            // Increment today's login count
            const today = new Date().toISOString().split('T')[0];
            if (!state.progress[username].loginCount) {
                state.progress[username].loginCount = {};
            }
            state.progress[username].loginCount[today] = (state.progress[username].loginCount[today] || 0) + 1;
            saveProgress();
            
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
            btn.style.fontSize = qData.optionSizes[opt] || '48px';
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
    
    if (state.currentQuestion.options && state.currentQuestion.options.length > 0) {
        const type = state.currentQuestion.type;
        const optionsText = state.currentQuestion.options.map((opt) => {
            let txt = opt.toString();
            if (type === 'size') {
                if (txt === '🐘') txt = 'Elephant';
                else if (txt === '🐭') txt = 'Mouse';
                else if (txt === '🦁') txt = 'Lion';
                else if (txt === '🐿️') txt = 'Squirrel';
                else if (txt === '🏠') txt = 'House';
                else if (txt === '🔑') txt = 'Key';
                else if (txt === '🚌') txt = 'Bus';
                else if (txt === '🚲') txt = 'Bicycle';
                else if (txt === '🐳') txt = 'Whale';
                else if (txt === '🐟') txt = 'Fish';
                else if (txt === '🌳') txt = 'Tree';
                else if (txt === '🌸') txt = 'Flower';
                else if (txt === '✈️') txt = 'Airplane';
                else if (txt === '🪁') txt = 'Kite';
                else if (txt === '🏰') txt = 'Castle';
                else if (txt === '🧱') txt = 'Brick';
                else if (txt === '🚢') txt = 'Ship';
                else if (txt === '⛵') txt = 'Boat';
                else if (txt === '🦖') txt = 'Dinosaur';
                else if (txt === '🐛') txt = 'Caterpillar';
            }
            return txt;
        }).join(', or ');
        
        speechPrompt += `. Is it: ${optionsText}?`;
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

function setupAdminDashboardView() {
    const grid = document.getElementById('admin-kids-dashboard-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    for (const username in KIDS_PROFILES) {
        const kid = KIDS_PROFILES[username];
        const kidData = state.progress[username] || { levels: {}, history: [], usageTime: {}, loginCount: {} };

        let totalStars = 0;
        let totalErrors = 0;
        for (const key in kidData.levels) {
            const lvlData = kidData.levels[key];
            totalStars += lvlData.score;
            totalErrors += lvlData.errors;
        }
        
        const accuracy = totalStars > 0 
            ? Math.round((totalStars / (totalStars + totalErrors)) * 100) 
            : 100;

        let totalSecondsSpent = 0;
        for (const date in kidData.usageTime) {
            totalSecondsSpent += kidData.usageTime[date];
        }
        
        let timeDisplay = '';
        if (totalSecondsSpent < 60) {
            timeDisplay = `${totalSecondsSpent}s`;
        } else {
            const mins = Math.floor(totalSecondsSpent / 60);
            const secs = totalSecondsSpent % 60;
            timeDisplay = `${mins}m ${secs}s`;
        }

        const todaySeconds = kidData.usageTime[today] || 0;
        const todayTimeDisplay = todaySeconds < 60 ? `${todaySeconds}s` : `${Math.floor(todaySeconds/60)}m ${todaySeconds%60}s`;

        const todayLogins = (kidData.loginCount && kidData.loginCount[today]) || 0;
        let totalLogins = 0;
        for (const date in kidData.loginCount || {}) {
            totalLogins += kidData.loginCount[date];
        }

        let phProgress = 0;
        let mathProgress = 0;
        let gkProgress = 0;

        for (const key in kidData.levels) {
            const lvlData = kidData.levels[key];
            if (key.startsWith('phonics_')) phProgress += lvlData.score;
            else if (key.startsWith('math_')) mathProgress += lvlData.score;
            else if (key.startsWith('gktrivia_')) gkProgress += lvlData.score;
        }

        const phPct = Math.round((phProgress / 500) * 100);
        const mathPct = Math.round((mathProgress / 500) * 100);
        const gkPct = Math.round((gkProgress / 500) * 100);

        const card = document.createElement('div');
        card.style.background = 'white';
        card.style.borderRadius = '20px';
        card.style.padding = '25px';
        card.style.boxShadow = '0 8px 30px rgba(0,0,0,0.05)';
        card.style.border = '2px solid #f3e8ff';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '20px';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; border-bottom: 2px solid #faf5ff; padding-bottom: 15px;">
                <div style="width: 55px; height: 55px; border-radius: 50%; background: #faf5ff; color: var(--theme-color-primary); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid #f3e8ff;">
                    <div style="width: 35px; height: 35px; color: #a855f7;">${kid.avatar}</div>
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e1b4b;">${kid.name}</h3>
                    <span style="font-size: 12px; color: #8b5cf6; font-weight: 700;">Landmark: ${kid.landmarkName}</span>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: #faf5ff; padding: 15px; border-radius: 14px; text-align: center; border: 1px solid #f3e8ff;">
                    <div style="font-size: 24px; font-weight: 800; color: #6b21a8;">⭐ ${totalStars}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #a855f7; margin-top: 5px;">Total Stars</div>
                </div>
                <div style="background: #faf5ff; padding: 15px; border-radius: 14px; text-align: center; border: 1px solid #f3e8ff;">
                    <div style="font-size: 24px; font-weight: 800; color: #6b21a8;">🎯 ${accuracy}%</div>
                    <div style="font-size: 11px; font-weight: 700; color: #a855f7; margin-top: 5px;">Accuracy</div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #4b5563; background: #faf5ff; padding: 15px; border-radius: 14px; border: 1px solid #f3e8ff;">
                <div style="display: flex; justify-content: space-between;">
                    <span>🕒 Time Today:</span>
                    <strong style="color: #6b21a8;">${todayTimeDisplay}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>⏳ Total Time (Lifetime):</span>
                    <strong style="color: #6b21a8;">${timeDisplay}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>🚪 Logins Today:</span>
                    <strong style="color: #6b21a8;">${todayLogins} times</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>🔄 Total Logins (Lifetime):</span>
                    <strong style="color: #6b21a8;">${totalLogins}</strong>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #374151;">Category Breakdown</h4>
                
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
                        <span>🍎 Phonics (${phProgress}/500 Stars)</span>
                        <span>${phPct}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #f3e8ff; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${phPct}%; height: 100%; background: #a855f7; border-radius: 4px;"></div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
                        <span>🔢 Math (${mathProgress}/500 Stars)</span>
                        <span>${mathPct}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #e0f2fe; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${mathPct}%; height: 100%; background: #0ea5e9; border-radius: 4px;"></div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
                        <span>🧠 GK Trivia (${gkProgress}/500 Stars)</span>
                        <span>${gkPct}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #dcfce7; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${gkPct}%; height: 100%; background: #22c55e; border-radius: 4px;"></div>
                    </div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    }
}
