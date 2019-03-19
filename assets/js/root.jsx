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
      login_form: {email: "", password: ""},
      session: null,
      users: [],
    };
  };
  
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

  render() {
    return <Router>
      <div>
        <Header session={this.state.session} root={this} />
      </div>
    </Router>;
  }
};

// Header setup borrowed from Nat Tuck: https://github.com/NatTuck/husky_shop_spa
function Header(props) {
  let {root, session} = props;
  let session_info;
  if (session == null) {
    session_info = <div className="form-inline my-2">
      <input type="email" placeholder="email" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({email: ev.target.value})} />
      <input type="password" placeholder="password" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({password: ev.target.value})} />
      <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
    </div>;
  }
  else {
    session_info = <div className="my-2">
      <p>Hello, {session.user_email}</p>
    </div>
  }

  return <div className="row my-2">
    <div className="col-4">
      <h1>Task Track</h1>
    </div>
    <div className="col-4">
      <p>
        <Link to={"/"}>Products</Link> |
        <Link to={"/users"}>Users</Link>
      </p>
    </div>
    <div className="col-4">
      {session_info}
    </div>
  </div>;
}