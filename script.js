// Дождаться полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', function() {
  // 1. Бургер-меню для мобильных
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Закрываем меню при клике на ссылку
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Слайдер галереи
  const slider = document.getElementById('slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('dotsContainer');
  let currentIndex = 0;
  const totalSlides = slides.length;

  if (slider && totalSlides > 0) {
    // Создаём точки
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    createDots();
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Автоматическое перелистывание каждые 5 секунд
    let autoInterval = setInterval(nextSlide, 5500);
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
      sliderContainer.addEventListener('mouseleave', () => { autoInterval = setInterval(nextSlide, 5500); });
    }
  }

  // 3. Валидация формы обратной связи
  const form = document.getElementById('feedbackForm');
  const statusDiv = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        if (statusDiv) statusDiv.innerHTML = '<span style="color:#c0392b;">❌ Пожалуйста, заполните все поля.</span>';
        return;
      }
      const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
      if (!emailPattern.test(email)) {
        if (statusDiv) statusDiv.innerHTML = '<span style="color:#c0392b;">📧 Введите корректный email (пример: name@domain.ru)</span>';
        return;
      }
      // имитация отправки
      if (statusDiv) {
        statusDiv.innerHTML = '<span style="color:#2c5f2d;">✅ Спасибо! Ваше сообщение принято. Мы свяжемся с вами в ближайшее время.</span>';
      }
      form.reset();
      setTimeout(() => { if (statusDiv) statusDiv.innerHTML = ''; }, 4000);
    });
  }

  // 4. Плавная прокрутка для навигации
  document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const offset = 80; // высота шапки
          const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
      }
    });
  });

  // 5. Активный пункт меню при прокрутке
  const sections = document.querySelectorAll('section, .hero');
  const navLinks = document.querySelectorAll('.nav-menu a');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    // если скролл в верхней части (hero)
    if (window.scrollY < 300) current = '';
    navLinks.forEach(link => {
      link.style.borderBottomColor = 'transparent';
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.style.borderBottomColor = '#f9a826';
      }
    });
  });
});