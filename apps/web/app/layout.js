import './globals.css'

export const metadata = {
  title: 'FuelUp Education - Autonomous AI-Powered Learning platform',
  description: 'Scale subject video delivery, onboarding, and quizzes with autonomous agent execution.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
