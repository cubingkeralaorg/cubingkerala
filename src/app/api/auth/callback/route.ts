import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
    }

    try {
        const tokenResponse = await axios.post('https://www.worldcubeassociation.org/oauth/token', {
            client_id: process.env.CLIENT_ID as string,
            client_secret: process.env.CLIENT_SECRET as string,
            redirect_uri: 'https://cubingkeralaorg.vercel.app/api/auth/callback',
            grant_type: 'authorization_code',
            code,
        });

        const { access_token, token_type, expires_in } = tokenResponse.data;

        // Fetch user information from WCA API
        const userInfoResponse = await axios.get('https://www.worldcubeassociation.org/api/v0/me', {
            headers: {
                Authorization: `${token_type} ${access_token}`,
            },
        });

        const userInfo = userInfoResponse.data;

        const ExistingUser = await db.users.findUnique({
            where: {
                wcaid: userInfo.me.wca_id
            }
        })

        if (!ExistingUser) {
            await db.users.create({
                data: {
                    wcaid: userInfo.me.wca_id,
                    name: userInfo.me.name,
                    avatarUrl: userInfo.me.avatar.url,
                    country: userInfo.me.country.name,
                    gender: userInfo.me.gender,
                    createdAt: new Date(),
                    updatedAt: new Date(),            
                }
            })
        }
        

        // Set the token in cookies
        const cookieExpires = new Date(Date.now() + expires_in * 1000).toUTCString();
        const cookieValue = `${token_type} ${access_token}`;

        const response = NextResponse.redirect(new URL('/', req.url));

        // Set the cookie in the response headers
        response.cookies.set('authToken', cookieValue, {
            path: '/',
            expires: new Date(cookieExpires),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });

        response.cookies.set('userInfo', JSON.stringify(userInfo))
        revalidatePath('/')
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
    }

}
