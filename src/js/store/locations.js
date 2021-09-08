
//Единый источник данных для хранения данных, у нас массив городов и стран



import api from '../services/apiService';
import { formatDate } from '../helpers/date';

// данный класс принимает в себя эксземпляр класса api и создает свои методы и свойства
class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCities = {};
    this.lastSearch = {};
    this.airlines = {};
    this.formatDate = helpers.formatDate;
  }
  // метод который получает ответы от сервера по городам, странам и авиакомпаниям
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);
    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCities = this.createShortCities(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    return response;
  }
  // метод возвращает код города для передачи на сервер
  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(
      item => item.full_name === key,
    );
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }
  // метод возвращает имя авиакомпании по ее коду
  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }
    // метод возвращает лого авиакомпании по ее коду
  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }
   // меод для преобразования объекта объектов cities  в объект вида {City, Country: null} - для автокомплита
  createShortCities(cities) {
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {});
  }
// метод который создает объект объектов билетов и добавляет в него нужную инфу(logo название)
  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item;
      return acc;
    }, {});
  }
  // метод, преобразует данные по странам в объект {Country code:{}}
  serializeCountries(countries) {
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }
  // метод, преобразует данные по городам в объект {Citycode:{}} при этом передает фулнейм для автокомплита
  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.countries[city.country_code].name;
      city.name = city.name || city.name_translations.en;
      const full_name = `${city.name},${country_name}`;
      acc[city.code] = {
        ...city,
        country_name,
        full_name,
      };
      return acc;
    }, {});
  }
  // метод получается цены на билеты, через него мы добавляем query-параметры и посылаем правильный url на сервер
  async fetchTickets(params) {
    const response = await this.api.prices(params);
    // получаем массив билетов с нужными преобразованными данными
    this.lastSearch = this.serializeTickets(response.data);
  }

  serializeTickets(tickets) {
    return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'), // взято из плагина
        return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
      };
    });
  }
}

const locations = new Locations(api, { formatDate });
export default locations;
