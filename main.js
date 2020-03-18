const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      inputIitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');

let city = [];

const citiesApi = './data/cities.json',
      calendarApi = 'http://min-prices.aviasales.ru/calendar_preload',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY = 'dc31f8ea337ade1355ed2df1d248c8d0';

const getData = (url, API_KEY, callback) => {
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
      return fixItem.includes(input.value.toLowerCase());

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

getData(citiesApi, API_KEY, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});
