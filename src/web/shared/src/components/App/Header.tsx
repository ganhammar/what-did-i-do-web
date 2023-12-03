import React from 'react';
import { Fragment, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Modal } from '../Modal';

const Wrapper = styled.header`
  text-align: center;
  position: relative;
`;
const Title = styled.h1`
  font-family: Pacifico;
  margin: 30px 0;
  @media (max-width: 760px) {
    font-size: 3rem;
    margin: 40px 0;
  }
  @media (max-width: 640px) {
    font-size: 2.5rem;
    margin: 50px 0;
  }
  @media (max-width: 480px) {
    font-size: 2rem;
    margin: 60px 0;
  }
`;
const NavWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  box-shadow: ${({ theme }) => theme.shadows[1]};
  &:hover {
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3) inset;
    opacity: 0.8;
    cursor: pointer;
  }
`;
const NavState = styled.div`
  width: 20px;
  height: 3px;
  border-radius: 1.5px;
  background-color: ${({ theme }) => theme.palette.background.main};
  position: relative;
  top: 19px;
  left: 10px;
  &:before,
  &:after {
    display: block;
    content: '';
    width: 20px;
    height: 3px;
    border-radius: 1.5px;
    background-color: ${({ theme }) => theme.palette.background.main};
    position: relative;
    top: -11px;
  }
  &:before {
    top: 8px;
  }
`;
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const LinkStyle = css`
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.m} 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider.main};
  color: ${({ theme }) => theme.palette.background.contrastText};
  &:hover,
  &.active {
    background-color: ${({ theme }) => theme.palette.background.main};
    color: ${({ theme }) => theme.palette.background.contrastText};
  }
  &:last-child {
    border-bottom: none;
  }
`;
const StyledNavLink = styled(NavLink)`
  ${LinkStyle}
`;
const StyledALink = styled.a`
  ${LinkStyle}
`;

interface Props {
  links: { to: string; title: string; serverSide: boolean }[];
  isLoggedIn: boolean;
}

export function Header({ links, isLoggedIn }: Props) {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggle = () => setNavIsOpen(!navIsOpen);

  return (
    <Wrapper>
      <NavWrapper onClick={toggle}>
        <NavState />
      </NavWrapper>
      <Title>What Did I Do?</Title>
      <Modal isOpen={navIsOpen} onClose={toggle} noPadding>
        <Nav>
          {links.map(({ to, title, serverSide }) => (
            <Fragment key={to}>
              {serverSide && (
                <StyledALink
                  href={to}
                  className={pathname.startsWith(to) ? 'active' : ''}
                >
                  {title}
                </StyledALink>
              )}
              {!serverSide && (
                <StyledNavLink
                  className={(isActive) => (isActive ? 'active' : '')}
                  to={to}
                >
                  {title}
                </StyledNavLink>
              )}
            </Fragment>
          ))}
          {!isLoggedIn && (
            <StyledALink
              href="/login"
              className={pathname === '/login' ? 'active' : ''}
            >
              Login
            </StyledALink>
          )}
          {isLoggedIn && <StyledALink href="/login/logout">Logout</StyledALink>}
        </Nav>
      </Modal>
    </Wrapper>
  );
}
