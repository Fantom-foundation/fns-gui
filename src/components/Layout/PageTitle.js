import styled from '@emotion/styled/macro';

const PageTitle = styled.h1`
  font-family: Overpass;
  font-style: normal;
  font-weight: 800;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -1px;

  color: ${p => p.theme.colors.textColor};
  margin: 24px 28px;
`;

export default PageTitle;
