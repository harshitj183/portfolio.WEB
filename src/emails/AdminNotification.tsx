import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AdminNotificationProps {
  name: string;
  email: string;
  message: string;
}

export const AdminNotification = ({
  name,
  email,
  message,
}: AdminNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Portfolio Message from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Message 🚀</Heading>
          <Text style={text}>
            You have received a new contact form submission on your portfolio.
          </Text>
          
          <Section style={detailsContainer}>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
            
            <Text style={label}>Email</Text>
            <Text style={value}>
              <a href={`mailto:${email}`} style={link}>{email}</a>
            </Text>
            
            <Text style={label}>Message</Text>
            <Text style={messageValue}>{message}</Text>
          </Section>
          
          <Hr style={hr} />
          <Text style={footer}>
            Sent securely via Resend from your Next.js Portfolio.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNotification;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f0f0f0',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
};

const detailsContainer = {
  padding: '24px 48px',
  backgroundColor: '#fafafa',
  borderTop: '1px solid #eaeaea',
  borderBottom: '1px solid #eaeaea',
  margin: '20px 0',
};

const label = {
  color: '#888',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0 0 4px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 16px',
};

const messageValue = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};
