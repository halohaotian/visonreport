import { MetadataRoute } from 'next';

const DOMAIN = 'https://visonreport.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${DOMAIN}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${DOMAIN}/zh`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  ];
}
