import { Button, Header, TextInput, isEmail, useAsyncError } from '@wdid/shared';
import useUser from '../Auth/currentUserSelector';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { UserService } from './UserService';

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
const Submit = styled(Button)`
  margin-left: auto;
`;

export function Edit() {
  const throwError = useAsyncError();
  const user = useRecoilValue(useUser);
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
