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

// Basic Components
import Alert from './views/basic_components/Alert';

// Root component + Layout
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

          <Routes/>

          <div className="container-fluid">
            {alerts}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
