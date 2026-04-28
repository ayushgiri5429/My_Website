
// Load Three.js from CDN
const threeScript = document.createElement('script');
threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
document.head.appendChild(threeScript);

let scene, camera, renderer, particlesMesh, clock;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

threeScript.onload = () => {
    initThreeJS();
    animateThreeJS();
};

function initThreeJS() {
    // Create canvas container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-2';
    container.style.pointerEvents = 'none';
    document.body.insertBefore(container, document.body.firstChild);
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    clock = new THREE.Clock();
    
    // Create floating particles geometry
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
        // Spherical distribution for 3D effect
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Colors: blue to purple gradient
        colors[i * 3] = 0.2 + Math.random() * 0.5;     // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Custom shader material for glow effect
    const vertexShader = `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (300.0 / -mvPosition.z) * 0.8;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    
    const fragmentShader = `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            float alpha = texColor.a * 0.8;
            gl_FragColor = vec4(vColor, alpha);
        }
    `;
    
    // Create canvas texture for particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 10;
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7
    });
    
    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add a rotating torus knot for extra 3D effect
    const knotGeometry = new THREE.TorusKnotGeometry(5, 1.2, 200, 32, 3, 4);
    const knotMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(torusKnot);
    
    // Store knot for animation
    window.torusKnot = torusKnot;
    
    // Mouse movement tracking
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
    });
    
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animateThreeJS() {
    if (!scene || !camera || !renderer) return;
    
    requestAnimationFrame(animateThreeJS);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Smooth rotation based on mouse
    if (particlesMesh) {
        particlesMesh.rotation.x += (targetRotationX - particlesMesh.rotation.x) * 0.05;
        particlesMesh.rotation.y += (targetRotationY - particlesMesh.rotation.y) * 0.05;
        
        // Add automatic floating animation
        particlesMesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;
    }
    
    if (window.torusKnot) {
        window.torusKnot.rotation.x = elapsedTime * 0.2;
        window.torusKnot.rotation.y = elapsedTime * 0.3;
    }
    
    renderer.render(scene, camera);
}

// ==============================================
// 2. DANGEROUS MAGNETIC MOUSE WITH EXPLOSION EFFECT
// ==============================================
class MagneticExplosion {
    constructor() {
        this.magneticElements = [];
        this.explosions = [];
        this.init();
    }
    
    init() {
        // Select all interactive elements
        const elements = document.querySelectorAll('.project-card, .skill-cat, .btn, .github-link, .nav-links a');
        
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.magneticEffect(e, el));
            el.addEventListener('mouseenter', (e) => this.createExplosion(e, el));
            el.addEventListener('mouseleave', () => this.resetMagnetic(el));
        });
        
        // Add magnetic field style
        const style = document.createElement('style');
        style.textContent = `
            .project-card, .skill-cat, .btn, .github-link {
                transition: transform 0.08s cubic-bezier(0.2, 1.2, 0.8, 1);
                will-change: transform;
            }
        `;
        document.head.appendChild(style);
    }
    
    magneticEffect(e, el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 25;
            const moveX = (deltaX / distance) * force || 0;
            const moveY = (deltaY / distance) * force || 0;
            
            el.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px) scale(1.02)`;
            el.style.zIndex = '100';
        }
    }
    
    resetMagnetic(el) {
        el.style.transform = '';
        el.style.zIndex = '';
    }
    
    createExplosion(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create particle explosion
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: ${4 + Math.random() * 6}px;
                height: ${4 + Math.random() * 6}px;
                background: radial-gradient(circle, #3b82f6, #1e40af);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: explodeParticle 0.6s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            let posX = e.clientX;
            let posY = e.clientY;
            let currentVx = vx;
            let currentVy = vy;
            let opacity = 1;
            let size = 4 + Math.random() * 6;
            
            const animateParticle = () => {
                posX += currentVx;
                posY += currentVy;
                currentVy += 0.5; // gravity
                opacity -= 0.03;
                size *= 0.95;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                if (opacity > 0 && size > 1) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
        
        // Add explosion sound effect (optional - beep-like)
        this.playExplosionSound();
    }
    
    playExplosionSound() {
        // Create subtle audio feedback (optional, won't autoplay without user interaction)
        // Using Web Audio API for a tiny "pop"
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
            oscillator.stop(audioCtx.currentTime + 0.3);
            
            // Resume audio context if suspended
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch(e) {
            // Silently fail if audio not supported
        }
    }
}

// ==============================================
// 3. CRAZY CUSTOM CURSOR WITH TRAIL, RIPPLE, AND LIGHTNING
// ==============================================
class InsaneCursor {
    constructor() {
        this.cursor = null;
        this.trails = [];
        this.ripples = [];
        this.lightning = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.speed = 0;
        this.init();
    }
    
    init() {
        // Create main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'insane-cursor';
        this.cursor.innerHTML = `
            <div class="cursor-core"></div>
            <div class="cursor-ring-1"></div>
            <div class="cursor-ring-2"></div>
            <div class="cursor-lightning"></div>
        `;
        document.body.appendChild(this.cursor);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .insane-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                filter: drop-shadow(0 0 10px rgba(59,130,246,0.8));
            }
            .cursor-core {
                position: absolute;
                width: 12px;
                height: 12px;
                background: radial-gradient(circle, #3b82f6, #1e40af);
                border-radius: 50%;
                top: -6px;
                left: -6px;
                animation: pulse 0.5s ease infinite alternate;
            }
            .cursor-ring-1 {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(59,130,246,0.8);
                border-radius: 50%;
                top: -20px;
                left: -20px;
                animation: rotateRing 3s linear infinite;
            }
            .cursor-ring-2 {
                position: absolute;
                width: 60px;
                height: 60px;
                border: 1px solid rgba(96,165,250,0.5);
                border-radius: 50%;
                top: -30px;
                left: -30px;
                animation: rotateRingReverse 4s linear infinite;
            }
            .cursor-lightning {
                position: absolute;
                width: 80px;
                height: 80px;
                background: radial-gradient(circle, rgba(59,130,246,0.3), transparent);
                border-radius: 50%;
                top: -40px;
                left: -40px;
                opacity: 0;
                transition: opacity 0.1s;
            }
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.5); opacity: 0.5; }
            }
            @keyframes rotateRing {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes rotateRingReverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            .cursor-trail {
                position: fixed;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, #60a5fa, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: trailFade 0.5s ease-out forwards;
            }
            @keyframes trailFade {
                0% { opacity: 0.8; transform: scale(1); }
                100% { opacity: 0; transform: scale(0); }
            }
            .cursor-ripple {
                position: fixed;
                border: 2px solid #3b82f6;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                animation: rippleExpand 0.6s ease-out forwards;
            }
            @keyframes rippleExpand {
                0% { width: 0; height: 0; opacity: 0.8; margin-left: 0; margin-top: 0; }
                100% { width: 100px; height: 100px; opacity: 0; margin-left: -50px; margin-top: -50px; }
            }
            @media (max-width: 768px) {
                .insane-cursor { display: none; }
            }
        `;
        document.head.appendChild(style);
        
        // Track mouse movement with speed detection
        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            this.speed = Math.sqrt(dx * dx + dy * dy);
            
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.updateCursorPosition();
            this.createTrail();
            
            // Create lightning effect on fast movement
            if (this.speed > 30) {
                this.createLightning();
            }
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });
        
        // Click effect
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
            this.shakeCursor();
        });
        
        this.animate();
    }
    
    updateCursorPosition() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
            
            // Scale based on speed
            const scale = Math.min(1 + this.speed / 50, 2);
            const lightning = this.cursor.querySelector('.cursor-lightning');
            if (lightning) {
                lightning.style.opacity = Math.min(this.speed / 100, 0.8);
            }
        }
    }
    
    createTrail() {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = this.mouseX + 'px';
        trail.style.top = this.mouseY + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    createLightning() {
        const lightning = document.createElement('div');
        lightning.style.position = 'fixed';
        lightning.style.left = this.mouseX + 'px';
        lightning.style.top = this.mouseY + 'px';
        lightning.style.width = '2px';
        lightning.style.height = '2px';
        lightning.style.background = 'white';
        lightning.style.borderRadius = '50%';
        lightning.style.boxShadow = '0 0 20px 10px rgba(59,130,246,0.8)';
        lightning.style.pointerEvents = 'none';
        lightning.style.zIndex = '9997';
        document.body.appendChild(lightning);
        
        setTimeout(() => lightning.remove(), 100);
    }
    
    shakeCursor() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) scale(1.3)`;
            setTimeout(() => {
                this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) scale(1)`;
            }, 100);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// ==============================================
// 4. TYPING EFFECT WITH GLITCH AND SHAKE
// ==============================================
const roles = [
    "Full Stack Web Developer", 
    "Python Django Developer", 
    "3D Web Artisan",
    "Experience Creator"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextSpan = document.getElementById("typed-text");

function typeEffect() {
    if (!typedTextSpan) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedTextSpan.innerText = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.innerText = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    // Extreme glitch effect
    if (Math.random() < 0.15) {
        typedTextSpan.style.transform = `skew(${Math.random() * 10 - 5}deg) translateX(${Math.random() * 4 - 2}px)`;
        typedTextSpan.style.textShadow = `${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0px rgba(59,130,246,0.5)`;
        setTimeout(() => {
            typedTextSpan.style.transform = '';
            typedTextSpan.style.textShadow = '';
        }, 50);
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2500);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 400);
        return;
    }
    
    const speed = isDeleting ? 40 : 80;
    setTimeout(typeEffect, speed);
}

// ==============================================
// 5. RAGING DARK MODE WITH FLASH EFFECT
// ==============================================
const themeToggle = document.getElementById("themeToggle");

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    // Flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = document.body.classList.contains('dark') ? 'white' : '#0f172a';
    flash.style.zIndex = '10002';
    flash.style.pointerEvents = 'none';
    flash.style.animation = 'flashFade 0.3s ease-out forwards';
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 300);
    
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Add flash animation
const flashStyle = document.createElement('style');
flashStyle.textContent = `
    @keyframes flashFade {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(flashStyle);

// ==============================================
// 6. MOBILE MENU
// ==============================================
const menuIcon = document.getElementById("menuIcon");
const navLinks = document.getElementById("navLinks");

function toggleMobileMenu() {
    if (!navLinks || !menuIcon) return;
    
    navLinks.classList.toggle("active");
    const icon = menuIcon.querySelector("i");
    
    if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        document.body.style.overflow = "hidden";
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        document.body.style.overflow = "";
    }
}

function closeMobileMenu() {
    if (!navLinks || !menuIcon) return;
    navLinks.classList.remove("active");
    const icon = menuIcon.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    document.body.style.overflow = "";
}

// ==============================================
// 7. INITIALIZE EVERYTHING
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
    loadTheme();
    
    // Initialize extreme effects after a short delay
    setTimeout(() => {
        if (window.innerWidth > 768) {
            new MagneticExplosion();
            new InsaneCursor();
        }
    }, 100);
    
    // Mobile menu
    if (menuIcon) {
        menuIcon.addEventListener("click", toggleMobileMenu);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
    
    // Close mobile menu on link click
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", (e) => {
            closeMobileMenu();
            
            const targetId = link.getAttribute("href");
            if (targetId && targetId !== "#") {
                e.preventDefault();
                const navbar = document.querySelector(".navbar");
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - navbarHeight,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
    
    // Add 3D tilt to project cards
    document.querySelectorAll('.project-card, .skill-cat').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${y * 10}deg) rotateY(${x * 10}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    console.log("%c🔥 DANGER MODE ACTIVATED | Extreme 3D Effects Loaded", "color: #ff3366; font-size: 16px; font-weight: bold;");
    console.log("%c⚡ Warning: Contains intense visual effects | Best experienced on desktop", "color: #ff9933; font-size: 12px;");
});
