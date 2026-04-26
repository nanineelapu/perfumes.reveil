import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
            '/admin/', 
            '/api/', 
            '/account/', 
            '/cart', 
            '/checkout',
            '/auth'
        ],
      },
    ],
    sitemap: 'https://perfumesreveil.vercel.app/sitemap.xml',
  }
}
