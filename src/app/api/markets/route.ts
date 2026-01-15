import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || 'crypto';

    try {
        const baseUrl = `https://gamma-api.polymarket.com/events`;
        const headers = {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };

        const params = `limit=20&active=true&closed=false&sort=volume&order=desc&q=${q}`;
        let response = await fetch(`${baseUrl}?${params}`, { headers });

        // Retry logic for 422
        if (response.status === 422) {
            console.warn("Proxy: 422 Error. Retrying simple query...");
            const simpleParams = `limit=10&active=true&closed=false&q=${q}`;
            response = await fetch(`${baseUrl}?${simpleParams}`, { headers });
        }

        if (!response.ok) {
            console.warn(`Polymarket API responded with ${response.status}, serving empty.`);
            return NextResponse.json([]);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Polymarket Proxy Error, serving failure:', error);
        return NextResponse.json([]); // Fail gracefully with empty array, NO MOCKS
    }
}
