
import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { type Chain } from 'viem'

export const mantleSepolia = {
    id: 5003,
    name: 'Mantle Sepolia',
    nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Mantle Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
    },
    testnet: true,
} as const satisfies Chain

import { mantle } from 'viem/chains'

export const config = createConfig({
    chains: [mantle, mantleSepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [mantle.id]: http(),
        [mantleSepolia.id]: http(),
    },
})
