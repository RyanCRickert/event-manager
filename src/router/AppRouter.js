import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import AuthPage from "../components/AuthPage";
import BookingPage from "../components/BookingPage";
import EventPage from "../components/EventPage";
import NavBar from "../components/NavBar";
import NotFoundPage from "../components/NotFoundPage";

export const history = createBrowserHistory();

const AppRouter = props => (
  <Router history={history}>
    <NavBar />
    <main className="main-content">
      <Switch>
        {props.token.token && <Redirect from="/auth" to="/events" exact />}
        {!props.token.token && <Route path="/auth" component={AuthPage} exact />}
        {props.token.token && <Route path="/bookings" component={BookingPage} exact />}
        <Route path="/events" component={EventPage} exact />
        {!props.token.token && <Redirect to="/auth" exact />}
        <Route component={NotFoundPage} />
      </Switch>
    </main>
  </Router>
)

const mapStateToProps = (state) => {
  return {
    token: state.token
  };
}

export default connect(mapStateToProps)(AppRouter);