// Libraries
import React from 'react';
import { transaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link, NavLink, withRouter } from 'react-router-dom';

// Css
import './NavbarInternal.css';

// Images
import playingCardsImg from '../../../images/card-icons/playing-cards.png';

// Components
import LoginModal from '../../modals/LoginModal';
import RegisterModal from '../../modals/RegisterModal';

@withRouter @inject((RootStore) => {
  return {
    User: RootStore.UserStore
  }
}) @observer
class NavbarInternal extends React.Component {
  constructor(props) {
    super(props);

    // Func binds
    this.logout = this.logout.bind(this);
  }

  logout() {
    if (this.props.User.isLoggedIn) {
      this.props.User.logOut().then((response) => {
        transaction(() => {
          response.transactions();
          this.props.history.push('/');
        });
      }).catch((error) => {
        console.log(error.response);
      });
    }
  }

  render () {
    //this.props.User.isLoading
    const loginNav = this.props.User.isLoggedIn ? (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active">{localStorage.getItem('username')}</a>
        </li>

        <li className="nav-item">
          <a className="nav-link" onClick={this.logout}>Logout</a>
        </li>
      </ul>
    ) : (!this.props.User.isInitialLoading ? (
      <React.Fragment>
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
      </React.Fragment>
    ) : (
      ''
    ));

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <img src={playingCardsImg} className="logo" alt="logo"/>
        <Link className="navbar-brand" to="/">Card Memory</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" 
                aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="main-nav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/">Home <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to="/manage-deck">Manager</NavLink>
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

export default NavbarInternal;