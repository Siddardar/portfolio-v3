// loader.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import loadingAnimation from '../../static/loading.json'; // your .json file

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;
  opacity: ${props => (props.isMounted ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const StyledAnimationWrapper = styled.div`
  /* Default size (desktop, etc.) */
  width: 500px;
  height: 500px;

  /* If you want to shrink on smaller screens: */
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }

  @media (max-width: 480px) {
    width: 200px;
    height: 200px;
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // For demonstration, auto-finish after 3s
    const timeout = setTimeout(() => finishLoading(), 3000);
    setIsMounted(true);
    return () => clearTimeout(timeout);
  }, [finishLoading]);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <Helmet bodyAttributes={{ class: 'hidden' }} />

      {/* Lottie animation contained in a styled <div> */}
      <StyledAnimationWrapper>
        <Lottie animationData={loadingAnimation} loop style={{ width: '100%', height: '100%' }} />
      </StyledAnimationWrapper>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
