// Libraries
import React, { Component } from "react";

// Site-wide css
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

// Site-wide js


/////////////////
//  Begin App  //
/////////////////

// Routes
import Routes from './routes/Routes';

// Header/Footers
import NavbarInternal from './views/main/header/NavbarInternal';

// Components (context/provided using Mobx)
import AlertMain from './views/main/alert/AlertMain';

// Providers

// NOTE: Wrap all components being observed with withRouter,
//  issue: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md

// Root component & App Layout
class App extends Component {
  render() {
    return (
      <div className="App min-vh-100 d-flex flex-column">
        <NavbarInternal />
        <div className="AppContent bg-light d-flex flex-column flex-grow-1">
            <Routes/>
            <AlertMain/>
        </div>
      </div>
    );
  }
}

export default App;
