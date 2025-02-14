import Head from "next/head";

// Metadata Generation Function
export function generateDynamicMetadata({
  title = 'Deefault Titl',
  description = 'Default description',
  imageUrl = '/default-og-image.png',
  url = process.env.NEXT_PUBLIC_BASE_URL,
  type = 'website',
  siteName = 'Your Site Name'
}) {
  // Ensure full image URL
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ 
        url: fullImageUrl,
        width: 1200,
        height: 630,
      }],
      url,
      type,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

// React Client Component for additional metadata needs
export function DynamicMetadata({
  title,
  description,
  imageUrl,
  url,
  type,
  siteName,
  children,
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Additional children/meta tags */}
        {children}
      </Head>
    </>
  );
}