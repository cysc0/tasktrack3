import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function root_init(node) {
  ReactDOM.render(
    <div>Hello world</div>, node);
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

  update_login_form(data) {
    let form1 = _.assign({}, this.state.login_form, data);
    let state1 = _.assign({}, this.state, { login_form: form1 });
    this.setState(state1);
  };

  render() {
    return <Router>
      <div>
        <Header session={this.state.session} root={this} />
        <Route path="/" exact={true} render={() =>
          <ProductList products={this.state.products} />
        } />
        <Route path="/users" exact={true} render={() =>
          <UserList users={this.state.users} />
        } />
      </div>
    </Router>;
  }
};