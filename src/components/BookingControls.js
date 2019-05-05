import React from "react";

const BookingControls = props => (
  <div className="booking-control">
  <button className={props.activeType === "list"
                      ? "active"
                      : ""}
          onClick={props.changeOutput.bind(this, "list")
  }>
    List
  </button>
  <button className={props.activeType === "chart"
                      ? "active"
                      : ""}
          onClick={props.changeOutput.bind(this, "chart")
  }>
    Chart
  </button>
</div>
)

export default BookingControls;