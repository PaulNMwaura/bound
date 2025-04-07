import Head from 'next/head';

export default function SEO({ title, keywords, description, url, type}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      <meta name="keywords" content= {keywords}/>
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* <meta property="og:image" content={image} /> */}
      <meta property="og:type" content={type || "website"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={image} /> */}
    </Head>
  );
}