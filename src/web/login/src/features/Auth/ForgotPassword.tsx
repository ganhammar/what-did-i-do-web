import {
  Button,
  Header,
  TextInput,
  isEmail,
  useAsyncError,
} from '@wdid/shared';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserService } from '../User';

const RESET_URL = '/login/reset-password';
const SENT_URL = '/login/forgot-password/sent';

const Wrapper = styled.div`
  margin: ${({ theme }) => `${theme.spacing.xl} 0`};
`;
const Form = styled.form`
  background-color: ${({ theme }) => theme.palette.paper.main};
  color: ${({ theme }) => theme.palette.paper.contrastText};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.m};
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export const ForgotPassword = () => {
  const throwError = useAsyncError();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userService = useMemo(() => new UserService(), []);

  const submit = async () => {
    try {
      setIsLoading(true);

      const response = await userService.forgotPassword({
        email,
        resetUrl: `${window.location.origin}${RESET_URL}`,
      });

      if (response.success) {
        navigate(SENT_URL);
      } else {
        console.log(response);
      }

      setIsLoading(false);
    } catch (error) {
      throwError(error);
    }
  };

  return (
    <Wrapper>
      <Header size="H3">Forgot Password?</Header>
      <Form>
        <TextInput
          title="Email"
          type="text"
          value={email}
          onChange={setEmail}
          hasError={Boolean(email) && !isEmail(email)}
          errorTip="Must be a valid email address"
        />
        <ButtonWrapper>
          <Link to="/login">Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={!isEmail(email)}
            isLoading={isLoading}
            isAsync
          >
            Send Link
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
