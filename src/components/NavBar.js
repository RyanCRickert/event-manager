import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { updateToken } from "../redux/actions/token";
import { setUserName } from "../redux/actions/user";

const handleClick = props => {
  props.updateToken();
  props.setUserName();
}

export const NavBar = props => (
  <header className="navigation">
    <div className="navigation__logo">
      <h1>Event Booker</h1>
    </div>
    <nav className="navigation__items">
      <ul>
        {!props.token.token && 
          <li>
            <NavLink to="auth">Authentication</NavLink>
          </li>
        }
        <li>
          <NavLink to="events">Events</NavLink>
        </li>
        {props.token.token && 
          <React.Fragment>
            <li>
              <NavLink to="bookings">Bookings</NavLink>
            </li>
            <li>
              <button onClick={handleClick.bind(this, props)}>Logout</button>
            </li>  
          </React.Fragment>
        }
      </ul>
    </nav>
  </header>
)

const mapStateToProps = (state) => {
  return {
    token: state.token
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateToken: () => dispatch(updateToken()),
  setUserName: () => dispatch(setUserName())
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);