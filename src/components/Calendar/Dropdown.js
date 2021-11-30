import React, { forwardRef } from 'react';
import { css } from 'emotion';

const dropdownStyles = css`
  position: absolute;
  bottom: 100%;
  left: 0;
  padding: 10px;
  border: 1px solid #e5e5e5;
  width: 150px;
  background-color: #0a162e;
  color: #eff3fb;
  margin: 0 auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

function Dropdown(props, ref) {
  const prependChildren = props.prependChildren || [];
  const children = props.children || [];
  const appendChildren = props.appendChildren || [];

  const allChildren = prependChildren.concat(children).concat(appendChildren);

  return (
    <div ref={ref} className={dropdownStyles}>
      {allChildren}
    </div>
  );
}

export default forwardRef(Dropdown);
