import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Form from './components/Form';
import DrawSign from './components/DrawSign';
import {Provider} from 'react-redux';
import store from './store';
import EndDoc from './components/EndDoc'
export default class App extends Component {
  render() {
   return (
     <Provider store={store}>
      <Router >
        <Switch>
          <Route exact path="/" component={Form}>
              <Form/>
          </Route>
          <Route path="/dokument" component={DrawSign}>
              <DrawSign/>
          </Route>
          <Route path="/end" component={EndDoc}>
          <EndDoc/>
          </Route>
        </Switch>
        <Redirect
        to={{
          pathname: "/"
        }}/>
      </Router>
     </Provider>
    )
  } 
}
