import '../src/index.css';
import Script from 'next/script';

export const viewport = {
  themeColor: '#415B06',
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata = {
  title: 'Ameya Ramteke | AI & Data Science Engineer – Portfolio',
  description: 'Ameya Ramteke - AI & Data Science Engineer specializing in machine learning, deep learning, and innovative data-driven solutions. Explore my portfolio of projects and expertise.',
  keywords: 'Ameya Ramteke, AI Engineer, Data Science, Machine Learning, Deep Learning, Python, Portfolio, Artificial Intelligence, Data Analysis',
  authors: [{ name: 'Ameya Ramteke' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://ameyajarvis.qzz.io',
  },
  openGraph: {
    type: 'website',
    url: 'https://ameyajarvis.qzz.io',
    title: 'Ameya Ramteke | AI & DS Engineer',
    description: 'AI & Data Science Engineer specializing in machine learning, deep learning, and innovative data-driven solutions.',
    siteName: 'Ameya Ramteke Portfolio',
    locale: 'en_US',
    images: [
      {
        url: 'https://ameyajarvis.qzz.io/Assets/image.webp',
        width: 1200,
        height: 630,
        alt: 'Ameya Ramteke - AI & Data Science Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://ameyajarvis.qzz.io',
    title: 'Ameya Ramteke | AI & DS Engineer',
    description: 'AI & Data Science Engineer specializing in machine learning, deep learning, and innovative data-driven solutions.',
    images: ['https://ameyajarvis.qzz.io/Assets/image.webp'],
    creator: '@ameyaramteke',
    site: '@ameyaramteke',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ameya Ramteke",
  "jobTitle": "AI & Data Science Engineer",
  "url": "https://ameyajarvis.qzz.io",
  "sameAs": [
    "https://github.com/ameya-jarvis-07",
    "https://linkedin.com/in/ameya-ramteke"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Python Programming",
    "Neural Networks",
    "Natural Language Processing",
    "Computer Vision",
    "Data Analysis"
  ],
  "description": "AI & Data Science Engineer specializing in machine learning, deep learning, and innovative data-driven solutions.",
  "image": "https://ameyajarvis.qzz.io/Assets/image.webp"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Intercept third-party extension errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(event) {
                if (
                  event.message && (
                    event.message.includes('addListener') ||
                    event.message.includes('chrome-extension') ||
                    event.message.includes('extension')
                  )
                ) {
                  event.stopImmediatePropagation();
                }
              }, true);
            `
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EG5JXK7QN2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EG5JXK7QN2');
          `}
        </Script>

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/Assets/header.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
