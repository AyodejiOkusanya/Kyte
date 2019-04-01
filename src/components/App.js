import React, { Component } from 'react'
import API from './API'
import {
  Button,
  Dimmer,
  Loader,
  Image,
  Segment,
  Popup,
  Form
} from 'semantic-ui-react'

class App extends Component {
  state = {
    results: [],
    flightsArray: [],
    loading: false,
    allOffers: [],
    booking: null,
    showingForm: false,
    errorMessage: null,
    passengerId: 'SH1',
    gender1: 'female',
    birthDate1: '1995-07-20',
    title1: 'Mrs',
    givenName1: 'First',
    surname1: 'Traveler',
    type1: 'adult',
    email1: 'first.traveler@gokyte.com',
    gender2: 'female',
    birthDate2: '1995-07-20',
    title2: 'Mrs',
    givenName2: 'First',
    surname2: 'Traveler',
    type2: 'adult',
    email2: 'first.traveler@gokyte.com',
    cardholderName: 'Mrs First Traveler',
    cardType: 'visa-debit',
    cardNumber: '4263930000007395',
    expiryMonth: '07',
    expiryYear: '2023',
    issueMonth: '03',
    issueYear: '2017',
    cvv: '000',
    contactEmail: 'first.traveler@gokyte.com',
    addressLine1: '123 Fare Street',
    addressLine2: 'Able Avenue',
    addressLine3: '',
    city: 'Bournemouth',
    postalCode: 'BH4 8EH',
    countryCode: 'GB',
    departureAirport: 'LHR',
    arrivalAirport: 'HKG',
    departureDate: '2019-04-05',
    ticketTypes: 'economy',
    returnDate: '2019-04-10',
    showInitialForm: true 
  }

  handleClick = (event) => {
    event.preventDefault() 
    this.setState({showInitialForm: false})
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
    let flightDetails = {
      departureAirport: this.state.departureAirport,
      arrivalAirport: this.state.arrivalAirport,
      departureDate: this.state.departureDate,
      ticketTypes: this.state.ticketTypes,
      returnDate: this.state.returnDate
    }
    API.get_offers(flightDetails)
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
      .catch(error => {
        this.setState({ errorMessage: error })
      })
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
    this.setState({ loading: true })
    API.make_booking(offerId)
      .then(result => {
        this.setState({ loading: false })
        this.setState({ booking: result[1] })
      })
      .catch(error => {
        this.setState({ errorMessage: error })
      })
  }

  renderBooking = () => {
    const booking = this.state.booking
    const obj1 = {
      id: booking.journeys[0].flightSegments[0].id,
      departure: `${
        booking.journeys[0].flightSegments[0].departure.airportCode
      }`,
      departureName: `${
        booking.journeys[0].flightSegments[0].departure.airportName
      }`,
      arrival: `${booking.journeys[0].flightSegments[0].arrival.airportCode}`,
      arrivalName: `${
        booking.journeys[0].flightSegments[0].arrival.airportName
      }`,
      duration: `${this.convetMinutesToHourMinutes(
        booking.journeys[0].flightSegments[0].flightDuration
      )}`,
      flightNumber: `${booking.journeys[0].flightSegments[0].flightNumber}`,
      airline: `${booking.journeys[0].flightSegments[0].operatingCarrier.name}`
    }
    const obj2 = {
      id: booking.journeys[1].id,
      departure: `${
        booking.journeys[1].flightSegments[0].departure.airportCode
      }`,
      departureName: `${
        booking.journeys[1].flightSegments[0].departure.airportName
      }`,
      arrival: `${booking.journeys[1].flightSegments[0].arrival.airportCode}`,
      arrivalName: `${
        booking.journeys[1].flightSegments[0].arrival.airportName
      }`,
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
        <a onClick={() => this.setState({ showingForm: true })}>
          Confirm Booking
        </a>
        <p>Booking ID: {booking.bookingId}</p>
        <p>Totol Price: {booking.totalPrice.amount} GBP</p>

        <ul>{this.renderAReturnFlightSegment([obj1, obj2])}</ul>
      </div>
    )
  }

  renderAReturnFlightSegment = (flights, price = null, offerId = null) => {
    return (
      <li
        onClick={(event, offer) => this.handleBooking(event, offerId)}
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
        {price ? <h2>Price: {price} GBP</h2> : null}
      </li>
    )
  }

  handleFormChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  

  handleFormSubmit = event => {
    console.log('worked')
    event.preventDefault()
    const bookingInfo = {}
    bookingInfo.bookingId = `{{${this.state.booking.bookingId}}}`

    const passenger1 = {
      passengerId: this.state.passengerId,
      gender: this.state.gender1,
      birthDate: this.state.birthDate1,
      title: this.state.title1,
      givenName: this.state.givenName1,
      surname: this.state.surname1,
      type: this.state.type1,
      email: this.state.email1
    }

    const passenger2 = {
      passengerId: this.state.passengerId,
      gender: this.state.gender2,
      birthDate: this.state.birthDate2,
      title: this.state.title2,
      givenName: this.state.givenName2,
      surname: this.state.surname2,
      type: this.state.type2,
      email: this.state.email2
    }

    bookingInfo.passengers = [passenger1, passenger2]

    const payment = {
      cardholderName: this.state.cardholderName,
      cardType: this.state.cardType,
      cardNumber: this.state.cardNumber,
      expiryMonth: this.state.expiryMonth,
      expiryYear: this.state.expiryYear,
      issueMonth: this.state.issueMonth,
      issueYear: this.state.issueYear,
      cvv: this.state.cvv,
      contactEmail: this.state.contactEmail,
      address: {
        addressLine1: this.state.addressLine1,
        addressLine2: this.state.addressLine2,
        addressLine3: this.state.addressLine3,
        city: this.state.city,
        postalCode: this.state.postalCode,
        countryCode: this.state.countryCode
      }
    }
    bookingInfo.payment = payment
    this.setState({ loading: true })
    return API.confirm_booking(bookingInfo)
      .then(resp => {
        console.log(resp)
        this.setState({ loading: false })
      })
      .catch(error => {
        this.setState({ errorMessage: error, loading: false })
      })
  }

