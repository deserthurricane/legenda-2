//СЛАЙДЕР НА ГЛАВНОЙ СТРАНИЦЕ

fillSliderWithPhotos(
  getVKPhotos,
  'https://api.vk.com/method/photos.get?owner_id=-100587008&album_id=226392380&rev=1&count=100&v=5.71&access_token=5f80c688ffb14629abc338a3d4c2eca2184754a4a097f27a03e1b861efa3bb2bd4b57e6dcf3e47fd96dfd',
  'about__photos'
);

let quests = document.querySelectorAll('.quests__item');

quests.forEach(quest => {
  quest.addEventListener('click', event => {
    let questName = event.currentTarget.getAttribute('data-name');
    window.history.pushState('quest', `Квест "${questName}"`, `/quest.html?${questName}`);
    window.history.go(0);
  });
});

//  BUTTON SCROLL TOP
document.querySelector('.scroll-top').onclick = event => {
  event.preventDefault();
  window.scrollTo(0, 0);
};
