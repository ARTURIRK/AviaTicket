import ticketsUI from '../views/tickets';
class FavoritesUI{
    constructor(){
        this.dropdown = document.querySelector('.electTickets');
        this.newFavTicket = document.querySelector('.add-favorite');
        this.dropDownCont = document.querySelector('#dropdown1');
    }
    renderFavoriteTicket(favCard){
        let fragment = FavoritesUI.FavoriteTicketTemplate(favCard);
        this.dropDownCont.insertAdjacentHTML('afterbegin', fragment);
    }
    showEmptyFav(){
      let fragment = FavoritesUI.emptyFavoriteTemplate();
      this.dropDownCont.insertAdjacentHTML('afterbegin', fragment);
    }
    static emptyFavoriteTemplate(){
        return `
        <div class="favorite-item  d-flex align-items-center justify-items-center  empty-mes">
            <div class="favorite-item-info d-flex flex-column justify-items-center empty">
                <div class="favorite-item-destination d-flex align-items-center ">
                   В избранных нет добавленных билетов
                </div>
            </div>    
        </div>`
    }
    static FavoriteTicketTemplate(card){
        return `<div class="favorite-item  d-flex align-items-start">
        <img
          src="http://pics.avs.io/200/200/${card.airline}.png"
          class="favorite-item-airline-img"
        />
        <div class="favorite-item-info d-flex flex-column">
          <div
            class="favorite-item-destination d-flex align-items-center"
          >
            <div class="d-flex align-items-center mr-auto">
              <i class="medium material-icons">flight_takeoff</i>
              <span class="favorite-item-city">${card.origin_name}</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="medium material-icons">flight_land</i>
              <span class="favorite-item-city">${card.destination_name}</span>
            </div>
          </div>
          <div class="ticket-time-price d-flex align-items-center">
            <span class="ticket-time-departure">${card.departure_at}</span>
            <span class="ticket-price ml-auto">${card.price}</span>
          </div>
          <div class="ticket-additional-info">
            <span class="ticket-transfers"> Пересадок ${card.transfers || 0}</span>
            <span class="ticket-flight-number">Номер рейса: ${card.flight_number}</span>
          </div>
          <a
            class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto"
            >Delete</a
          >
        </div>
      </div>
      <!-- /favorite item`
    }
}
const favoritesUI = new FavoritesUI();
export default favoritesUI;

// 1) При нажатии на зеленую кнопку должна рендериться карточка и попадать в всплывашку
// 2) При нажатии на кнопку favorites должна появляться всплывашка с билетами
// 3) при нажатии на другие зоны всплывашка должна закрываться