  renderPaymentForm = () => {
    return (
      <div>
        <h1>Fill in you card details</h1>
        <Form>
          <h2>Passenger 1</h2>

          <Form.Field>
            <label>Given Name</label>
            <input
              onChange={this.handleFormChange}
              name='givenName1'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>Surname</label>
            <input
              onChange={this.handleFormChange}
              name='surname1'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>D.O.B</label>
            <input
              onChange={this.handleFormChange}
              name='birthdate1'
              type='date'
            />
          </Form.Field>
          <Form.Field>
            <label>Adult/Child</label>
            <input onChange={this.handleFormChange} name='type1' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Title</label>
            <input onChange={this.handleFormChange} name='title1' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Gender</label>
            <input
              onChange={this.handleFormChange}
              name='gender1'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>Email</label>
            <input
              onChange={this.handleFormChange}
              name='email1'
              type='email'
            />
          </Form.Field>

          <h2>Passenger 2</h2>
          <Form.Field>
            <label>Given Name</label>
            <input
              onChange={this.handleFormChange}
              name='givenName2'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>Surname</label>
            <input
              onChange={this.handleFormChange}
              name='surname2'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>D.O.B</label>
            <input
              onChange={this.handleFormChange}
              name='birthdate2'
              type='date'
            />
          </Form.Field>
          <Form.Field>
            <label>Adult/Child</label>
            <input onChange={this.handleFormChange} name='type2' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Title</label>
            <input onChange={this.handleFormChange} name='title2' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Gender</label>
            <input
              onChange={this.handleFormChange}
              name='gender2'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>Email</label>
            <input
              onChange={this.handleFormChange}
              name='email2'
              type='email'
            />
          </Form.Field>

          <h2>Payment Details</h2>
          <Form.Field>
            <label>Cardholder Name</label>
            <input
              onChange={this.handleFormChange}
              name='cardholderName'
              type='text'
            />
          </Form.Field>

          <Form.Field>
            <label>Card Type</label>
            <input
              onChange={this.handleFormChange}
              name='cardType'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Card Number</label>
            <input
              onChange={this.handleFormChange}
              name='cardNumber'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Expiry Month</label>
            <input
              onChange={this.handleFormChange}
              name='expiryMonth'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Expiry Year</label>
            <input
              onChange={this.handleFormChange}
              name='expiryYear'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Issue Month</label>
            <input
              onChange={this.handleFormChange}
              name='issueMonth'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Issue Year</label>
            <input
              onChange={this.handleFormChange}
              name='issueYear'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>CVV</label>
            <input onChange={this.handleFormChange} name='cvv' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              onChange={this.handleFormChange}
              name='contactEmail'
              type='email'
            />
          </Form.Field>
          <Form.Field>
            <label>Adress Line 1</label>
            <input
              onChange={this.handleFormChange}
              name='addressLine1'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Address Line 2</label>
            <input
              onChange={this.handleFormChange}
              name='addressLine2'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Address Line 3</label>
            <input
              onChange={this.handleFormChange}
              name='addressLine3'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input onChange={this.handleFormChange} name='city' type='text' />
          </Form.Field>
          <Form.Field>
            <label>Postcode</label>
            <input
              onChange={this.handleFormChange}
              name='postalCode'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Country Code</label>
            <input
              onChange={this.handleFormChange}
              name='countryCode'
              type='text'
            />
          </Form.Field>
          <Button onClick={this.handleFormSubmit} type='submit'>
            Submit
          </Button>
        </Form>
      </div>
    )
  }

  renderInitialForm = () => {
    return (
      <Form>
        <Form.Field>
            <label>Departure Airport</label>
            <input
              onChange={this.handleFormChange}
              name='departureAirport'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Arrival Airport</label>
            <input
              onChange={this.handleFormChange}
              name='arrivalAirport'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Departure date</label>
            <input
              onChange={this.handleFormChange}
              name='departureDate'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Return date</label>
            <input
              onChange={this.handleFormChange}
              name='returnDate'
              type='text'
            />
          </Form.Field>
          <Form.Field>
            <label>Ticket types</label>
            <input
              onChange={this.handleFormChange}
              name='ticketTypes'
              type='text'
            />
          </Form.Field>
          <Button onClick={this.handleClick}>Search Flights</Button>
      </Form>
    )
  }

  renderContent = () => {
    if (this.state.showInitialForm) {
      return this.renderInitialForm() 
    } else if (this.state.showingForm) {
      return this.renderPaymentForm()
    } else if (this.state.booking) {
      return this.renderBooking()
    } else {
      return this.renderFlights()
    }
  }

  render () {
    return (
      <div>
        
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
