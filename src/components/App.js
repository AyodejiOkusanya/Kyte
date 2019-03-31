import React, { Component } from 'react'
import API from './API'
import {
  Button,
  Dimmer,
  Loader,
  Image,
  Segment,
  Popup
} from 'semantic-ui-react'

class App extends Component {
  state = {
    results: [],
    flightsArray: [],
    loading: false,
    allOffers: [],
    booking: null 
  }

  handleClick = () => {
    this.setState({ loading: true })
    return this.getOffers()
  }

  convetMinutesToHourMinutes = num => {
    const h = Math.floor(num / 60)
    const m = num % 60
    return `${h}h:${m}m`
  }

  getOffers = () => {
    let newOffers = []
    API.get_offers()
      .then(results => {
        let allFlights = results[1].flights
        let allOffers = results[1].offers.slice(0, 20)
        this.setState({ results: allFlights })
        this.setState({ allOffers })

        newOffers = allFlights.map(result => {
          return {
            id: result.id,
            departure: `${result.flightSegments[0].departure.airportCode}`,
            departureName: `${result.flightSegments[0].departure.airportName}`,
            arrival: `${result.flightSegments[0].arrival.airportCode}`,
            arrivalName: `${result.flightSegments[0].arrival.airportName}`,
            duration: `${this.convetMinutesToHourMinutes(
              result.flightSegments[0].flightDuration
            )}`,
            flightNumber: `${result.flightSegments[0].flightNumber}`,
            airline: `${result.flightSegments[0].operatingCarrier.name}`
          }
        })

        return newOffers
      })
      .then(newOffers =>
        this.setState(
          { flightsArray: newOffers.slice(0, 20) },
          this.setState({ loading: false })
        )
      )
  }

  renderFlights = () => {
    if (this.state.flightsArray.length) {
      return this.state.allOffers.map(offer => {
        let flightPair = this.state.flightsArray.filter(flight => {
          return (
            flight.id === offer.journeys[0].flightIds[0] ||
            flight.id === offer.journeys[1].flightIds[0]
          )
        })
        // console.log(flightPair)
        return this.renderAReturnFlightSegment(
          flightPair,
          offer.totalPrice.amount,
          offer.offerId
        )
        // console.log(offer)
        // return offer
      })
    } else {
      return null
    }
  }

  handleBooking = (event, offerId) => {
    this.setState({loading: true})
    API.make_booking(offerId).then(result => {
      this.setState({loading: false})
      this.setState({booking: result[1]})
    })
  }

  renderBooking = () => {
    const booking = this.state.booking
    const obj1 = {
      id: booking.journeys[0].flightSegments[0].id,
      departure: `${booking.journeys[0].flightSegments[0].departure.airportCode}`,
      departureName: `${booking.journeys[0].flightSegments[0].departure.airportName}`,
      arrival: `${booking.journeys[0].flightSegments[0].arrival.airportCode}`,
      arrivalName: `${booking.journeys[0].flightSegments[0].arrival.airportName}`,
      duration: `${this.convetMinutesToHourMinutes(
        booking.journeys[0].flightSegments[0].flightDuration
      )}`,
      flightNumber: `${booking.journeys[0].flightSegments[0].flightNumber}`,
      airline: `${booking.journeys[0].flightSegments[0].operatingCarrier.name}`
    }
    const obj2 = {
      id: booking.journeys[1].id,
      departure: `${booking.journeys[1].flightSegments[0].departure.airportCode}`,
      departureName: `${booking.journeys[1].flightSegments[0].departure.airportName}`,
      arrival: `${booking.journeys[1].flightSegments[0].arrival.airportCode}`,
      arrivalName: `${booking.journeys[1].flightSegments[0].arrival.airportName}`,
      duration: `${this.convetMinutesToHourMinutes(
        booking.journeys[1].flightSegments[0].flightDuration
      )}`,
      flightNumber: `${booking.journeys[1].flightSegments[0].flightNumber}`,
      airline: `${booking.journeys[1].flightSegments[0].operatingCarrier.name}`
    }




    return (
      <div
      key={booking.bookingId}
      style={{
        border: 'solid',
        padding: '10px',
        margin: '10px',
        listStyleType: 'none'
      }}
    >
     <h1>Your Booking</h1>
     <p>Booking ID: {booking.bookingId}</p>
     <p>Totol Price: {booking.totalPrice.amount} GBP</p>
        
      <ul>{this.renderAReturnFlightSegment([obj1,obj2])}</ul>



    </div>
    )
  }

  renderAReturnFlightSegment = (flights, price = null, offerId = null) => {
    return (
      <li
        onClick={(event, offer) => this.handleBooking(event,offerId)}
        key={offerId}
        style={{
          border: 'solid',
          padding: '10px',
          margin: '10px',
          listStyleType: 'none'
        }}
      >
        <h2>{flights[0].airline}</h2>
        <div style={{ display: 'inline' }}>
          <Popup
            trigger={<h3>{flights[0].departure} </h3>}
            content={flights[0].departureName}
          />
          <h4>to</h4>
          <Popup
            trigger={<h3>{flights[0].arrival} </h3>}
            content={flights[0].arrivalName}
          />
        </div>
        <p>Duration: {flights[0].duration}</p>
        <p>Flight Number: {flights[0].flightNumber}</p>

        <h2>{flights[1].airline}</h2>
        <div style={{ display: 'inline' }}>
          <Popup
            trigger={<h3>{flights[1].departure} </h3>}
            content={flights[1].departureName}
          />
          <h4>to</h4>
          <Popup
            trigger={<h3>{flights[1].arrival} </h3>}
            content={flights[1].arrivalName}
          />
        </div>
        <p>Duration: {flights[1].duration}</p>
        <p>Flight Number: {flights[1].flightNumber}</p>
        <h2>Price: {price} GBP</h2>
      </li>
    )
  }

  renderContent = () => {
    if (this.state.booking) {
      return this.renderBooking()
    } else {
      return this.renderFlights() 
    }
  }

  render () {
    return (
      <div>
        <Button onClick={this.handleClick}>Search Flights</Button>
        {this.state.loading ? (
          <Segment>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>

            <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          </Segment>
        ) : (
          <ul>{this.renderContent()}</ul>
          // null
        )}
      </div>
    )
  }
}

export default App
