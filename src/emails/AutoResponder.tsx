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

interface AutoResponderProps {
  name: string;
}

export const AutoResponder = ({ name }: AutoResponderProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for reaching out!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hi {name},</Heading>
          <Text style={text}>
            Thank you for reaching out through my portfolio! I have received your message and will get back to you as soon as possible.
          </Text>
          <Text style={text}>
            In the meantime, feel free to check out more of my projects on GitHub or connect with me on LinkedIn.
          </Text>
          
          <Section style={btnContainer}>
            <a href="https://github.com/harshitj183" style={button}>
              View GitHub Profile
            </a>
          </Section>
          
          <Hr style={hr} />
          <Text style={footer}>
            Best regards,<br/>
            Harshit
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AutoResponder;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 0 48px',
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
  lineHeight: '26px',
  padding: '0 48px',
};

const btnContainer = {
  padding: '0 48px',
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: '600',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 48px',
};
