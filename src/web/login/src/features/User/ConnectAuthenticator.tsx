import { Header } from '@wdid/shared';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import QRCode from 'qrcode';
import { authenticatorKeyAtom } from './authenticatorKeyAtom';

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

export const ConnectAuthenticator = () => {
  const authenticatorKey = useRecoilValue(authenticatorKeyAtom);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (authenticatorKey.result?.key) {
      QRCode.toDataURL(authenticatorKey.result?.key, {
        color: {
          dark: '#000',
          light: '#f2f2f2',
        }
      })
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [authenticatorKey]);

  return (
    <Wrapper>
      <Header size="H3">Connect Authenticator App</Header>
      <Content>
        <p>
          Scan the QR code below with your authenticator app to connect it to
          your account.
        </p>
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width="300" height="300" />}
        <p>
          If you can't scan the QR code, you can manually enter the code into
          your authenticator app.
        </p>
        <p>
          <strong>Manual Code:</strong> {authenticatorKey.result?.key}
        </p>
      </Content>
    </Wrapper>
  );
};
