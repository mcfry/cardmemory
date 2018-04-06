// Libraries
import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

// Css
import './NavbarInternal.css';

// Images
import playingCardsImg from '../../../images/card-icons/playing-cards.png';

// Components
import LoginModal from '../../modals/LoginModal';
import RegisterModal from '../../modals/RegisterModal';

class NavbarInternal extends React.Component {
  constructor(props) {
    super(props);

    // Func binds
    this.logout = this.logout.bind(this);

    this.state = {
      loggedIn: false
    };
  }

  isLoggedIn() {
    let username = localStorage.getItem('username');
    let email = localStorage.getItem('email');
    let authentication_token = localStorage.getItem('authentication_token');

    let loggedIn = false;
    if (username && email && authentication_token) { loggedIn = true; }

    if (this.state.loggedIn !== loggedIn) {
      this.setState({
        loggedIn: loggedIn
      });
    }
  }

  logout() {
    if (this.state.loggedIn) {
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('authentication_token');

      localStorage.pushItem('alerts', {
        type: 'success',
        message: "You've successfully logged out."
      });

      this.props.history.push('/');
    }
  }

  /* 
   * Lifecycle Functions
   */
  componentWillMount() {
    this.isLoggedIn();
  }

  componentWillReceiveProps() {
    this.isLoggedIn();
  }

  render () {
    const loginNav = this.state.loggedIn ? (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active">{localStorage.getItem('username')}</a>
        </li>

        <li className="nav-item">
          <a className="nav-link" onClick={this.logout}>Logout</a>
        </li>
      </ul>
    ) : (
      <div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-toggle="modal" data-target="#login-modal">Login</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" data-toggle="modal" data-target="#register-modal">Register</a>
          </li>
        </ul>

        <LoginModal/>
        <RegisterModal/>
      </div>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <img src={playingCardsImg} className="logo" alt="logo"/>
        <Link className="navbar-brand" to="/">Card Memory</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" 
                aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/">Home <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/manage-deck">Manager</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/practice">Practice</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/about">About</NavLink>
            </li>
          </ul>

          {loginNav}
        </div>
      </nav>
    );
  }
}

export default withRouter(NavbarInternal);