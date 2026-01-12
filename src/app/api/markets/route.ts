import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || 'crypto';

    try {
        const response = await fetch(`https://gamma-api.polymarket.com/events?limit=20&sort=volume&order=desc&q=${q}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Prophet.AI/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Polymarket API responded with ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Polymarket Proxy Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
