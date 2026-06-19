import { limiter } from '@/lib/limiter';

export async function GET(req) {
    const res = await limiter(req);
    return res;
}