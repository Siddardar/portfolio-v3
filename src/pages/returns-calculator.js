import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const ReturnCalc = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer>
      <h1>Return Calculator</h1>
      <p>This page is under construction. Please check back later for updates.</p>
    </StyledMainContainer>
  </Layout>
);

ReturnCalc.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ReturnCalc;
