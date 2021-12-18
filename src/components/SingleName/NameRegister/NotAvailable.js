import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled/macro';

const NotAvailableContainer = styled('div')`
  padding: 30px 40px;
`;

const Message = styled('div')`
  background: rgba(255, 255, 255, 0.05);
  color: ${p => p.theme.colors.grayColor};
  font-size: 20px;
  padding: 20px;
  font-weight: 300;
`;

export default function NotAvailable({ domain }) {
  const { t } = useTranslation();

  return (
    <NotAvailableContainer>
      <Message>{t('singleName.messages.alreadyregistered')}</Message>
    </NotAvailableContainer>
  );
}
