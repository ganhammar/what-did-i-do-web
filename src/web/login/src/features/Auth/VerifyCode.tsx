import { Button, Header, TextInput, useAsyncError } from '@wdid/shared';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { UserService } from '../User';
import useUser from './currentUserSelector';
import { toast } from 'react-toastify';

const CODE_LENGTH = 6;

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
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userService = useMemo(() => new UserService(), []);

  useEffect(() => {
    setIsValid(code.length === CODE_LENGTH && /^\d+$/.test(code));
  }, [code]);

  const submit = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams(window.location.search);
      const rememberMe = params.get('rememberMe') === 'true';
      const provider = params.get('provider') ?? '';
      const returnUrl = params.get('returnUrl');

      const response = await userService.verifyCode({
        code,
        rememberMe,
        rememberBrowser: rememberMe,
        provider,
      });

      if (response.success && response.result?.succeeded) {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          refresh();
        }
      } else {
        toast.error('Invalid code');
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
          hasError={Boolean(code) && !isValid}
          errorTip="Code must be 6 digits"
        />
        <ButtonWrapper>
          <Link to="/login">Back to Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={!isValid}
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
