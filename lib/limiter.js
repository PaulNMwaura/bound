import { NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rateLimit';

export async function limiter (req) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anonymous";

    const { api } = rateLimiters;

    const result = await api.limit(ip);

    if (!result.success) {
        return NextResponse.json(
            { message: "Rate limit exceeded", },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": String(result.limit),
                    "X-RateLimit-Remaining": String(result.remaining),
                },
            }
        );
    
    }
    
    return NextResponse.json(
        { message: "Hello" },
        {
            headers: {
                "X-RateLimit-Limit": String(result.limit),
                "X-RateLimit-Remaining": String(result.remaining),
            },
        }
    );
}
