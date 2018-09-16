// ЗАГРУЗКА КОММЕНТАРИЕВ ИЗ ГРУППЫ ВКОНТАКТЕ

const token =
  'e1bfe6000bac986636c3a5d22b71b61925d1d97a3c5163475500309b2590c8dfb7f6e562249ddbf8c6fa4';

$.ajax({
  url: `https://api.vk.com/method/board.getComments?group_id=100587008&topic_id=33298359&count=100&sort=desc&extended=1&v=5.71&access_token=${token}`,
  method: 'GET',
  dataType: 'jsonp'
}).then(result => {
  let {
    response: { items }
  } = result;
  let comments = items;
  let {
    response: { profiles }
  } = result;
  // Комментарии получены. Отфильтровываем комментарии администратора (from_id  админа равно -100587008, число меньше нуля)
  comments = comments.filter(comment => {
    return comment.from_id > 0 && comment.text;
  });
  // profiles = profiles.filter(profile => {
  //   return profile.uid != 101;
  // });

  let reviewElements = document.querySelectorAll('.reviews__item');
  let visibleReviewElements = [];
  let commentIndex = 0;

  function getVisibleReviewContainers() {
    visibleReviewElements = Array.prototype.filter.call(reviewElements, el => {
      return el.offsetWidth > 0;
    });
  }

  function reviewsGenerator(commentIndex) {
    visibleReviewElements.forEach(el => {
      el.style.animationName = '';
      el.id = comments[commentIndex].id;
      let reviewText = el.querySelector('.reviews__item__text');
      let readMore = el.querySelector('.reviews__read-more');

      if (comments[commentIndex].text.length <= 200) {
        reviewText.innerHTML = comments[commentIndex].text;
        readMore.innerHTML = '';
      } else {
        reviewText.innerHTML = comments[commentIndex].text.substring(0, 191) + '...';
        readMore.innerHTML = 'развернуть...';
      }

      let authorProfile = profiles.filter(profile => {
        return profile.id === comments[commentIndex].from_id;
      })[0];

      el.getElementsByClassName('reviews__item__photo')[0].style.background = `url(${
        authorProfile.photo_50
      })`;

      el.getElementsByClassName('reviews__item__author')[0].innerHTML = `${
        authorProfile.first_name
      } ${authorProfile.last_name}`;

      el.style.animationName = 'rightFadeInOut';
      el.style.WebkitAnimationName = 'rightFadeInOut';
      el.style.animationDuration = '1.5s';

      commentIndex++;
    });
  }

  function toggleReadMore() {
    let readMoreLinks = [];
    visibleReviewElements.forEach(review => {
      readMoreLinks.push(review.querySelector('.reviews__read-more'));
    });
    readMoreLinks.forEach(readMore => {
      let reviewText = readMore.parentElement.querySelector('.reviews__item__text');
      let scrollHeight;
      readMore.addEventListener('click', event => {
        let fullCommentText = comments.filter(comment => {
          if (comment.id === parseInt(readMore.parentElement.id)) {
            return comment.text;
          }
        })[0].text;
        if (readMore.getAttribute('data-toggled') === 'false') {
          reviewText.innerHTML = fullCommentText;
          readMore.setAttribute('data-toggled', 'true');
          readMore.innerHTML = 'свернуть';
          scrollHeight = window.scrollY;
        } else {
          reviewText.innerHTML = fullCommentText.substring(0, 191) + '...';
          readMore.setAttribute('data-toggled', 'false');
          readMore.innerHTML = 'развернуть...';
          window.scroll({
            top: scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // В первый раз загружаем самые свежие комментарии
  getVisibleReviewContainers();
  reviewsGenerator(commentIndex);
  toggleReadMore();

  // При изменении ориентации устройства рендерим отзывы заново
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      getVisibleReviewContainers();
      reviewsGenerator(commentIndex);
      // toggleReadMore();
    }, 1000);
  });

  // Обработка кликов по кнопкам вперед - назад
  function carouselForward() {
    commentIndex = commentIndex + visibleReviewElements.length;
    try {
      reviewsGenerator(commentIndex);
    } catch (error) {
      commentIndex = 0;
      reviewsGenerator(commentIndex);
    }
    let readMoreLinks = [];
    visibleReviewElements.forEach(review => {
      readMoreLinks.push(review.querySelector('.reviews__read-more'));
    });
    readMoreLinks.forEach(readMore => {
      readMore.setAttribute('data-toggled', 'false');
    });
  }
  function carouselBack() {
    commentIndex = commentIndex - visibleReviewElements.length;
    try {
      reviewsGenerator(commentIndex);
    } catch (error) {
      commentIndex = comments.length - (visibleReviewElements.length + 1);
      reviewsGenerator(commentIndex);
    }
    let readMoreLinks = [];
    visibleReviewElements.forEach(review => {
      readMoreLinks.push(review.querySelector('.reviews__read-more'));
    });
    readMoreLinks.forEach(readMore => {
      readMore.setAttribute('data-toggled', 'false');
    });
  }

  document.querySelector('.reviews__button.button-back').onclick = event => {
    event.preventDefault();
    carouselBack();
  };

  document.querySelector('.reviews__button.button-forward').onclick = event => {
    event.preventDefault();
    carouselForward();
  };

  //Обработка движений по тачскрину
  // let touchstartX = 0;
  // let touchstartY = 0;
  // let touchendX = 0;
  // let touchendY = 0;

  // const gestureZone = document.querySelector('.reviews');

  // gestureZone.addEventListener(
  //   'touchstart',
  //   function(event) {
  //     touchstartX = event.changedTouches[0].screenX;
  //     touchstartY = event.changedTouches[0].screenY;
  //   },
  //   false
  // );

  // gestureZone.addEventListener(
  //   'touchend',
  //   function(event) {
  //     touchendX = event.changedTouches[0].screenX;
  //     touchendY = event.changedTouches[0].screenY;
  //     handleGesture();
  //   },
  //   false
  // );

  // function handleGesture() {
  //   if (touchendX < touchstartX) {
  //     carouselForward();
  //     console.log('Swiped left');
  //   }

  //   if (touchendX > touchstartX) {
  //     carouselBack();
  //     console.log('Swiped right');
  //   }

  //   // if (touchendY < touchstartY) {
  //   //   console.log('Swiped up');
  //   // }

  //   // if (touchendY > touchstartY) {
  //   //   console.log('Swiped down');
  //   // }

  //   if (touchendY === touchstartY) {
  //     console.log('Tap');
  //   }
  // }
});
