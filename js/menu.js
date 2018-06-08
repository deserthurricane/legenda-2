// MENU ACTIVE LINKS

const menuLinks = document.querySelectorAll('.menu-fixed__items ul li a');
const menuDestinations = document.querySelectorAll('.anchor');

window.addEventListener('scroll', () => {
  // 50 - это расстояние между блоками страницы
  let top = parseFloat(document.querySelector('body').scrollTop) + 50;
  menuDestinations.forEach((destination, index) => {
    if (
      menuDestinations[index + 1] !== undefined
        ? top >= menuDestinations[index].getBoundingClientRect().top + pageYOffset && top < menuDestinations[index + 1].getBoundingClientRect().top + pageYOffset
        : top >= menuDestinations[index].getBoundingClientRect().top + pageYOffset
    ) {
      menuLinks[index].setAttribute('active', 'true');
      console.log('active');
    } else {
      menuLinks[index].setAttribute('active', 'false');
    }
  });
});

// MOBILE MENU
const mobileMenu = document.querySelector('.menu-mobile');

mobileMenu.onclick = function () {
  if (this.classList.contains('open')) {
    this.classList.remove('open');
    this.parentElement.querySelector('.menu-fixed__items').classList.remove('open');
    document.querySelector('.curtain').style.display = 'none';
  } else {
    this.classList.add('open');
    this.parentElement.querySelector('.menu-fixed__items').classList.add('open');
    document.querySelector('.curtain').style.display = 'block';
  }
};

menuLinks.forEach(link => {
  link.onclick = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.parentElement.querySelector('.menu-fixed__items').classList.remove('open');
    document.querySelector('.curtain').style.display = 'none';
  };
});
