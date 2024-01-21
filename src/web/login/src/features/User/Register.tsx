import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Header, TextInput, isEmail, useAsyncError } from '@wdid/shared';
import { UserService } from './';
import { Link } from 'react-router-dom';

const MIN_PASSWORD_LENGTH = 8;
const RETURN_URL = '/account/dashboard';

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

export function Register() {
  const throwError = useAsyncError();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const userService = new UserService();
  const submit = async () => {
    try {
      setIsLoading(true);

      await userService.register({
        email,
        password,
        returnUrl: `${window.location.origin}${RETURN_URL}`,
      });

      setIsLoading(false);

      window.location.href = RETURN_URL;
    } catch (error) {
      throwError(error);
    }
  };

  return (
    <Wrapper>
      <Header size="H3">Register Account</Header>
      <Form>
        <TextInput
          title="Email"
          type="text"
          value={email}
          onChange={setEmail}
          hasError={Boolean(email) && !isEmail(email)}
          errorTip="Must be a valid email address"
        />
        <TextInput
          title="Password"
          type="password"
          value={password}
          onChange={setPassword}
          hasError={Boolean(password) && password.length < MIN_PASSWORD_LENGTH}
          errorTip="At least eight characters"
        />
        <ButtonWrapper>
          <Link to="/login">Back to Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={
              !isEmail(email) || password.length < MIN_PASSWORD_LENGTH
            }
            isLoading={isLoading}
            isAsync
          >
            Register
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
}
