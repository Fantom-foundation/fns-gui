import React, { Fragment } from 'react';

import Container from './Container';
import SideNav from '../SideNav/SideNav';
import Main from './Main';

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Container>
      <SideNav />
      <Main>{children}</Main>
    </Container>
  </Fragment>
);

export default DefaultLayout;
