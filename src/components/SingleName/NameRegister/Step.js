import React from 'react';
import styled from '@emotion/styled/macro';

const offset = 180;

const Number = styled('div')`
  color: ${p => (p.progress === 100 ? '#42E068' : '#dfdfdf')};
  font-size: 34px;
  font-weight: 300;
  position: relative;
  width: 24px;
  height: 24px;
  flex: none;
  margin-right: 12px;
  margin-bottom: 20px;

  span {
    font-family: Overpass;
    font-style: normal;
    font-weight: 800;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.5px;

    color: #ffffff;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SVG = styled('svg')`
  stroke: #ccc;
  position: absolute;

  circle {
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
  }

  circle.progress {
    stroke-dasharray: ${offset};
    stroke-dashoffset: ${p => (offset / 100) * (p.progress - 100)};
  }
`;

const Content = styled('div')`
  margin-left: 8px;

  p {
    margin-top: 0;
    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: -0.5px;

    color: #161b24;
  }
`;

const StepContainer = styled('div')`
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
`;

const StepTitle = styled('div')`
  display: flex;

  h3 {
    margin-top: 2px;
    margin-bottom: 5px;
    font-family: Overpass;
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 25px;
    letter-spacing: -0.5px;

    color: #161b24;
  }
`;

const Step = ({ number, text, title, progress = 100 }) => (
  <StepContainer>
    <StepTitle>
      <Number progress={progress}>
        <SVG height="24" width="24" viewBox="0 0 24 24" progress={progress}>
          <circle cx="12" cy="12" r="12" fill="#161B24" />
        </SVG>
        <span>{number}</span>
      </Number>
      <h3>{title}</h3>
    </StepTitle>
    <Content>
      <p>{text}</p>
    </Content>
  </StepContainer>
);

export default Step;
