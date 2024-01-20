import { Button, Header, useAsyncError } from '@wdid/shared';
import React, { useEffect, useMemo } from 'react';
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
const Provider = styled.div<{ selected: boolean }>`
  margin: 0 ${({ theme }) => `-${theme.spacing.m}`};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.m};
  border-bottom: 2px solid ${({ theme }) => theme.palette.background.main};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  ${({ selected, theme }) =>
    selected &&
    `
    background-color: ${theme.palette.paperHighlight.main};
    color: ${theme.palette.paperHighlight.contrastText};
  `}
  & input[type='radio'] {
    display: none;
  }
  &:before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 100%;
    display: block;
    border: 4px solid ${({ theme }) => theme.palette.divider.main};
    background-color: ${({ theme }) => theme.palette.divider.main};
    margin-right: ${({ theme }) => theme.spacing.m};
    transition:
      box-shadow 0.2s ease-in-out,
      background-color 0.2s ease-in-out;
    ${({ selected, theme }) =>
      selected &&
      `
      background-color: ${theme.palette.paperHighlight.main};
      box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
    `}
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

  useEffect(() => {
    if (selectedProvider === '' && (providers.result?.length ?? 0) > 0) {
      setSelectedProvider(providers.result![0]);
    }
  }, [providers, selectedProvider]);

  const submit = async () => {
    try {
      setIsLoading(true);
      let success = true;

      if (selectedProvider === 'Email') {
        const response = await userService.sendCode({
          provider: selectedProvider,
        });
        success = response.success;

        if (!success) {
          console.log(response);
        }
      }

      if (success) {
        const params = new URLSearchParams(window.location.search);
        const rememberMe = params.get('rememberMe');
        const returnUrl = params.get('returnUrl');

        navigate(
          `${VERIFY_URL}?rememberMe=${rememberMe}&provider=${selectedProvider}&returnUrl=${returnUrl}`
        );
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
          <Provider
            key={provider}
            selected={selectedProvider === provider}
            onClick={() => setSelectedProvider(provider)}
          >
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
          <Link to="/login">Back to Login</Link>
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
