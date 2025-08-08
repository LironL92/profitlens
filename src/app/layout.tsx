import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/browser.png" type="image/png" />
        <link rel="apple-touch-icon" href="/iPhone.png" />
        <link rel="icon" href="/Android.png" type="image/png" sizes="192x192" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

