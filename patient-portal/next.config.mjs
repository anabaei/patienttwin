/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost','www.chamberplan.ca','www.medavie.bluecross.ca', 'www.greatwestlife.com', 'images.unsplash.com', 'plus.unsplash.com', 'source.unsplash.com', 'picsum.photos', 'i.pravatar.cc', '1000logos.net', 'cdn.worldvectorlogo.com', 'dt8n8gomznf9q.cloudfront.net', 'encrypted-tbn0.gstatic.com'],
  },
  transpilePackages: ['@twinn/store'],
};

export default nextConfig;
