import {
  Button,
  Header,
  TextInput,
  useAsyncError,
} from '@wdid/shared';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { UserService } from '../User';
import useUser from './currentUserSelector';

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

export const VerifyCode = () => {
  const throwError = useAsyncError();
  const refresh = useRecoilRefresher_UNSTABLE(useUser);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userService = useMemo(() => new UserService(), []);

  const submit = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams(window.location.search);
      const rememberMe = Boolean(params.get('rememberMe'));
      const provider = params.get('provider') ?? '';
      const returnUrl = params.get('returnUrl');

      const response = await userService.verifyCode({
        code,
        rememberMe,
        rememberBrowser: rememberMe,
        provider,
      });

      if (response.success) {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          refresh();
        }
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
      <Header size="H3">Verify Code</Header>
      <Form>
        <TextInput
          title="Code"
          type="text"
          value={code}
          onChange={setCode}
          hasError={!Boolean(code)}
          errorTip="Invalid code"
        />
        <ButtonWrapper>
          <Link to="/login">Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={!Boolean(code)}
            isLoading={isLoading}
            isAsync
          >
            Verify
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
