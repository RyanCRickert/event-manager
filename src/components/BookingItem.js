import React from "react";
import { connect } from "react-redux";

const BookingItem = props => (
  <li className="event-list__item">
    <div className="booking">
      <h1>{props.event.title} - {new Date(props.event.date).toLocaleDateString()}</h1>
    </div>
     <div>
      <button className="btn" onClick={props.onDelete.bind(this, props._id)}>Cancel</button>
     </div>
  </li>
)

const mapStateToProps = (state) => ({
  userId: state.userId
});

export default connect(mapStateToProps)(BookingItem);