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
      users: this.fetchUsers(),
      tasks: this.fetchTasks()
    };
  };

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////  REQUESTS //////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  fetchUsers() {
    $.ajax("/api/v1/users", {
      method: "get",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { users: resp.data });
        this.setState(state1);
      }
    });
  };

  fetchTasks() {
    $.ajax("/api/v1/tasks", {
      method: "get",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
        this.setState(state1);
      }
    });
  };

  createTask() {
    let tasktitle = $("#new-title")[0].value;
    let taskdesc = $("#new-desc")[0].value;
    let taskowner = $("#new-owner").find(":selected")[0].value;
    if (tasktitle == "" || taskdesc == "") {
      // missing fields
      if (tasktitle == "" && taskdesc != "") {
        alert("Task title cannot be empty");
      } else if (tasktitle != "" && taskdesc == "") {
        alert("Task description cannot be empty");
      } else {
        alert("Task title & description cannot be empty");
      }
    } else {
      let taskData = {title: tasktitle, description: taskdesc, user_id: taskowner}
      $.ajax("/api/v1/tasks", {
        method: "post",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({task: taskData}),
        success: (resp) => {
          this.fetchTasks();
        }
      });
    };
  };

  changeTime(task, time) {
    if ((time == 15) || (time == -15 && task.duration > 0)) {
      // don't allow negative times
      task.duration = task.duration + time;
      $.ajax("/api/v1/tasks", {
        method: "post",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({task: task}),
        success: (resp) => {
          this.fetchTasks();
        }
      });
    }
  }

  markComplete(task) {
    task.complete = !task.complete;
    $.ajax("/api/v1/tasks", {
      method: "post",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({task: task}),
      success: (resp) => {
        this.fetchTasks();
      }
    });
  }
  
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
        <div className="row">&nbsp;</div>
        <Route path="/" exact={true} render={() =>
          <SignupForm session={this.state.session} root={this}/>
        } />
        <Route path="/users" exact={true} render={() =>
          <Users users={this.state.users}/>
        } />
        <Route path="/tasks" exact={true} render={() =>
          <Tasks tasks={this.state.tasks} uid={null} userid={(this.state.session == null) ? null : this.state.session.user_id}
          root={this}/>
        } />
        <Route path="/mytasks" exact={true} render={() =>
          <Tasks tasks={this.state.tasks} uid={(this.state.session == null) ? null : this.state.session.user_id}
          userid={(this.state.session == null) ? null : this.state.session.user_id} root={this}/>
        } />
        <Route path="/newtask" exact={true} render={() =>
          <NewTask users={this.state.users} uid={(this.state.session == null) ? null : this.state.session.user_id}
          root={this}/>
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
  let nav_bar;
  if (session == null) {
    session_info = <div className="form-inline">
      <input type="email" placeholder="email" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({email: ev.target.value})} />
      <input type="password" placeholder="password" onKeyDown={(ev) => root.enter_login(ev)}
             onChange={(ev) => root.update_login_form({password: ev.target.value})} />
      <button className="btn btn-sm btn-secondary" onClick={() => root.login()}>Login</button>
    </div>;
    nav_bar = <div className="col-4">
    <p>
      <Link to={"/tasks"} onClick={(ev) => root.fetchTasks()}>Tasks</Link>&nbsp;|&nbsp;
      <Link to={"/users"} onClick={(ev) => root.fetchUsers()}>Users</Link>
    </p>
  </div>;
  }
  else {
    session_info = <div>
      <p>Hello, {session.user_email}</p>
      <Link to="/" className="btn btn-sm btn-secondary" onClick={() => root.logout()}>Logout</Link>
    </div>
    nav_bar = <div className="col-4">
    <p>
      <Link to={"/tasks"} onClick={(ev) => root.fetchTasks()}>Tasks</Link>&nbsp;|&nbsp;
      <Link to={"/users"} onClick={(ev) => root.fetchUsers()}>Users</Link>&nbsp;|&nbsp;
      <Link to={"/mytasks"} onClick={(ev) => root.fetchTasks()}>My Tasks</Link>
    </p>
  </div>;
  }

  if (session == null) {
  return <div className="row">
    <div className="col-4">
      <Link to={"/"}><h1 id="pagetitle">Task Track</h1></Link>
    </div>
      {nav_bar}
    <div className="col-4">
      {session_info}
    </div>
  </div>;
  } else {
    return <div>
      <div className="row">
        <div className="col-4">
          <Link to={"/"}><h1 id="pagetitle">Task Track</h1></Link>
        </div>
        {nav_bar}
        <div className="col-4">
          {session_info}
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center">
          <Link to={"/newtask"} id="newtask" className="btn btn-primary center-block">New Task</Link>
        </div>
      </div>
    </div>;
  }
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
              <Link to={"/mytasks"} className="btn btn-primary btn-block" onClick={() => root.signup()}>Go!</Link>
            </div>
          </div>
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// USER //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function Users(props) {
  let rows = _.map(props.users, (user) => <User key={user.id} user={user} />);
  return <div className="row">
    <div className="col-12">
      <table className="table table-striped table-bordered">
        <thead className="thead thead-dark">
          <tr>
            <th>Email</th>
            <th>Administrator</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  </div>;
}

