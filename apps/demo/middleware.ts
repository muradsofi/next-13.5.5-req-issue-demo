import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

export const config = { matcher: ['/', '/chat/:path*'] };

const middleware = async (req: NextRequest) => {
	try {
		console.log(req.nextUrl);
		console.log(req.url);
		return NextResponse.next();
	} catch (error) {
		return NextResponse.next();
	}
};


export default middleware;