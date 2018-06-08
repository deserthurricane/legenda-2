// MODAL

let questName = document.location.search.split('?')[1];
openModal(questName);

function openModal(questName) {
  $.ajax('./quests.json').then(allQuests => {
    let selectedQuest = allQuests.filter(quest => {
      return quest.name === questName;
    })[0];

    window.scrollTo(0, 0);
    // MODAL HEADER DATA
    document.querySelector('.quest-title').innerHTML = selectedQuest.title;
    document.querySelector('.quest-summary').innerHTML = selectedQuest.summary;
    document.querySelector('.quest-info__players').innerHTML =
      '<i <i class="fa fa-users" aria-hidden="true"></i>' +
      ' ' +
      selectedQuest.info.players +
      ' игрока';
    document.querySelector('.quest-info__time').innerHTML =
      '<i class="fa fa-clock-o" aria-hidden="true"></i>' + ' ' + selectedQuest.info.time;
    let complexity = parseInt(selectedQuest.info.complexity);
    document.querySelector('.modal__header').style.backgroundImage = `url(${
      selectedQuest.picture
    })`;
    // Прикрепляем количество иконок-ключей, соответствующих цифре сложности
    for (let i = 0; i < complexity; i++) {
      document.querySelector('.quest-info__complexity').innerHTML +=
        '<i class="fa fa-key" aria-hidden="true"></i>';
    }

    let span = document.createElement('span');
    span.innerHTML = ' сложность';
    document.querySelector('.quest-info__complexity').appendChild(span);

    // MODAL BODY DATA
    document.querySelector('.quest-description__text').innerHTML = selectedQuest.description;

    // SLIDER DATA
    fillSliderWithPhotos(getVKPhotos, '' + selectedQuest.albumVK, 'quest-photos');

    // CLOSE MODAL

    document.querySelector('.menu__back').onclick = event => {
      event.preventDefault;
      closeModal();
    };
  });
}

function closeModal() {
  document.location.href = '/#quests';
}
