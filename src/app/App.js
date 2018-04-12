// Libraries
import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

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

// Basic Components
import Alert from './views/basic_components/Alert';

// NOTE: Wrap all components being observed with withRouter, 
//  issue: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
// Root component & App Layout
@withRouter @inject((RootStore) => {
  return {
    User: RootStore.UserStore
  }
}) @observer
class App extends Component {
  /* 
   * Lifecycle Functions
   */
  componentWillMount() {
    this.props.User.logIn();
  }

  render() {
    const sessionAlerts = sessionStorage.getArrayAndClear("alerts");
    const alerts = sessionAlerts !== null ? (
      sessionAlerts.map((alertObj, index) => {
        return (
          <Alert key={index} alertType={alertObj.type} alertMessage={alertObj.message} />
        )
      })
    ) : '';

    const isLoading = this.props.User.isLoading;

    return (
      <div className="App">
        {isLoading ? (
          <i className="fa fa-circle-o-notch fa-spin"></i>
        ) : (
          <div>
            <NavbarInternal />
            <div className="AppContent">

              <Routes/>

              <div className="container-fluid">
                {alerts}
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
