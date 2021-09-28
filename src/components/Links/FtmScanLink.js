import React from 'react';
import styled from '@emotion/styled/macro';
import useNetworkInfo from '../NetworkInformation/useNetworkInfo';
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg';

const FtmScanLinkContainer = styled('a')`
  display: inline-block;
  align-items: center;
  text-overflow: ellipsis;
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 25px;
  text-align: right;
  letter-spacing: -0.5px;
  color: #1969ff;

  svg {
    margin-left: 5px;
    transition: 0.1s;
    opacity: 0;
    flex-shrink: 0;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }
`;

const FtmScanLink = ({ children, address, className }) => {
  const { network } = useNetworkInfo();
  const subdomain = network === 'main' ? '' : `testnet.`;
  return (
    <FtmScanLinkContainer
      target="_blank"
      rel="noopener"
      href={`https://${subdomain}ftmscan.com/address/${address}`}
      className={className}
    >
      {children}
      <ExternalLinkIcon />
    </FtmScanLinkContainer>
  );
};

export default FtmScanLink;
