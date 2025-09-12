/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: ['localhost', 'images.unsplash.com', 'plus.unsplash.com', 'source.unsplash.com', 'picsum.photos', 'i.pravatar.cc', '1000logos.net', 'cdn.worldvectorlogo.com', 'dt8n8gomznf9q.cloudfront.net', 'encrypted-tbn0.gstatic.com'],
  },
  transpilePackages: ['@twinn/store'],
  outputFileTracingRoot: '/Users/anujwagle/Documents/Projects/twinn/Twinnlinks-Patient',
};

export default nextConfig;
