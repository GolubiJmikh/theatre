  const burger = document.getElementById('burger');
  const mainMenu = document.getElementById('mainMenu');

  burger.addEventListener('click', () => {
    mainMenu.classList.toggle('show');
  });

    const slides = document.querySelectorAll('.background-slides .slide');
let currentSlide = 0;

function showNextSlide() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === currentSlide) {
      slide.classList.add('active');
    }
  });
  currentSlide = (currentSlide + 1) % slides.length;
}

// Запускаем переключение каждые 3 секунды
setInterval(showNextSlide, 3000);

// Инициализация
showNextSlide();



document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-button.left");
  const nextButton = document.querySelector(".carousel-button.right");
  
  let currentIndex = 0;
  let cardsPerPage = getCardsPerPage();
  let cardWidth = 0;

  let startX = 0;
  let isDragging = false;

  // Получить число карточек в зависимости от ширины
  function getCardsPerPage() {
    const width = window.innerWidth;
    if (width > 900) return 3;
    if (width > 600) return 2;
    return 1;
  }

  // Обновляем ширину карточки, включая маргины
  function updateCardWidth() {
    if (cards.length === 0) return;
    const style = getComputedStyle(cards[0]);
    const marginRight = parseInt(style.marginRight) || 0;
    const marginLeft = parseInt(style.marginLeft) || 0;
    const totalMargin = marginRight + marginLeft;
    cardWidth = Math.round(cards[0].getBoundingClientRect().width + totalMargin);
  }

  // Обновляем состояние стрелок
  function updateButtons() {
    const maxIndex = Math.max(0, cards.length - cardsPerPage);
    if (prevButton) prevButton.disabled = currentIndex === 0;
    if (nextButton) nextButton.disabled = currentIndex >= maxIndex;
  }

  // Перемещение
  function moveToIndex(index) {
    const maxIndex = Math.max(0, cards.length - cardsPerPage);
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
    updateButtons();
  }

  // Обработчики кнопок
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      moveToIndex(currentIndex - 1);
    });
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveToIndex(currentIndex + 1);
    });
  }

  // Обработка resize
  window.addEventListener("resize", () => {
    updateCardWidth();
    const newCardsPerPage = getCardsPerPage();
    const maxIndex = Math.max(0, cards.length - newCardsPerPage);
    currentIndex = Math.min(currentIndex, maxIndex);
    cardsPerPage = newCardsPerPage;
    moveToIndex(currentIndex);
  });

  // Изначальная настройка
  updateCardWidth();
  const initialCardsPerPage = getCardsPerPage();
  currentIndex = Math.min(currentIndex, Math.max(0, cards.length - initialCardsPerPage));
  moveToIndex(currentIndex);

  // --- Добавляем свайпы ---
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = "none"; // отключить анимацию для свайпа
  });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${-currentIndex * cardWidth + deltaX}px)`;
  });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "transform 0.3s ease";

    const deltaX = e.changedTouches[0].clientX - startX;
    if (deltaX > 50 && currentIndex > 0) {
      moveToIndex(currentIndex - 1);
    } else if (deltaX < -50 && currentIndex < Math.max(0, cards.length - cardsPerPage)) {
      moveToIndex(currentIndex + 1);
    } else {
      moveToIndex(currentIndex);
    }
  });
});