function User(props) {
  let {user} = props;
  return <tr>
    <td>{user.email}</td>
    <td>{user.admin ? "👍" : "👎"}</td>
  </tr>;
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// TASKS //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function Tasks(props) {
  // props.uid is for mytasks vs tasks filtering
  // props.userid is for filtering which task belongs to whom for task editing
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} userid={props.userid} root={props.root}/>);
  if (props.uid != null) {
    // filter tasks to match current users id, for my tasks view
    tasks = tasks.filter(function(x) {
      return x.props.task.user_id == props.uid;
    })
  };
  return <div className="row">
    {tasks}
  </div>;
}

function Task(props) {
  // userid is what we use to show mark complete and edit time buttons
  let {task, uid, userid, root} = props;
  let buttons, complete;
  if (!task.complete) {
    if (task.duration != 0) {
      buttons = <td>
        <button className="btn btn-sm btn-outline-success" onClick={() => root.changeTime(task, 15)}>+15 min</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => root.changeTime(task, -15)}>-15 min</button>
      </td>;
    } else {
      buttons = <td>
        <button className="btn btn-sm btn-outline-success" onClick={() => root.changeTime(task, 15)}>+15 min</button>
      </td>;
    }
    complete = <td>
      <button className="btn btn-sm btn-success" onClick={() => root.markComplete(task)}>Mark Complete</button>
    </td>
  } else {
    buttons = <td></td>
    complete = <td>
      <button className="btn btn-sm btn-danger" onClick={() => root.markComplete(task)}>Mark Incomplete</button>
    </td>
  }
  if (task.user_id == userid) {
    // enable editing on this task
    return <div className="card task-card">
    <div className="card-header">
      {task.title}
    </div>
    <div className="card-body">
      <p className="card-text">{task.description}</p>
    </div>
      <table className="table">
        <tbody>
          <tr>
            <td>
              Time Spent: {task.duration}
            </td>
            {buttons}
          </tr>
          <tr>
            <td>
              Status: {task.complete ? "👍" : "👎"}
            </td>
            {complete}
          </tr>
        </tbody>
      </table>
    <div className="card-footer">
      Assigned to: {task.user_email}
    </div>
  </div>;
  } else {
    // disable editing on this task, it doesnt belong to current user
    return <div className="card task-card">
      <div className="card-header">
        {task.title}
      </div>
      <div className="card-body">
        <p className="card-text">{task.description}</p>
      </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Time Spent: {task.duration}</li>
          <li className="list-group-item">Status: {task.complete ? "👍" : "👎"}</li>
        </ul>
      <div className="card-footer">
        Assigned to: {task.user_email}
      </div>
    </div>;
  }
}

function NewTask(props) {
  let {users, uid, root} = props;
  let userList = _.map(users, (u) => <option user={u} value={u.id} key={u.id}>{u.email}</option>);
  return <div className="card task-card">
    <div className="card-header">
      <input type="text" placeholder="title" id="new-title"></input>
    </div>
    <div className="card-body">
      <p className="card-text">
        <textarea placeholder="description" rows="5" id="new-desc"></textarea>
      </p>
      <p className="card-text text-center">
        Assign to:&nbsp;
        <select id="new-owner">
          {userList}
        </select>
      </p>
    </div>
    <div className="card-footer text-center">
      <Link to={"/tasks"} className="btn btn-primary btn-block" onClick={() => root.createTask()}>Go!</Link>
    </div>
  </div>;
}