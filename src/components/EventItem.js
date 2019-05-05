import React from "react";
import { connect } from "react-redux";

const EventItem = props => (
  <li className="event-list__item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      <button className="btn" onClick={props.onDetail.bind(this, props._id)}>View Details</button>
      {props.creator._id == props.userId.userId && <p>You are the owner of this event</p>}
    </div>
  </li>
)

const mapStateToProps = (state) => ({
  userId: state.userId
});

export default connect(mapStateToProps)(EventItem);