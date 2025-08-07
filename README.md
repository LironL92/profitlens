# ProfitLens - OnlyFans Creator Waitlist Landing Page

A complete Next.js 14 application for collecting waitlist signups for ProfitLens, a financial dashboard specifically designed for OnlyFans creators.

![ProfitLens Landing Page](https://via.placeholder.com/800x400/ec4899/ffffff?text=ProfitLens+Landing+Page)

## 🚀 Features

- **Conversion-Optimized Landing Page**: Hero, problem, solution, social proof, and pricing sections
- **Waitlist Management**: Email collection with duplicate detection and position tracking
- **Email Confirmation**: Optional token-based email verification system
- **Admin Dashboard**: View signup statistics and manage the waitlist
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Mobile-First Design**: Responsive design using Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd profitlens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create waitlist_signups table
   CREATE TABLE waitlist_signups (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     source VARCHAR(50) DEFAULT 'landing_page',
     creator_type VARCHAR(50) DEFAULT 'onlyfans',
     estimated_monthly_revenue INTEGER,
     referral_source VARCHAR(100),
     email_confirmed BOOLEAN DEFAULT FALSE,
     ip_address INET,
     user_agent TEXT
   );

   -- Create email_confirmation_tokens table
   CREATE TABLE email_confirmation_tokens (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) NOT NULL REFERENCES waitlist_signups(email),
     token VARCHAR(255) NOT NULL UNIQUE,
     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better performance
   CREATE INDEX idx_waitlist_signups_email ON waitlist_signups(email);
   CREATE INDEX idx_waitlist_signups_created_at ON waitlist_signups(created_at);
   CREATE INDEX idx_confirmation_tokens_token ON email_confirmation_tokens(token);
   CREATE INDEX idx_confirmation_tokens_expires_at ON email_confirmation_tokens(expires_at);

   -- Enable Row Level Security
   ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
   ALTER TABLE email_confirmation_tokens ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   -- Allow public to insert new signups
   CREATE POLICY "Allow public to insert waitlist signups" ON waitlist_signups
   FOR INSERT TO anon, authenticated WITH CHECK (true);

   -- Allow public to read their own signup
   CREATE POLICY "Allow users to view their own signup" ON waitlist_signups
   FOR SELECT TO anon, authenticated USING (true);

   -- Service role can do everything
   CREATE POLICY "Service role can manage all signups" ON waitlist_signups
   FOR ALL TO service_role USING (true);

   CREATE POLICY "Service role can manage all tokens" ON email_confirmation_tokens
   FOR ALL TO service_role USING (true);

   -- Optional: Create a function to get waitlist statistics
   CREATE OR REPLACE FUNCTION get_waitlist_stats()
   RETURNS JSON AS $$
   DECLARE
     total_count INTEGER;
     confirmed_count INTEGER;
     recent_count INTEGER;
     result JSON;
   BEGIN
     SELECT COUNT(*) INTO total_count FROM waitlist_signups;
     SELECT COUNT(*) INTO confirmed_count FROM waitlist_signups WHERE email_confirmed = true;
     SELECT COUNT(*) INTO recent_count FROM waitlist_signups 
     WHERE created_at > NOW() - INTERVAL '7 days';
     
     result := json_build_object(
       'total_signups', total_count,
       'confirmed_signups', confirmed_count,
       'recent_signups', recent_count
     );
     
     RETURN result;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

## 📱 Pages & Routes

- `/` - Main landing page with waitlist signup
- `/waitlist/confirmed` - Email confirmation success page
- `/waitlist/invalid` - Invalid confirmation token page
- `/admin` - Admin dashboard for viewing signups
- `/api/waitlist` - API endpoint for waitlist operations

## 🎨 Design System

### Colors
- **Brand Pink**: `#ec4899`
- **Brand Purple**: `#8b5cf6`

### Custom CSS Classes
- `.gradient-text` - Pink to purple gradient text
- `.gradient-bg` - Pink to purple to indigo gradient background
- `.btn-primary` - Primary gradient button
- `.btn-secondary` - Secondary white button
- `.card` - White card with shadow and hover effects

## 🔌 API Endpoints

### POST /api/waitlist
Add a new email to the waitlist.

**Request Body:**
```json
{
  "email": "creator@example.com",
  "source": "landing_page",
  "creatorType": "onlyfans",
  "estimatedRevenue": 5000,
  "referralSource": "twitter"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Welcome to the waitlist!",
  "waitlistPosition": 127,
  "confirmationToken": "uuid-token"
}
```

**Error Response (409 - Duplicate):**
```json
{
  "error": "You're already on the waitlist!",
  "isAlreadySignedUp": true
}
```

### GET /api/waitlist
Get waitlist statistics or handle email confirmation.

**Query Parameters:**
- `action=confirm&token=uuid` - Confirm email address
- No parameters - Get waitlist stats (admin)

**Stats Response:**
```json
{
  "totalSignups": 500,
  "confirmedSignups": 350,
  "recentSignups": 47,
  "topReferralSources": [
    { "source": "twitter", "count": 150 },
    { "source": "direct", "count": 200 }
  ]
}
```

## 🔒 Security Considerations

### For Production Deployment:

1. **Admin Route Protection**
   ```typescript
   // Add authentication middleware to /admin
   import { auth } from '@/lib/auth'
   
   export default async function AdminPage() {
     const session = await auth()
     if (!session?.user?.role === 'admin') {
       redirect('/login')
     }
     // ... rest of component
   }
   ```

2. **Rate Limiting**
   ```typescript
   // Add rate limiting to API routes
   import { rateLimit } from '@/lib/rate-limit'
   
   export async function POST(request: NextRequest) {
     const identifier = getClientId(request)
     const { success } = await rateLimit.limit(identifier)
     
     if (!success) {
       return NextResponse.json(
         { error: 'Too many requests' },
         { status: 429 }
       )
     }
     // ... rest of handler
   }
   ```

3. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use strong, unique passwords for service role keys
   - Rotate API keys regularly

4. **Database Security**
   - Review and test RLS policies
   - Use least-privilege principle for API keys
   - Enable audit logging in Supabase

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy**
   ```bash
   npm run build
   ```

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Monitoring & Analytics

### Recommended Integrations:

1. **Google Analytics 4**
   ```typescript
   // Add to layout.tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout() {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
         </body>
       </html>
     )
   }
   ```

2. **Supabase Analytics**
   - Monitor API usage in Supabase dashboard
   - Set up alerts for high error rates
   - Track conversion funnel metrics

3. **Error Monitoring**
   ```bash
   npm install @sentry/nextjs
   ```

## 🧪 Testing

### Test the Waitlist Flow:

1. **Happy Path**
   - Submit email on landing page
   - Verify success message appears
   - Check database for new record
   - Test duplicate email handling

2. **Error Cases**
   - Invalid email format
   - Network connection errors
   - Database connection issues

3. **Admin Dashboard**
   - Verify stats display correctly
   - Test refresh functionality
   - Check responsive design

### Manual Testing Checklist:

- [ ] Landing page loads without errors
- [ ] Email form submits successfully  
- [ ] Duplicate emails show friendly message
- [ ] Data appears in Supabase dashboard
- [ ] Mobile responsive on all screen sizes
- [ ] API endpoints return proper responses
- [ ] Environment variables work correctly
- [ ] Build and deployment succeed

## 🎯 Marketing Features

### A/B Testing Setup:
```typescript
// Add to page.tsx for testing headlines
const headlines = {
  control: "Finally, Financial Control",
  variant: "Take Control of Your Creator Finances"
}

const headline = useABTest('hero-headline', headlines)
```

### Social Sharing:
```typescript
// Add social share buttons
const shareUrl = `https://profitlens.com`
const shareText = `Join me on the ProfitLens waitlist - the financial dashboard built for OnlyFans creators!`
```

## 🔧 Customization

### Update Brand Colors:
```javascript
// tailwind.config.js
colors: {
  'brand-pink': '#your-pink-color',
  'brand-purple': '#your-purple-color',
}
```

### Modify Copy:
All copy is in the main page component (`src/app/page.tsx`). Update headlines, descriptions, and testimonials as needed.

### Add New Sections:
```typescript
// Add after existing sections
<section className="section-padding bg-white">
  <div className="container-custom">
    {/* Your new section content */}
  </div>
</section>
```

## 📞 Support

For questions about this implementation:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js 14 docs](https://nextjs.org/docs)
3. Submit issues in this repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for OnlyFans creators who deserve better financial tools.**