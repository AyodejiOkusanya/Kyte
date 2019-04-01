class API {
  static get_offers (flightDetails) {
    return fetch('http://localhost:3000/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({flightDetails})
    }).then(resp => resp.json())
  }

  static make_booking (offerId) {
    return fetch('http://localhost:3000/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    }).then(resp => resp.json())
  }

  static confirm_booking (bookingInfo) {
    return fetch('http://localhost:3000/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingInfo })
    }).then(resp => resp.json())
  }
}

window.API = API

export default API
