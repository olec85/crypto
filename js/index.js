//modal

const headerNavBtn = document.querySelector('.header__nav-btn');
const headerNavigation = document.querySelector('.header__navigation');

headerNavBtn.addEventListener('click', () => {
    headerNavigation.classList.toggle('header__navigation_open')
})



const heroBtn = document.querySelector('.hero__btn');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');

heroBtn.addEventListener('click', () => {
    overlay.classList.add('overlay__open')
    modal.classList.add('modal__open')
});

overlay.addEventListener('click', (event) => {
    const target = event.target;
    if (target === overlay || target.closest('.modal__close')) {//условие при котором закрытие либо вне окошка либо на крестик
        overlay.classList.remove('overlay__open')
    modal.classList.remove('modal__open')
    }
});

const form = document.querySelector('form');
const modalTitle = document.querySelector('.modal__title');


form.addEventListener('submit', (event) => {
    event.preventDefault();//это метод отключает стандартное браузерное поведение

    const data = {
        name: form.name.value,
        surname: form.surname.value,
        tel: form.tel.value,//таким образом собирается обьект для отправки
    };

    fetch('http://api-form-order.herokuapp.com/api/order', {//функция которая занимается отправкой данных
        method: 'post',
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(person => {
        modalTitle.textContent = person.name + ', ваша заявка успешно отправлена, номер: ' + person.id;
    })
    
});


// tabs-about-us

const advantageButtons = document.querySelectorAll('.advantage__button');
const advantageItemsContent = document.querySelectorAll('.advantage__item-content');

advantageButtons.forEach((advantageButton, i) => {//перебираем все кнопки методом foreach и через запятую получаем iндекс кнопки
  advantageButton.addEventListener('click', () => {//вешаем клик и создаем функцию перебирать advantageItemContent в которй будем перебирать контент
    advantageItemsContent.forEach((advantageItemContent, j) => {
        if (i === j) {//если ндекс кнопки и контента совпадает
            advantageButtons[j].classList.add('advantage__button--active');//тогда будет добавляться кнопкам класс active
            advantageItemsContent[j].classList.add('advantage__item-content--active')//а контенту будет добавляться класс advantage__item-content--active
        } else {
            advantageButtons[j].classList.remove('advantage__button--active');//а если индексы не совпали мы отбираем классы иначе будут активны несколько кнопок
            advantageItemsContent[j].classList.remove('advantage__item-content--active')//а если индексы не совпали мы отбираем классы иначе будут активны несколько кнопок
        }
    })
  } )
})

//exchange-rates

const exchangeRatesList = document.querySelector('.exchange-rates__list');//

const socket = new WebSocket('ws://web-socket-current.herokuapp.com')//создаем переменную для соединение с серверои

const renderExchange = (wrapper, data) => {//функция которую будем вызывать и получать два параметра wrapper и данные приходящие с сервера
    const {from, to, rate, change} = JSON.parse(data);//вытаскиваем полученные выше данные из обекта data json приводит данные к обьекту

    const listItem = document.createElement('li') //создаю li элемент
    listItem.classList.add('exchange-rates__item', //добавляем класс exchange-rates__item
    change === 1 ? 'exchange-rates__item--up' : 'exchange-rates__item--down',
    );//и при условии что chenge равен 1 это значит повышение exchange-rates__item-up а если нет то exchange-rates__item-down(тернарный оператор)

    const currency = document.createElement('span');//создаем спан currency
    currency.classList.add('exchange-rates__currency');//добавляем классы
    currency.textContent = `${from}/${to}`;//теперь добавляем контент используя обратные ковычки и интерполяцию

    const value = document.createElement('span');//создаем спан value
    value.classList.add('exchange-rates__value');//добавляем классы
    value.textContent = rate;//добавляем проверяем rate

    listItem.append(currency, value)//а теперь все что выше мы собираем методом append добавляем в наш li
    wrapper.prepend(listItem);//а теперь в wrapper вставляем наш полученный li но вставим в начало используя prepend

    if (wrapper.children.length > 4) {//берем наш wrapper проверяем что если детей больше четырех
        wrapper.children[4].remove();//то мы удалим четвертый элемент
    }
}

socket.addEventListener('message', event => {//отлавливаем событие message у socket а внутри получим event и отправим его в функцию
    renderExchange(exchangeRatesList, event.data)//вызываем функцию и передаем в нее данные и exchangeRatesList
})

socket.addEventListener('error', err => {//отлавливаем событие error у socket а внутри получим err и отправим его в функцию(отлавливаем ошибку если будет)

})


//faq.js

const hide = (elem, answer) => {
    if (!elem.classList.contains('faq__item-show')) return;

    answer.style.height = `${answer.offsetHeight}px`;
    answer.offsetHeight;
    answer.style.display = 'block';
    answer.style.height = 0;
    answer.style.overflow = 'hidden';
    answer.style.transition = 'height 360ms ease-in-out';

    elem.classList.remove('faq__item-show');

    setTimeout(() => {
        elem.classList.remove('faq__item-show');
        answer.style.display = '';
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
       }, 360)
    
}



const show = (elem, answer) => {
    if (elem.classList.contains('faq__item-show')) return;

    answer.style.display = 'block';
    const height = answer.offsetHeight;
    answer.style.height = 0;
    answer.style.overflow = 'hidden';
    answer.style.transition = 'height 360ms ease-in-out';
    answer.offsetHeight;
    answer.style.height = `${height}px`;

   setTimeout(() => {
    elem.classList.add('faq__item-show');
    answer.style.display = '';
    answer.style.height = '';
    answer.style.overflow = '';
    answer.style.transition = '';
   }, 360)
}

const accordion = () => {
    const list = document.querySelector('.faq__list');

    list.addEventListener('click', e => {
        const button = e.target.closest('.faq__question');

        if (button) {
            const item = button.closest('.faq__item');
            const answer = item.querySelector('.faq__answer')
            item.classList.contains('faq__item-show') ? hide(item, answer) : show(item, answer);
        }
    })
}
accordion()