import React from "react";

import EventItem from "./EventItem";

const EventList = props => {
  return <ul className="event__list">
    {props.events.map(event => {
      return <EventItem
                key={event._id}
                userId={props.userId}
                {...event}
                onDetail={props.onViewDetail}
              />
    })}
  </ul>
}

export default EventList;