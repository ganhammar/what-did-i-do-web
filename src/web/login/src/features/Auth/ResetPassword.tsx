import { Button, Header, TextInput, useAsyncError } from '@wdid/shared';
import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserService } from '../User';

const RETURN_URL = '/login';
const MIN_PASSWORD_LENGTH = 8;

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

export const ResetPassword = () => {
  const throwError = useAsyncError();
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userService = useMemo(() => new UserService(), []);

  const submit = async () => {
    try {
      setIsLoading(true);

      const query = new URLSearchParams(location.search);
      const token = query.get('Token');
      const userId = query.get('UserId');

      if (!token || !userId) {
        throw new Error('Invalid reset link');
      }

      const response = await userService.resetPassword({
        password,
        token,
        userId,
      });

      if (response.success) {
        navigate(`${window.location.origin}${RETURN_URL}`);
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
      <Header size="H3">Reset Password</Header>
      <Form>
        <TextInput
          title="New Password"
          type="password"
          value={password}
          onChange={setPassword}
          hasError={Boolean(password) && password.length < MIN_PASSWORD_LENGTH}
          errorTip="At least eight characters"
        />
        <ButtonWrapper>
          <Link to="/login">Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={password.length < MIN_PASSWORD_LENGTH}
            isLoading={isLoading}
            isAsync
          >
            Reset
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
