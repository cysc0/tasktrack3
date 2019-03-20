import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function root_init(node) {
  ReactDOM.render(<Root/>, node);
}

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_form: {email: "", password: "", newUser: false},
      signup_form: {email: "", password: "", newUser: true},
      session: null,
      users: [],
    };
  };
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// USER SESSION /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  logout() {
    this.state.session = null;
    this.setState(this.state);
  }
  
  login() {
    $.ajax("/api/v1/auth", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.login_form),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { session: resp.data });
        this.setState(state1);
      }
    });
  };

  // enable login via pressing enter while textbox is focused
  enter_login(ev) {
    if (ev.keyCode == 13) { // keycode for enter key
      this.login();
    }
  }

  update_login_form(data) {
    let form1 = _.assign({}, this.state.login_form, data);
    let state1 = _.assign({}, this.state, { login_form: form1 });
    this.setState(state1);
  };

  signup() {
    $.ajax("/api/v1/auth", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.signup_form),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { session: resp.data });
        this.setState(state1);
      }
    });
  };

  // enable login via pressing enter while textbox is focused
  enter_signup(ev) {
    if (ev.keyCode == 13) { // keycode for enter key
      this.signup();
    }
  }

  update_signup_form(data) {
    let form1 = _.assign({}, this.state.signup_form, data);
    let state1 = _.assign({}, this.state, { signup_form: form1 });
    this.setState(state1);
  };

  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// RENDER ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  render() {
    return <Router>
      <div>
        <Header session={this.state.session} root={this} />
        <Route path="/" exact={true} render={() =>
          <SignupForm session={this.state.session} root={this}/>
        } />
      </div>
    </Router>;
  }
};

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// HEADER /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
function Header(props) {
  // Header setup borrowed from Nat Tuck: https://github.com/NatTuck/husky_shop_spa
  let {root, session} = props;
  let session_info;
  if (session == null) {
    session_info = <div className="form-inline">
      <input type="email" placeholder="email" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({email: ev.target.value})} />
      <input type="password" placeholder="password" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({password: ev.target.value})} />
      <button className="btn btn-sm btn-secondary" onClick={() => root.login()}>Login</button>
    </div>;
  }
  else {
    session_info = <div>
      <p>Hello, {session.user_email}</p>
      <button className="btn btn-sm btn-secondary" onClick={() => root.logout()}>Logout</button>
    </div>
  }

  return <div className="row">
    <div className="col-4">
      <h1>Task Track</h1>
    </div>
    <div className="col-4">
      <p>
        <Link to={"/tasks"}>Tasks</Link>&nbsp;|&nbsp;
        <Link to={"/users"}>Users</Link>&nbsp;|&nbsp;
        <Link to={"/mytasks"}>My Tasks</Link>
      </p>
    </div>
    <div className="col-4">
      {session_info}
    </div>
  </div>;
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// SIGNUP /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function SignupForm(props) {
  let {root, session} = props;
  return  <div className="card text-center">
            <div className="card-header">
              Sign Up
            </div>
            <div className="card-body">
              <input type="email" placeholder="email" onKeyDown={(ev) => root.enter_signup(ev)}
                onChange={(ev) => root.update_signup_form({email: ev.target.value})} />
              <input type="password" placeholder="password" onKeyDown={(ev) => root.enter_signup(ev)}
                onChange={(ev) => root.update_signup_form({password: ev.target.value})} />
            </div>
            <div className="card-footer text-muted">
              <button className="btn btn-primary btn-block" onClick={() => root.signup()}>Go!</button>
            </div>
          </div>
}