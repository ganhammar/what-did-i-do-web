import React from 'react';
import { Header } from '@wdid/shared';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  margin: ${({ theme }) => `${theme.spacing.xl} 0`};
`;
const Content = styled.div`
  background-color: ${({ theme }) => theme.palette.paper.main};
  color: ${({ theme }) => theme.palette.paper.contrastText};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.m};
`;
const LoginLink = styled(Link)`
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export const CheckInbox = () => {
  return (
    <Wrapper>
      <Header size="H3">Check Your Inbox</Header>
      <Content>
        <p>
          We sent you an email with a link to reset your password. If you don't
          see it, check your spam folder.
        </p>
        <LoginLink to="/login">Back to Login</LoginLink>
      </Content>
    </Wrapper>
  );
};
