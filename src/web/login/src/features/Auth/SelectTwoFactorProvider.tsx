import { Button, Header, useAsyncError } from '@wdid/shared';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { twoFactorProvidersAtom } from './twoFactorProvidersAtom';
import { Link, useNavigate } from 'react-router-dom';
import { UserService } from '../User';

const VERIFY_URL = '/login/verify-code';

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
const SubHeader = styled.p`
  border-bottom: 2px solid ${({ theme }) => theme.palette.background.main};
  margin: 0 ${({ theme }) => `-${theme.spacing.m}`};
  padding: ${({ theme }) =>
    `0 ${theme.spacing.m} ${theme.spacing.m} ${theme.spacing.m}`};
`;
const Provider = styled.div`
  margin: 0 ${({ theme }) => `-${theme.spacing.m}`};
  & input[type='radio'] {
    display: none;
    &:checked + label {
      background-color: ${({ theme }) => theme.palette.paperHighlight.main};
      color: ${({ theme }) => theme.palette.paperHighlight.contrastText};
    }
  }
  & label {
    padding: ${({ theme }) => theme.spacing.m};
    border-bottom: 2px solid ${({ theme }) => theme.palette.background.main};
    display: block;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.palette.paperHighlight.main};
      color: ${({ theme }) => theme.palette.paperHighlight.contrastText};
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export const SelectTwoFactorProvider = () => {
  const throwError = useAsyncError();
  const navigate = useNavigate();
  const providers = useRecoilValue(twoFactorProvidersAtom);
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const userService = useMemo(() => new UserService(), []);

  const submit = async () => {
    try {
      setIsLoading(true);

      const response = await userService.sendCode({
        provider: selectedProvider,
      });

      if (response.success) {
        const params = new URLSearchParams(window.location.search);
        const rememberMe = params.get('rememberMe');
        const returnUrl = params.get('returnUrl');

        navigate(
          `${VERIFY_URL}?rememberMe=${rememberMe}&provider=${selectedProvider}&returnUrl=${returnUrl}`
        );
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
      <Header size="H3">Multi-Factor Authentication</Header>
      <Form>
        <SubHeader>How do you want to verify your login?</SubHeader>
        {providers.result?.map((provider) => (
          <Provider key={provider}>
            <input
              type="radio"
              id={provider}
              name="twoFactorProvider"
              value={provider}
              checked={selectedProvider === provider}
              onChange={() => setSelectedProvider(provider)}
            />
            <label htmlFor={provider}>{provider}</label>
          </Provider>
        ))}
        <ButtonWrapper>
          <Link to="/login">Login</Link>
          <Button
            color="success"
            onClick={submit}
            isDisabled={!Boolean(selectedProvider)}
            isLoading={isLoading}
            isAsync
          >
            Choose
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
