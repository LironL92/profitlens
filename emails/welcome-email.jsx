import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function WelcomeEmail({ email = 'creator@example.com' }) {
  return (
    <Html>
      <Head />
      <Preview>You're in! Welcome to ProfitLens - Financial tools built for creators like you 💰</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Img
              src="https://profitlens.co/logo.png"
              width="150"
              height="50"
              alt="ProfitLens"
              style={logo}
            />
          </Section>

          {/* Header */}
          <Heading style={h1}>You're on the list! 🎉</Heading>
          
          <Text style={text}>
            Hey there!
          </Text>

          <Text style={text}>
            Thanks for joining the ProfitLens waitlist. You're now part of an exclusive group of 
            creators who are done with spreadsheet chaos and ready for financial tools that actually 
            understand the business.
          </Text>

          {/* What to Expect Section */}
          <Section style={boxSection}>
            <Text style={sectionHeader}>Here's what's coming:</Text>
            <Text style={bulletPoint}>
              ✓ <strong>Real profit tracking</strong> - See what you actually keep after the 20% cut
            </Text>
            <Text style={bulletPoint}>
              ✓ <strong>Multi-platform income</strong> - OF + Fansly + cam sites, all in one place
            </Text>
            <Text style={bulletPoint}>
              ✓ <strong>Tax estimation</strong> - No more quarterly payment surprises
            </Text>
            <Text style={bulletPoint}>
              ✓ <strong>Business expense tracking</strong> - Yes, your ring light is deductible
            </Text>
          </Section>

          {/* Special Offer */}
          <Section style={offerSection}>
            <Text style={offerText}>
              🎁 <strong>Early Bird Special:</strong> As one of our first 100 signups, 
              you'll get <strong>3 months free</strong> when we launch!
            </Text>
          </Section>

          {/* What's Next */}
          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>
          <Text style={text}>
            We're launching in Q1 2025. You'll be the first to know when doors open. 
            In the meantime, we'll send you occasional tips on managing your creator finances 
            (no spam, promise).
          </Text>

          {/* CTA */}
          <Section style={buttonContainer}>
            <Button
              style={button}
              href="https://profitlens.co"
            >
              Visit ProfitLens
            </Button>
          </Section>

          {/* Social Proof */}
          <Text style={socialProof}>
            Join 500+ creators already on the waitlist
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Built by creators who actually get it 💜
          </Text>
          <Text style={footer}>
            © 2025 ProfitLens. All rights reserved.
            <br />
            <Link href="https://profitlens.co/unsubscribe?email=${email}" style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 20px 48px',
  maxWidth: '560px',
};

const logoContainer = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const sectionHeader = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '16px',
};

const bulletPoint = {
  color: '#555',
  fontSize: '15px',
  lineHeight: '24px',
  marginLeft: '10px',
  marginBottom: '8px',
};

const boxSection = {
  background: '#f4f4f5',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '28px',
  marginBottom: '28px',
};

const offerSection = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '28px',
  marginBottom: '28px',
};

const offerText = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center',
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#ff69b4',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 28px',
};

const socialProof = {
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '32px',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '42px 0 26px',
};

const footer = {
  color: '#666',
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '12px',
};

const link = {
  color: '#666',
  textDecoration: 'underline',
};
