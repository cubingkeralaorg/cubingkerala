export async function GET() {
    const urls: { loc: string; lastmod: string }[] = [
      { loc: 'https://www.cubingkerala.org', lastmod: '2024-01-01' },
      { loc: 'https://www.cubingkerala.org/competitions', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/members', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/rankings', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/contact', lastmod: '2024-11-06' },
      { loc: 'http://wa.me/919633062991', lastmod: '2024-11-06' },
      { loc: 'https://www.cubingkerala.org/login', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/api/auth/callback', lastmod: '2024-10-11' },
      { loc: 'https://www.worldcubeassociation.org/users/sign_in', lastmod: '2024-10-11' },
      { loc: 'https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS', lastmod: '2024-10-11' },
      { loc: 'https://github.com/cubingkeralaorg/cubingkerala', lastmod: '2024-10-11' },
      { loc: 'https://www.instagram.com/cubingkerala', lastmod: '2024-10-11' },
      { loc: 'https://www.facebook.com/cubingkeralaofficial', lastmod: '2024-10-11' },
      { loc: 'https://www.allenjohn.online', lastmod: '2024-10-24' },
    ];
  
    // Generate XML content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
          .map(
            (url) => `
          <url>
            <loc>${url.loc}</loc>
            <lastmod>${url.lastmod}</lastmod>
          </url>`
          )
          .join('')}
      </urlset>`;
  
    // Return the XML response
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
  