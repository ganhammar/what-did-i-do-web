import { Button, Header } from '@wdid/shared';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import QRCode from 'qrcode';
import { authenticatorKeyAtom } from './authenticatorKeyAtom';
import { Link, useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  margin: ${({ theme }) => `${theme.spacing.xl} 0`};
`;
const Content = styled.form`
  background-color: ${({ theme }) => theme.palette.paper.main};
  color: ${({ theme }) => theme.palette.paper.contrastText};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.m};
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.m} 0 0 0;
`;
const ManualCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.m} 0;
`;
const Code = styled.span`
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.palette.divider.main};
  font-size: 0.8rem;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;
const Copy = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: underline;
  font-size: 0.8rem;
  &:hover {
    text-decoration: none;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export const ConnectAuthenticator = () => {
  const navigate = useNavigate();
  const authenticatorKey = useRecoilValue(authenticatorKeyAtom);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (authenticatorKey.result?.key) {
      QRCode.toDataURL(authenticatorKey.result?.key, {
        color: {
          dark: '#000',
          light: '#f2f2f2',
        },
        margin: 1,
        width: 250,
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authenticatorKey]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(authenticatorKey.result?.key ?? '');
  };

  return (
    <Wrapper>
      <Header size="H3">Connect Authenticator App</Header>
      <Content>
        <p>
          Scan the QR code below with your authenticator app to connect it to
          your account.
        </p>
        {qrCodeUrl && (
          <ImageWrapper>
            <img src={qrCodeUrl} alt="QR Code" width="250" height="250" />
          </ImageWrapper>
        )}
        <ManualCodeWrapper>
          <Code>{authenticatorKey.result?.key}</Code>
          <Copy onClick={copyCodeToClipboard}>Copy Code</Copy>
        </ManualCodeWrapper>
        <ButtonWrapper>
          <Link to="/login/user">Back</Link>
          <Button
            onClick={() => {
              navigate('/login/user');
            }}
            color="success"
          >
            Done
          </Button>
        </ButtonWrapper>
      </Content>
    </Wrapper>
  );
};
