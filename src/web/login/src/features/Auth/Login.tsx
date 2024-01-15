import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  Header,
  TextInput,
  isEmail,
  useAsyncError,
} from '@wdid/shared';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../User/UserService';
import useUser from './currentUserSelector';
import { Link } from 'react-router-dom';

const SELECT_TWO_FACTOR_PROVIDER_URL = '/login/select-two-factor-provider';

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

export function Login() {
  const throwError = useAsyncError();
  const navigate = useNavigate();
  const user = useRecoilValue(useUser);
  const refresh = useRecoilRefresher_UNSTABLE(useUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get('ReturnUrl');

  const userService = useMemo(() => new UserService(), []);

  const submit = async () => {
    try {
      setIsLoading(true);

      const response = await userService.login({
        email,
        password,
        rememberMe,
      });

      if (response.success && response.result?.succeeded) {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          refresh();
        }
      } else if (response.result?.requiresTwoFactor) {
        navigate(`${SELECT_TWO_FACTOR_PROVIDER_URL}?rememberMe=${rememberMe}&returnUrl=${returnUrl}`);
      } else {
        console.log(response);
      }
    } catch (error) {
      throwError(error);
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = '/account/dashboard';
    }
  }, [user]);

  return (
    <Wrapper>
      <Header size="H3">Login</Header>
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
        />
        <Checkbox
          title="Remember me"
          onChange={() => setRememberMe(!rememberMe)}
          isChecked={rememberMe}
          position="right"
        />
        <ButtonWrapper>
          <Link to="/login/forgot-password">Forgot password?</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={!isEmail(email) || !Boolean(password)}
            isLoading={isLoading}
            isAsync
          >
            Login
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
}
