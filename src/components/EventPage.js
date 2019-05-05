import React from "react";
import { connect } from "react-redux";

import Modal from "./Modal";
import EventList from "./EventList";
import Spinner from "./Spinner";

class EventPage extends React.Component {
  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.priceElRef = React.createRef();

    this.state = {
      creating: false,
      events: [],
      isLoading: false,
      selectedEvent: null
    };
  }

  isActive=true;

  onModalCancel = () => {
    this.setState({
      creating: false,
      selectedEvent: null
    })
  }

  onModalConfirm = () => {
    this.setState({
      creating: false
    });
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const date = this.dateElRef.current.value;
    const price = +this.priceElRef.current.value;

    if (title.trim().length !== 0 &&
        description.trim().length !== 0 &&
        date.trim().length !== 0 &&
        price >= 0
        ) {
          const requestBody = {
            query: `
              mutation createEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
                createEvent(eventInput: {title: $title, description: $description, date: $date, price: $price }) {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
                }
              }
            `,
            variables: {
              title,
              price,
              description,
              date
            }
          };
      
          fetch("/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.props.token.token}`
            }
          }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
              throw new Error("Failed!");
            }
            return res.json();
          }).then(resData => {
            if(resData.data) {
              this.fetchEvents(prevState => {
                const updatedEvents = [...prevState];
                updatedEvents.push({
                  _id: resData.data.createEvent._id,
                  title: resData.data.createEvent.title,
                  description: resData.data.createEvent.description,
                  date: resData.data.createEvent.date,
                  price: resData.data.createEvent.price,
                  creator: {
                    _id: this.props.userId.userId
                  }
                });
                return {events: updatedEvents}
              });
            }
          })
          .catch(err => {
            console.log(err);
          })
        }
  }

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    });
  }

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData => {
      if (resData.data && this.isActive) {
        this.setState({
          events: resData.data.events,
          isLoading: false
        })
      }
    })
    .catch(err => {
      console.log(err);
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
    })
  }
  
  componentDidMount = () => {
    this.fetchEvents();
  }

  handleBookEvent = () => {
    const requestBody = {
      query: `
        mutation bookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token.token}`
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData => {
      this.setState({ selectedEvent: null });
    })
    .catch(err => {
      console.log(err);
      this.setState({ selectedEvent: null });
    })
  }

  handleViewDetail = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    })
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating &&
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            confirmText="Confirm"
            cancelText="Cancel"
            onModalCancel={this.onModalCancel}
            onModalConfirm={this.onModalConfirm}
          >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={this.titleElRef} autoFocus/>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={this.priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea type="text" id="description" rows="4" ref={this.descriptionElRef} />
            </div>
          </form>
          </Modal>
        }
        {this.state.selectedEvent &&
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm={!!this.props.userId.userId && this.props.userId.userId !== this.state.selectedEvent.creator._id}
            confirmText="Book"
            cancelText={!!this.props.userId.userId && this.props.userId.userId !== this.state.selectedEvent.creator._id ? "Cancel" : "Close"}
            onModalCancel={this.onModalCancel}
            onModalConfirm={this.handleBookEvent}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        }
        {this.props.token.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        )}
          {this.state.isLoading ?
            <Spinner /> :
            <EventList
              events={this.state.events}
              userId={this.props.userId.userId}
              onViewDetail={this.handleViewDetail}
            />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
  userId: state.userId
});

export default connect(mapStateToProps)(EventPage);