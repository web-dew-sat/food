function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // Slider
   
    const slider = document.querySelector(container),
            currentSlide = document.querySelector(currentCounter),
            totalSlide = document.querySelector(totalCounter),
            sliderWrapper = document.querySelector(wrapper),
            slides = sliderWrapper.querySelectorAll(slide),
            slideNext = document.querySelector(nextArrow),
            slidePrev = document.querySelector(prevArrow),
            slidesField = sliderWrapper.querySelector(field),
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
}
export default slider;