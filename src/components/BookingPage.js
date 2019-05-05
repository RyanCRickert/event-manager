import React from "react";
import { connect } from "react-redux";

import BookingChart from "./BookingChart";
import BookingControls from "./BookingControls";
import BookingList from "./BookingList";
import Spinner from "./Spinner";

class BookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      bookings: [],
      outputType: "list"
    }
  }

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };

    fetch("http://localhost:8081/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.props.token.token}`
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData => {
      if(resData.data) {
        this.setState({
          bookings: resData.data.bookings,
          isLoading: false
        })
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    })
  }

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    fetch("http://localhost:8081/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.props.token.token}`
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData => {
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookingId
        });
        return { bookings: updatedBookings, isLoading: false };
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  changeOutputHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list"})
    } else {
      this.setState({ outputType: "chart"})
    }
  }

  render() {
    let content = <Spinner />
    if (!this.state.isLoading) {
      content= (
        <React.Fragment>
          <BookingControls
            activeType={this.state.outputType}
            changeOutput={this.changeOutputHandler}
          />
          <div>
            {this.state.outputType === "list" ?
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          /> :
          <BookingChart
            bookings={this.state.bookings}
          />
            }
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token
});

export default connect(mapStateToProps)(BookingPage);