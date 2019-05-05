import React from "react";
import { connect } from "react-redux";

import { setToken } from "../redux/actions/token";
import { setUserName } from "../redux/actions/user";

export class AuthPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true
    }

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = e => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password
      }
    };

    if(!this.state.isLoggedIn) {
      requestBody = {
        query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(userInput: { email: $email, password: $password }) {
            _id
            email
          }
        }
        `,
        variables: {
          email,
          password
        }
      };
    };

    if (email.trim().length !== 0 && password.trim().length !== 0) {
      if(password.trim().length < 1 ) {
        return;
      }

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
        if(resData.data.login.token) {
          this.props.setToken(resData.data.login.token);
          this.props.setUserName(resData.data.login.userId)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  switchModeHandler = () => {
    this.setState( prevState => {
      return { isLoggedIn: !prevState.isLoggedIn }
    })
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" autoFocus ref={this.emailEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">{this.state.isLoggedIn? "Login" : "Signup"}</button>
          <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLoggedIn ? "Signup" : "Login"}</button>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setToken: token => dispatch(setToken(token)),
  setUserName: userName => dispatch(setUserName(userName))
});

export default connect(null, mapDispatchToProps)(AuthPage);