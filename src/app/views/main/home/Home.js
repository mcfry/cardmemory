import React from "react";
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import "./Home.css";

@withRouter @inject((RootStore) => {
	return {
		User: RootStore.UserStore,
		Manager: RootStore.ManagerStore
	}
}) @observer
class Home extends React.Component {

    render() {
        const { User, Manager } = this.props;

        return (
            <div className="d-flex flex-column justify-content-center align-items-center bg-light flex-grow-1">
              <h2 className="home-fs font-weight-bold pb-3">Welcome to Card Memory!</h2>
              <p className="text-center w-50">This application was built to fast track your ability to memorize an entire deck of cards (yes, all 52!).
                  It includes:
              </p>
              <ul>
                  <li>A default mnemonic system to get you started.</li>
                  <li>An interactive 3D panorama to serve as your memory palace that you can place cards in.</li>
                  <li>An interactive card maker that allows you to upload images and move them around.</li>
                  <li>The ability to create your own mnemonic system.</li>
                  <li>The ability to create your own 3D memory palaces from images that you upload.</li>
                  <li>A flash card testing and scoring system for you to practice and keep track of your best times.</li>
              </ul>
              {User.isLoggedIn && Manager.deckObject !== null ? (
                  <Link to="/manage-deck">
                    <btn type="button" className="btn btn-dark btn-lg mt-3">Go to My Deck</btn>
                  </Link>
              ) : (
                  <Link to="/manage-deck">
                    <btn type="button" className="btn btn-dark btn-lg mt-3">Get Started</btn>
                  </Link>
              )}
            </div>
        )
    }
}

export default Home;
