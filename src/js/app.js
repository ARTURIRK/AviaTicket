import '../css/style.css';
import './plugins';
import locations from './store/locations';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import currencyUI from './views/currency';
import favoritesUI from './views/favorites';

document.addEventListener('DOMContentLoaded', e => {
  const form = formUI.form;
  const dropdown = document.querySelector('.electTickets');
  const dropDownCont = document.querySelector('#dropdown1');
  initApp();
  indecatorChanger()
  // Events
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  });
  document.body.addEventListener('click', function(e){
    bodyClickHandler(e);
  })
  // handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }
  function showOkay(el){
    el.insertAdjacentHTML('beforeend',` <i class=" small material-icons okay">check</i>`)
  }
  function bodyClickHandler (e){
     if(e.target.className.includes('electTickets')){
      if (dropDownCont.children.length==0){
        favoritesUI.showEmptyFav();
      }
      dropDownCont.classList.add('transforming')
    } else if(!e.target.closest('#dropdown1')){
      dropDownCont.classList.remove('transforming')
    }else if(e.target.className.includes('delete-favorite')){
      indicatorReduce()
      indecatorChanger()
      let deleteButton = e.target.closest('.favorite-item');
      deleteButton.remove();
    }
    if(e.target.className.includes('add-favorite')){
      indicatorIncrease()
      indecatorChanger()
      if(document.querySelector('.empty-mes')){
        document.querySelector('.empty-mes').remove();
      }
    let buttonAdd = e.target;  
    let card = e.target.closest('.ticket-card');
    let cardNumber = parseInt(card.dataset.number);
    let Favcard =locations.lastSearch[cardNumber];
    favoritesUI.renderFavoriteTicket(Favcard);
    setTimeout(()=>{
      buttonAdd.remove();
      showOkay(card);
    },500)
    }
  }
  function indecatorChanger(){
   let ind =  document.querySelector('.indecator');
    if(ind.textContent == '0'){
      ind.style.display = 'none'
    }
    else{
      ind.style.display = 'flex'
    }
  }
  function indicatorReduce(){
    let ind = +document.querySelector('.indecator').textContent;
    document.querySelector('.indecator').textContent = --ind;
  }
  function indicatorIncrease(){
    let ind = +document.querySelector('.indecator').textContent;
    document.querySelector('.indecator').textContent = ++ind;
  }
  
  // метод собирает данные из формы и валюту
  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;
    // CODE, Code, 2019-09,2019-09 - отправка на сервер

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

  ticketsUI.renderTickets(locations.lastSearch);
  console.log(locations.lastSearch);// массив билетов

  await ticketsUI.makeDataTicket(document.querySelectorAll('.ticket-card'))
  }
});
