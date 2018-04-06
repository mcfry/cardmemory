import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import './App.css';

// Header/Footers
import NavbarInternal from './views/main/header/NavbarInternal';

// Components
import Home from './views/main/home/Home';
import Manager from './views/main/manager/Manager';
import Practice from './views/main/practice/Practice';
import About from './views/main/about/About';
import Alert from './views/stateless/Alert';

class App extends Component {
  render() {
    const sessionAlerts = sessionStorage.getArrayAndClear("alerts");
    const alerts = sessionAlerts !== null ? (
      sessionAlerts.map((alertObj, index) => {
        return (
          <Alert key={index} alertType={alertObj.type} alertMessage={alertObj.message} />
        )
      })
    ) : '';

    return (
      <div className="App">
        <NavbarInternal />
        <div className="AppContent">
        
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/manage-deck" component={Manager} />
            <Route path="/practice" component={Practice} />
            <Route path="/about" component={About} />
          </Switch>

          <div className="container-fluid">
            {alerts}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
