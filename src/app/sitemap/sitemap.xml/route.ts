export async function GET() {
    const urls: { loc: string; lastmod: string }[] = [
      { loc: 'https://www.cubingkerala.org', lastmod: '2024-01-01' },
      { loc: 'https://www.cubingkerala.org/competitions', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/members', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/rankings', lastmod: '2024-10-11' },
      { loc: 'https://www.cubingkerala.org/contact', lastmod: '2024-11-06' },
      { loc: 'https://www.cubingkerala.org/login', lastmod: '2024-10-11' },
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
  