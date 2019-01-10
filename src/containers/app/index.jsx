import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../layout/';

const App = () => (
  <Route path="/" component={Layout} />
);

export default App;
