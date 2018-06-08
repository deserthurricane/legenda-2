class CreateSlider {
  constructor(name, arr) {
    this.name = name;
    this.arr = arr;
    this.count = 0;
    // this.render = this.render.bind(this);
    // this.slideRight = this.slideRight.bind(this);
    // this.slideLeft = this.slideLeft.bind(this);
  }

  render() {
    this.slider = document.createElement('div');
    this.slider.classList.add('slider');
    this.buttonBack = document.createElement('button');
    this.buttonBack.classList.add('slider__button', 'button-back');
    this.buttonBack.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';

    this.buttonForward = document.createElement('button');
    this.buttonForward.classList.add('slider__button', 'button-forward');
    this.buttonForward.innerHTML = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';

    this.slideCount = document.createElement('div');
    this.slideCount.classList.add('slider__count', 'golden-text');

    this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
    this.slideCount.innerHTML = `1/${this.arr.length}`;

    document.querySelector(`.${this.name}`).appendChild(this.slider);
    this.slider.appendChild(this.buttonBack);
    this.slider.appendChild(this.buttonForward);
    this.slider.appendChild(this.slideCount);
  }

  slideRight() {
    this.buttonForward.onclick = event => {
      if (this.count < 99) {
        event.preventDefault();
        this.count++;
        this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
        this.slideCount.innerHTML = `${this.count + 1}/${this.arr.length}`;
      }
    };
  }

  slideLeft() {
    this.buttonBack.onclick = event => {
      if (this.count > 0) {
        event.preventDefault();

        this.count--;
        this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
        this.slideCount.innerHTML = `${this.count + 1}/${this.arr.length}`;
      }
    };
  }
}

class Slider {
  constructor(name, arr) {
    this.name = name;
    this.arr = arr;
    this.count = 0;
    this.translator = 0;
    // this.render = this.render.bind(this);
    // this.slideRight = this.slideRight.bind(this);
    // this.slideLeft = this.slideLeft.bind(this);
  }

  render() {
    this.sliderContainer = document.createElement('div');
    this.sliderContainer.classList.add('slider');
    this.slider = document.createElement('ul');
    // this.slider.classList.add('slider');

    this.buttonBack = document.createElement('button');
    this.buttonBack.classList.add('slider__button', 'button-back');
    this.buttonBack.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';

    this.buttonForward = document.createElement('button');
    this.buttonForward.classList.add('slider__button', 'button-forward');
    this.buttonForward.innerHTML = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';

    this.slideCount = document.createElement('div');
    this.slideCount.classList.add('slider__count', 'golden-text');

    // this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
    this.slideCount.innerHTML = `1/${this.arr.length}`;

    document.querySelector(`.${this.name}`).appendChild(this.sliderContainer);
    this.sliderContainer.appendChild(this.slider);
    this.arr.forEach(photoUrl => {
      let slide = document.createElement('li');
      slide.style.width = parseFloat(window.getComputedStyle(this.sliderContainer, null).width);
      //+ 0.015;
      slide.style.backgroundImage = `url(${photoUrl})`;
      this.slider.appendChild(slide);
    });
    this.sliderContainer.appendChild(this.buttonBack);
    this.sliderContainer.appendChild(this.buttonForward);
    this.sliderContainer.appendChild(this.slideCount);
  }

  slideRight() {
    this.buttonForward.onclick = event => {
      if (this.count < this.arr.length - 1) {
        event.preventDefault();
        this.count++;
        this.translator =
          this.translator - parseFloat(window.getComputedStyle(this.slider.children[0]).width);
        this.slider.style.transform = `translate3d(${this.translator}px,0,0)`;

        // this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
        this.slideCount.innerHTML = `${this.count + 1}/${this.arr.length}`;
        if (this.count === this.arr.length - 1) {
          this.buttonForward.style.display = 'none';
        } else if (this.count === 1) {
          this.buttonBack.style.display = 'block';
        }
      }
    };
  }

  slideLeft() {
    this.buttonBack.onclick = event => {
      if (this.count > 0) {
        event.preventDefault();
        this.count--;
        this.translator =
          this.translator + parseFloat(window.getComputedStyle(this.slider.children[0]).width);
        this.slider.style.transform = `translate3d(${this.translator}px,0,0)`;
        // this.slider.style.backgroundImage = `url(${this.arr[this.count]})`;
        this.slideCount.innerHTML = `${this.count + 1}/${this.arr.length}`;
        if (this.count === 0) {
          this.buttonBack.style.display = 'none';
        } else if (this.count === this.arr.length - 2) {
          this.buttonForward.style.display = 'block';
        }
      }
    };
  }

  onWindowResize() {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        Array.prototype.forEach.call(this.slider.children, (slide, index) => {
          slide.style.width =
            parseFloat(window.getComputedStyle(this.sliderContainer, null).width) + 0.015;
        });
        this.translator = -(
          parseFloat(window.getComputedStyle(this.sliderContainer, null).width) * this.count
        );
        this.slider.style.transform = `translate3d(${this.translator}px,0,0)`;
      }, 0.5);
    });
  }
}

function getVKPhotos(url) {
  return $.ajax(url, {
    method: 'GET',
    dataType: 'jsonp'
  }).then(result => {
    let { response } = result;
    photoUrls = response.items.map(photo => {
      return photo.photo_1280 ? photo.photo_1280 : photo.photo_604;
    });
    return photoUrls;
  });
}

function getJsonPhotos(url) {
  return $.ajax(url).then(photoUrls => {
    return photoUrls;
  });
}

function fillSliderWithPhotos(getFn, url, slider) {
  getFn(url).then(photoUrls => {
    let sliderInstance = new Slider(slider, photoUrls);
    sliderInstance.render();
    sliderInstance.slideRight();
    sliderInstance.slideLeft();
    sliderInstance.onWindowResize();
  });
}

// ОТРИСОВКА СЛАЙДЕРА - старый вариант

// function createSlider(name, arr) {
//   let slider = document.querySelector('.slider');
//   slider.style.backgroundImage = `url(${arr[0]})`;
//   slider.querySelector('.slider__count').innerHTML = `1/${arr.length}`;
// }

// прокрутка слайдера

// let sliderPosition = 0;
// const sliderAbout = document.querySelector('.slider');

// document.querySelector('.slider__button.button-back').onclick = event => {
//   event.preventDefault();
//   sliderPosition--;
//   sliderAbout.style.backgroundImage = `url(${photoUrls[sliderPosition]})`;
//   sliderAbout.querySelector('.slider__count').innerHTML = `${sliderPosition + 1}/${
//     photoUrls.length
//   }`;
// };

// document.querySelector('.slider__button.button-forward').onclick = event => {
//   event.preventDefault();
//   sliderPosition++;
//   sliderAbout.style.backgroundImage = `url(${photoUrls[sliderPosition]})`;
//   sliderAbout.querySelector('.slider__count').innerHTML = `${sliderPosition + 1}/${
//     photoUrls.length
//   }`;
// };

// ul slider type with pixel bug

//   let ulElement = event.currentTarget.parentElement.children[0];
//   let li = ulElement.children[0];
//   let slider = event.currentTarget.parentElement;
//   let liWidth = parseInt(window.getComputedStyle(li, null).width);
//   position = position - liWidth;
//   ulElement.style.marginLeft = position + 'px';
//   console.log(ulElement.style.marginLeft);
//   ulElement.style.transform = `translateX(-${position}px)`;
