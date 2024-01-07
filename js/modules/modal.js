function modal() {
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
}

module.exports = modal;