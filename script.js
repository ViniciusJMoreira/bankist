'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav__list");
const navItem = document.querySelectorAll(".nav__list .nav__item");
const navToggle = document.querySelector(".nav__toggle");
const navClose = document.querySelector(".nav__close");
// const header = document.querySelector(".header");
const headerTitle = document.querySelector(".header__title");
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll(".section");
const section1 = document.querySelector('#section--1');
const allLazyImages = document.querySelectorAll("img[data-src]");
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const allSlide = document.querySelectorAll(".slide");
const btnSliderNext = document.querySelector('.slider__btn--right');
const btnSliderPrev = document.querySelector('.slider__btn--left');
const maxLengthSlider = allSlide.length-1;
const dotsContainer = document.querySelector(".dots");

let curSlider = 0;


///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Nav menu mobile
const openMenu = function() {
  navMenu.style.transform = 'translateX(0%)';
}
const closeMenu = function() {
  navMenu.style.transform = 'translateX(100%)';
}
navToggle.addEventListener("click", openMenu);
navClose.addEventListener("click", closeMenu);
///////////////////////////////////////
// styck navigation
const navObserver = function(entries) {
  const [entry] = entries;
  // console.log(entry);
  if(entry.isIntersecting) nav.classList.add('sticky');
  else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) nav.classList.remove('sticky');
}
const navHeight = nav.getBoundingClientRect().height;
const observer = new IntersectionObserver(navObserver, {root:null, threshold: 0.08,rootMargin: `-${navHeight}px`});

observer.observe(section1);

///////////////////////////////////////
// Header Window
// Hover links nav
function handleInOut(e) {
  const link = e.target;
  if(link.classList.contains("nav__link")) {
    document.querySelectorAll(".nav__link").forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    const imgLogo = link.closest(".nav").querySelector("img");
    imgLogo.style.opacity = this; 
  };
}
nav.addEventListener('mousemove', handleInOut.bind(0.5));
nav.addEventListener('mouseout', handleInOut.bind(1));
nav.addEventListener('touchend', handleInOut.bind(1));
// links nav event click with animation
navMenu.addEventListener("click", function(e) {
  e.preventDefault();
  if(e.target.classList.contains("nav__link") && !e.target.classList.contains("nav__link--btn")) {
    const id = e.target.getAttribute("href");
    const sectionCoords = document.querySelector(id).getBoundingClientRect();
    
    window.scrollTo({
      top: sectionCoords.top + window.scrollY - navHeight,
      left: sectionCoords.left + window.scrollX,
      behavior: 'smooth',
    });
    // document.querySelector(id).scrollIntoView({behavior: "smooth"});
    if(window.screen.width < 992) closeMenu();
  }
});
// btn learn more event click with animation
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // console.log(s1coords);
  // console.log(header.getBoundingClientRect());
  // console.log(e.target.getBoundingClientRect());

  // window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY);

  window.scrollTo({
    top: s1coords.top + window.scrollY,
    left: s1coords.left + window.scrollX,
    behavior: 'smooth',
  });

  // section1.scrollIntoView({behavior: 'smooth'});
});


///////////////////////////////////////
// Reveal sections
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
}
const sectionOberver = new IntersectionObserver(revealSection, {root: null, threshold: 0.1});
allSections.forEach(section => sectionOberver.observe(section));

///////////////////////////////////////
// Lazy images
const lazyImage = function(entries, observer) {
  const [entry] = entries;
  const img = entry.target;
  if(!entry.isIntersecting) return;
  img.src = img.dataset.src;
  img.addEventListener("load", () => {
    img.classList.remove('lazy-img');
  })
  observer.unobserve(img);
}
const imagesObserver = new IntersectionObserver(lazyImage, {root:null, threshold:0});
allLazyImages.forEach(img => imagesObserver.observe(img));

///////////////////////////////////////
// Operations section
tabContainer.addEventListener("click", function(event) {
  const currentTab = event.target.closest('.operations__tab');

  // guard clause
  if(!currentTab) return;

  // remove actve class
  document.querySelector(".operations__tab--active")
  .classList.remove("operations__tab--active");
  document.querySelector(".operations__content--active")
  .classList.remove("operations__content--active");

  // active tab
  currentTab.classList.add('operations__tab--active');

  // active content tab
  document.querySelector(`.operations__content--${currentTab.dataset.tab}`)
  .classList.add("operations__content--active");
});

///////////////////////////////////////
// slider
const slider = function() {
  const createDots = function() {
    allSlide.forEach((_,i) => {
      const button = document.createElement("button");
      button.className = "dots__dot";
      button.dataset.slide = `${i}`;
      dotsContainer.appendChild(button);
    })
  }
  const activateDot = function(curSlide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove("dots__dot--active"));
    document.querySelector(`.dots__dot[data-slide="${curSlide}"`).classList.add("dots__dot--active");
  }
  const goToSlide = function(curSlide) {
    allSlide.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i-curSlide)}%)`;
    });
    activateDot(curSlide);
  }
  const nextSlide = function() {
    if(curSlider === maxLengthSlider) {
      curSlider = 0;
    }else {
      curSlider++;
    }
    goToSlide(curSlider);
  }
  const prevSlide = function() {
    if(curSlider === 0) {
      curSlider = maxLengthSlider;
    }else {
      curSlider--;
    }
    goToSlide(curSlider);
  }
  const init = function() {
    createDots();
    goToSlide(curSlider);
  }
  dotsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("dots__dot")) {
      const {slide} = e.target.dataset;
      curSlider = Number(slide);
      goToSlide(curSlider);
    }
  });
  btnSliderNext.addEventListener('click', nextSlide);
  btnSliderPrev.addEventListener("click", prevSlide);
  init();
}
slider();