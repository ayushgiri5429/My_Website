/* ================================================
   ADVANCED LABEL PORTFOLIO — JavaScript
   Features:
   - Particle background animation
   - Typing effect
   - Label-based project filtering with animations
   - Scroll-reveal animations
   - Animated stat counters
   - Animated skill bars
   - Custom cursor
   - Dark/Light theme toggle
   - Smooth scroll & active nav highlighting
   - Back to top button
   - Contact form validation
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ========== PARTICLE BACKGROUND ==========
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      const theme = document.documentElement.getAttribute('data-theme');
      const color = theme === 'light' ? '99, 102, 241' : '129, 140, 248';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const theme = document.documentElement.getAttribute('data-theme');
    const color = theme === 'light' ? '99, 102, 241' : '129, 140, 248';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ========== CUSTOM CURSOR ==========
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let cursorVisible = false;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        cursorVisible = true;
      }
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    document.querySelectorAll('a, button, .filter-btn, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // ========== TYPING EFFECT ==========
  const typedElement = document.getElementById('typed-text');
  const phrases = [
    'web applications.',
    'Django backends.',
    'REST APIs.',
    'responsive UIs.',
    'Python solutions.',
    'clean code.',
    'scalable systems.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ========== THEME TOGGLE ==========
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  // ========== NAVBAR ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  // Scroll effects
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';

    // Active nav link
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    backToTop.classList.toggle('visible', scrollY > 500);
  });

  // Mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========== BACK TO TOP ==========
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== ANIMATED STAT COUNTERS ==========
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(counter);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ========== ANIMATED SKILL BARS ==========
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') + '%';
          }, index * 150);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

  // ========== LABEL-BASED PROJECT FILTERING ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const activeFilterTag = document.getElementById('activeFilterTag');
  const projectCount = document.getElementById('projectCount');

  const filterNames = {
    all: 'All Projects',
    python: 'Python',
    django: 'Django',
    javascript: 'JavaScript',
    fullstack: 'Full Stack',
    frontend: 'Frontend',
    api: 'API'
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active filter display
      activeFilterTag.textContent = filterNames[filter] || filter;

      let visibleCount = 0;

      projectCards.forEach(card => {
        const labels = card.getAttribute('data-labels').split(',');
        const shouldShow = filter === 'all' || labels.includes(filter);

        if (shouldShow) {
          if (card.classList.contains('hidden')) {
            card.classList.remove('hidden');
            card.classList.remove('filtering-out');
            card.classList.add('filtering-in');
            setTimeout(() => card.classList.remove('filtering-in'), 400);
          }
          visibleCount++;
        } else {
          card.classList.add('filtering-out');
          setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('filtering-out');
          }, 350);
        }
      });

      projectCount.textContent = visibleCount + ' project' + (visibleCount !== 1 ? 's' : '');
    });
  });

  // Initialize count
  projectCount.textContent = projectCards.length + ' projects';

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ========== NOTIFICATION SYSTEM ==========
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>
    `;

    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb',
      color: '#fff',
      padding: '0.85rem 1.5rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: '10001',
      fontSize: '0.9rem',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      opacity: '0',
      transition: 'all 0.3s ease',
      maxWidth: '90%'
    });

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = 'background:none;border:none;color:#fff;cursor:pointer;font-size:1rem;padding:0;margin-left:0.5rem;opacity:0.7;';
    closeBtn.addEventListener('click', () => removeNotification(notification));

    setTimeout(() => removeNotification(notification), 4000);
  }

  function removeNotification(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => el.remove(), 300);
  }

  // ========== SMOOTH SCROLL FOR NAV LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== TILT EFFECT ON PROJECT CARDS ==========
  if (window.matchMedia('(hover: hover)').matches) {
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ========== KEYBOARD ACCESSIBILITY ==========
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
});
