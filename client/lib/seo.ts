import type { Metadata } from "next";
import { config } from "@/config";

export const generateSEOMetadata = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}): Metadata => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : `https://${config.domainName}/`;

  return {
    title: title || config.name,
    description: description || config.appDescription,
    keywords: keywords || [config.name],
    applicationName: config.name,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: (openGraph?.title || config.name) as string,
      description: openGraph?.description || config.appDescription,
      url: (openGraph?.url || baseUrl) as string,
      siteName: (openGraph?.title || config.name) as string,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: openGraph?.title || config.name,
      description: openGraph?.description || config.appDescription,
      card: "summary_large_image",
      creator: "@yourtwitterhandle",
    },
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),
    ...extraTags,
  };
};

export const generateStructuredData = () => {
  return {
    "@context": "http://schema.org",
    "@type": "SoftwareApplication",
    name: config.name,
    description: config.appDescription,
    image: `https://${config.domainName}/icon.png`,
    url: `https://${config.domainName}/`,
    author: {
      "@type": "Person",
      name: "Your Name",
    },
    datePublished: "2023-08-01",
    applicationCategory: "BusinessApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "11",
    },
    offers: [
      {
        "@type": "Offer",
        price: "9.00",
        priceCurrency: "USD",
      },
    ],
  };
};
