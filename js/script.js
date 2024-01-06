'use strict'
window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach( item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2024-01-15';

    function getTimeRemaining(endtime){
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());
            if(t <= 0){
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
            }else{
                days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);
            }
             
        
        return {
            'total' : t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes, 
            'seconds' : seconds

        };
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        }else{
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours= timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalTimerId = setTimeout(modalOpen, 50000);

    function modalClose(){
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.classList.remove('hidden');
    }
    function modalOpen(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.classList.add('hidden');
        clearInterval(modalTimerId);
    }
    function showModalByScroll(){
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1 ) {
            modalOpen();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalTrigger.forEach((el) => {
        el.addEventListener('click', modalOpen);
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
            modalClose();
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            modalClose();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек


    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 90;
            this.parent = document.querySelector(parentSelector);
            this.changeToRUB();
        }

        changeToRUB(){
            this.price = this.price * this.transfer;
        }

        render(){
            const element = document.createElement('div');

            if(this.classes.length === 0){
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML += `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });

    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };
    
    function bindPostData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            })
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            modalClose();
        },4000)

    }    

   // Slider
   
    const slider = document.querySelector('.offer__slider'),
          currentSlide = document.querySelector('#current'),
          totalSlide = document.querySelector('#total'),
          sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          slides = sliderWrapper.querySelectorAll('.offer__slide'),
          slideNext = document.querySelector('.offer__slider-next'),
          slidePrev = document.querySelector('.offer__slider-prev'),
          slidesField = sliderWrapper.querySelector('.offer__slider-inner'),
          widthSlider = window.getComputedStyle(sliderWrapper).width;

    let indexSlide = 1;
    let offset = 0;

    if(slides.length < 10){
        totalSlide.textContent =  `0${slides.length}`;
        currentSlide.textContent = `0${indexSlide}`;
    }else{
        totalSlide.textContent = slides.length;
        currentSlide.textContent = indexSlide;
    }
    
    // Функция для номера активного слайда в слайдере
    function numberSlide(n) {
        if(slides.length < 10){
            currentSlide.textContent = `0${n}`;
        }else{
            currentSlide.textContent = n;
        }
    }

    // Функция toggle класса для dot слайдера
    function toggleClassDots(item) {
        item.forEach(dot => dot.classList.remove('dot_active'));
        item[indexSlide - 1].classList.add('dot_active');
    }

    // Функция для удаления букв в строке и преобразования в number
    function deleteNotDigits(str){
        return +str.replace(/\D/g, '');
    }
   
    slidesField.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: 0.5s all;
    `
    sliderWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = widthSlider;
    });

    slider.style.position = 'relative';
    const indicators = document.createElement('ul'),
    dots = [];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);


    // Добавление dot в слайдер
    for( let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');

        if(i == 0){
            dot.classList.add('dot_active');
        }

        indicators.append(dot);
        dots.push(dot);

    }

    // Переключение на следующий слайд
    slideNext.addEventListener('click', (e) => {
        if (offset == deleteNotDigits(widthSlider) * (slides.length - 1)){
            offset = 0;
        }else{
            offset += deleteNotDigits(widthSlider);
        }

        slidesField.style.transform =  `translateX(-${offset}px)`;

        if (indexSlide == slides.length) {
            indexSlide = 1;
        } else{
            indexSlide++;
        }

        numberSlide(indexSlide);

        toggleClassDots(dots);
    });


    // Переключение на предыдущий слайд
    slidePrev.addEventListener('click', (e) => {
        if (offset == 0){
            offset = deleteNotDigits(widthSlider) * (slides.length - 1);
        }else{
            offset -= deleteNotDigits(widthSlider);
        }

        slidesField.style.transform =  `translateX(-${offset}px)`;

        if (indexSlide == 1) {
            indexSlide = slides.length;
        } else{
            indexSlide--;
        }

        toggleClassDots(dots);

    });

    // Событие при клике на dot слайдера
   dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            indexSlide = slideTo;
            offset = deleteNotDigits(widthSlider) * (slideTo - 1);

            slidesField.style.transform =  `translateX(-${offset}px)`;
            toggleClassDots(dots);

            numberSlide(indexSlide);

        });
   });

   

    // 1 Вариант

    // showSlide(indexSlide);

    // if(slides.length < 10){
    //     totalSlide.textContent =  `0${slides.length}`;
    // }else{
    //     totalSlide.textContent = slides.length;
    // }

    // function showSlide(n){
    //     if (n > slides.length){
    //        indexSlide = 1;
    //     }else if (n < 1){
    //         indexSlide = slides.length;
    //     }

    //     slides.forEach(slide => slide.classList.add('hide'));

    //     slides[indexSlide - 1].classList.remove('hide');
        
    //     if(slides.length < 10){
    //         currentSlide.textContent = `0${indexSlide}`;
    //     }else{
    //         currentSlide.textContent = indexSlide;
    //     }
    // }

    // function plusSlide(n){
    //     showSlide( indexSlide += n)
    // }

    // slideNext.addEventListener('click', () => {
    //     plusSlide(1)
    // });

    // slidePrev.addEventListener('click', () => {
    //     plusSlide(-1)
    // });




    //Calc

    const result = document.querySelector('.calculating__result span');
    
    let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', '1.375');
    }

    function initLocalSettings(selector, activeClass) {
        const elemenst = document.querySelectorAll(selector);

        elemenst.forEach( elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    };

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '___';
            return;
        }

        if(sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                    if (e.target.getAttribute('data-ratio')) {
                        ratio = +e.target.getAttribute('data-ratio');
                        localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                    } else {
                        sex = e.target.getAttribute('id');
                        localStorage.setItem('sex', e.target.getAttribute('id'));
                    }
        
                    console.log(ratio, sex);
        
                    elements.forEach(elem => elem.classList.remove(activeClass));
        
                    e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {

            if(input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }else{
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }   
            calcTotal();
        }); 
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');

    
    
});