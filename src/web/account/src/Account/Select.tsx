import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { accountsSelector, currentAccountAtom } from '.';
import { Header } from '@wdid/shared';

const Wrapper = styled.div`
  margin: ${({ theme }) => `${theme.spacing.xl} 0`};
`;
const List = styled.div`
  background-color: ${({ theme }) => theme.palette.paper.main};
  color: ${({ theme }) => theme.palette.paper.contrastText};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.m};
`;
const SubHeader = styled.p`
  margin: ${({ theme }) => `0 0 ${theme.spacing.m} 0`};
`;
const Item = styled.div`
  line-height: 3rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider.main};
  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
    margin-bottom: -1px;
  }
`;

export function Select() {
  const navigate = useNavigate();
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountAtom);
  const accounts = useRecoilValue(accountsSelector);

  useEffect(() => {
    if (currentAccount) {
      navigate('/account/dashboard');
    } else if (accounts.result?.length === 0) {
      navigate('/account/create');
    } else if (accounts.result?.length === 1) {
      setCurrentAccount(accounts.result[0]);
    }
  }, [accounts, currentAccount, setCurrentAccount, navigate]);

  const selectAccount = (account: Account) => {
    setCurrentAccount(account);
    navigate('/account/dashboard');
  };

  return (
    <Wrapper>
      <Header size="H3">Select Account</Header>
      <List>
        <SubHeader>
          Seems like you have access to more than one account, which account do
          you want to use?
        </SubHeader>
        {accounts.result?.map((account) => (
          <Item onClick={() => selectAccount(account)} key={account.id}>
            {account.name}
          </Item>
        ))}
      </List>
    </Wrapper>
  );
}
