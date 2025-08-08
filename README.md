# ProfitLens Waitlist

A modern waitlist landing page for ProfitLens, built with Next.js and Supabase.

## Features

- 🎯 **Modern Landing Page** - Beautiful, responsive design for OnlyFans creators
- 📧 **Email Collection** - Secure waitlist signup with duplicate prevention
- 📊 **Analytics Ready** - UTM tracking and referral source monitoring
- 🔒 **Secure** - Server-side validation and rate limiting
- ⚡ **Fast** - Built with Next.js 15 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Row Level Security)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Local Development

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
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Setup

The application expects a `waitlist` table in Supabase with the following structure:

```sql
CREATE TABLE waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'landing_page',
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT FALSE
);
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/waitlist/      # API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── WaitlistForm.tsx   # Email signup form
│   └── WaitlistAnalytics.tsx # Analytics display
└── lib/                   # Utilities
    ├── supabase.ts        # Supabase client
    └── analytics.ts       # Analytics helpers
```

## Customization

### Styling
- Colors and gradients are defined in `src/app/globals.css`
- Component styles use Tailwind CSS classes
- Custom animations are in the component files

### Content
- Update copy in `src/app/page.tsx`
- Modify form behavior in `src/components/WaitlistForm.tsx`
- Adjust API logic in `src/app/api/waitlist/route.ts`

## Monitoring

- **Supabase Dashboard**: Monitor signups and database performance
- **Vercel Analytics**: Track page views and performance
- **Browser Console**: Check for client-side errors

## Support

For issues or questions:
- Check the Supabase logs for database errors
- Review Vercel deployment logs for build issues
- Email support@profitlens.co for assistance

---

Built with ❤️ for OnlyFans creators