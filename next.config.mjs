/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        swcPlugins:[
            ["next-superjson-plugin", {}]
        ]
    },
    images:{
        domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'avatars.githubusercontent.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '**',
            }
        ]
    }
};

export default nextConfig;
