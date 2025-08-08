import { Html, Head, Preview, Body, Container, Text, Section } from '@react-email/components';

export default function AdminNotification({ email, stats }) {
  return (
    <Html>
      <Head />
      <Preview>New ProfitLens waitlist signup!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>🎉 New Waitlist Signup!</Text>
          
          <Section style={box}>
            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>
            
            <Text style={label}>Total Signups:</Text>
            <Text style={value}>{stats?.total || 'N/A'}</Text>
            
            <Text style={label}>Today's Signups:</Text>
            <Text style={value}>{stats?.today || 'N/A'}</Text>
          </Section>
          
          <Text style={footer}>
            View all signups in your Supabase dashboard
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  marginBottom: '64px',
  borderRadius: '5px',
  maxWidth: '480px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '20px 0',
};

const box = {
  padding: '20px',
  backgroundColor: '#f4f4f5',
  borderRadius: '5px',
};

const label = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#666',
  marginBottom: '4px',
};

const value = {
  fontSize: '16px',
  color: '#333',
  marginBottom: '16px',
};

const footer = {
  fontSize: '12px',
  color: '#666',
  textAlign: 'center',
  marginTop: '20px',
};
