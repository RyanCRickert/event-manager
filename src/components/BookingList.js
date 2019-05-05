import React from "react";

import BookingItem from "./BookingItem";

const BookingList = props => {
  return <ul className="event__list">
    {props.bookings.map(booking => {
      return <BookingItem
                key={booking._id}
                {...booking}
                onDelete={props.onDelete}
              />
    })}
  </ul>
}

export default BookingList;