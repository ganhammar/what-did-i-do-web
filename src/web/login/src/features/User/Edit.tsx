import {
  Button,
  Header,
  TextInput,
  isEmail,
  useAsyncError,
} from '@wdid/shared';
import { currentUserSelector } from '../Auth/currentUserSelector';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { UserService } from './UserService';
import { Link } from 'react-router-dom';
import { twoFactorProvidersAtom } from '../Auth/twoFactorProvidersAtom';

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
const AuthenticatorWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 ${({ theme }) => theme.spacing.xs} 1.8rem
    ${({ theme }) => theme.spacing.xs};
`;
const Status = styled.span<{ connected: boolean }>`
  border-radius: 14px;
  border: 1px solid
    ${({ theme, connected }) =>
      connected ? theme.palette.success.main : theme.palette.warning.main};
  color: ${({ theme, connected }) =>
    connected ? theme.palette.success.main : theme.palette.warning.main};
  font-size: 0.8rem;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;
const Connect = styled(Link)`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`;
const Submit = styled(Button)`
  margin-left: auto;
`;

export function Edit() {
  const throwError = useAsyncError();
  const providers = useRecoilValue(twoFactorProvidersAtom);
  const user = useRecoilValue(currentUserSelector);
  const [email, setEmail] = React.useState<string>(user.email);
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const userService = new UserService();
  const submit = async () => {
    try {
      setIsLoading(true);

      await userService.edit({
        email,
        password,
      });

      setIsLoading(false);
    } catch (error) {
      throwError(error);
    }
  };

  return (
    <Wrapper>
      <Header size="H3">Profile</Header>
      <Form>
        <TextInput
          title="Change Email"
          type="text"
          value={email}
          onChange={setEmail}
          hasError={!isEmail(email)}
          errorTip="Must be a valid email address"
        />
        <TextInput
          title="Change Password"
          type="password"
          value={password}
          onChange={setPassword}
          hasError={Boolean(password) && password.length < MIN_PASSWORD_LENGTH}
          errorTip="At least eight characters"
        />
        <AuthenticatorWrapper>
          <span>Authenticator App</span>
          <Status
            connected={providers.result?.includes('Authenticator') ?? false}
          >
            {providers.result?.includes('Authenticator')
              ? 'Configured'
              : 'Not Configured'}
          </Status>
          <Connect to="/login/user/connect-authenticator-app">
            {providers.result?.includes('Authenticator')
              ? 'Change'
              : 'Configure'}
          </Connect>
        </AuthenticatorWrapper>
        <Submit
          color="success"
          onClick={submit}
          isDisabled={!isEmail(email)}
          isLoading={isLoading}
          isAsync
        >
          Edit
        </Submit>
      </Form>
    </Wrapper>
  );
}
