// Libraries
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Views
import views from '../views/main';

const Routes = () => (
	<Switch>
        <Route exact path="/" component={views.Home} />
        <Route path="/manage-deck" component={views.Manager} />
        <Route path="/about" component={views.About} />
    </Switch>
);

export default Routes;