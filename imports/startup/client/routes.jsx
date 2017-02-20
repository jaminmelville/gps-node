import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Activity from '../../ui/Activity';
import Home from '../../ui/Home';
import Filters from '../../ui/Filters';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="filters" component={Filters} />
    <Route path="activity/:id" component={Activity} />
  </Router>
);

export default renderRoutes;
