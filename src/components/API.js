class API {
  static get_offers () {
    return fetch('http://localhost:3000/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
    }).then(resp => resp.json())
  }

  static make_booking (offerId) {
    return fetch('http://localhost:3000/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    }).then(resp => resp.json())
  }
}

window.API = API

export default API
