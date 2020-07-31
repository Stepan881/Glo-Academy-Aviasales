const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      inputIitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart'),
      cheapestTicket = document.querySelector('#cheapest-ticket'),
      otherCheapTickets = document.querySelector('#other-cheap-tickets');

let city = [];

const citiesApi = './data/cities.json',
      calendarApi = 'https://min-prices.aviasales.ru/calendar_preload',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY = 'dc31f8ea337ade1355ed2df1d248c8d0',
      MAX_COUNT = 10;

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  
  request.open('GET', url);
  request.addEventListener('readystatechange', () => {
    // console.log(request.readyState);
    if (request.readyState !==4) return;

    if (request.status === 200) {
      callback(request.response);
      
    } else {
      console.error(request.status);
      
    }

  });  
  request.send();
};

const showCity = (input, list) => {
  list.textContent = '';
  
  if (input.value !== '') {

    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(input.value.toLowerCase());
    });
    
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.appendChild(li);
    });
  }
};

const clickCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

const getNameCity = (code) => {
  const objCity = city.find(item => item.code === code);

  return objCity.name;
};

const getDate = (date) => {
  
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getChanges = (number) => {
  if (number) {
    return number === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
};

const getLinkAviaSales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;
  const date = new Date(data.depart_date);
  const day = date.getDate();
  link += day < 10 ? '0' + day : day;
  const month = date.getMonth() + 1;
  link += month < 10 ? '0' + month : month;
  link += data.destination;
  link += '1';
  return link;
  // SVX2905KGD1
}

const createCard = (data) => {
  const ticket = document.createElement('article');



  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
    <div class="ticket__wrapper">
      <div class="left-side">
        <a href="${getLinkAviaSales(data)}" target="_blank" class="button button__buy">Купить
          за ${data.value}₽</a>
      </div>
      <div class="right-side">
        <div class="block-left">
          <div class="city__from">Вылет из города
            <span class="city__name">${getNameCity(data.origin)}</span>
          </div>
          <div class="date">${getDate(data.depart_date)}</div>
        </div>

        <div class="block-right">
          <div class="changes">${getChanges(data.number_of_changes)}</div>
          <div class="city__to">Город назначения:
            <span class="city__name">${getNameCity(data.destination)}</span>
          </div>
        </div>
      </div>
    </div>
    `;
  } else {
    deep = `<h3>Билетов на дату не нашлось</h3>`;
  }
  ticket.insertAdjacentHTML('afterbegin', deep);


  return ticket;
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = (`<h2>Самые дешевые билеты на другие даты</h2>`);
  cheapTickets.sort((a, b) => a.value > b.value ? 1 : -1);

  
  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.appendChild(ticket);
  }

    console.log(cheapTickets);
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = (`<h2>Самый дешевый билет на выбранную дату</h2>`);
  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);  
};

const renderCheck = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });

renderCheapDay(cheapTicketDay);
renderCheapYear(cheapTicketYear);

};

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputIitiesTo.addEventListener('input', () => {
  showCity(inputIitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
  clickCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
  clickCity(event, inputIitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = {
    from: city.find( (item) => inputCitiesFrom.value === item.name),
    to: city.find( (item) => inputIitiesTo.value === item.name),
    when: inputDateDepart.value
  };

  if (formData.from && formData.to) {
      const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

      getData(calendarApi+requestData, (response) => {
        renderCheck(response, formData.when);
      });  
  } else {
    console.log('Не найден город');    
  }        
});


getData(citiesApi, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
  city.sort((a, b) => a.name > b.name ? 1 : -1);
  // console.log(city);
  
});
