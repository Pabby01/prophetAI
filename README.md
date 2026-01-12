# Prophet.AI 🔮
### The All-Seeing Oracle on Mantle Network

**Prophet.AI** is a next-generation **AI Prediction Market Interface** that combines the reasoning power of LLMs with the liquidity of decentralized prediction markets (Polymarket) and the speed of **Mantle Network**.

![Prophet Dashboard](https://i.imgur.com/example-dashboard.png)

---

## 🏆 Hackathon Tracks & Deliverables
This project is submitted for the **Mantle Global Hackathon**, targeting:
-   **DeFi / Prediction Markets**: Bridging Web2 AI UX with Web3 liquidity.
-   **UX/UI Excellence**: A seamless, "Real AI" interface that feels like ChatGPT but acts like a dApp.

---

## 🚀 The Vision
Prediction markets are the source of truth, but they are hard to navigate. Users have to browse hundreds of markets to find alpha.
**Prophet.AI changes this.**
Instead of searching, you **ask**.
-   *"Will Bitcoin hit $100k?"*
-   *"Is the Mantle Airdrop confirmed?"*

The AI Oracle:
1.  **Understand** your intent.
2.  **Scans** live Polymarket data for the exact event.
3.  **Analyzes** the odds and news.
4.  **Challenges** you to place a bet on-chain if you disagree with the market.

---

## ✨ Key Features

### 1. 🧠 AI Oracle Chat
A full-screen, immersive chat interface powered by **GPT-4o**.
-   **Natural Language Betting**: Just talk to it. "Bet $50 on Yes".
-   **Deep Context**: It knows the live odds, volume, and market close dates.
-   **Persona**: A mystical, confident Oracle that keeps users engaged.

### 2. 📊 Markets Explorer
A real-time dashboard of trending global events.
-   **Live Data**: Fetches "Trending" and "High Volume" markets via Polymarket API.
-   **Click-to-Predict**: See a market you like? Click it to instantly open a debate with the Oracle.

### 3. ⚡ Seamless On-Chain Actions
-   **Mantle Sepolia Integration**: Deployed smart contracts for betting logic.
-   **MetaMask / Wallet Connect**: Frictionless wallet connection.
-   **Non-Custodial**: Users retain full control of their funds.

---

## 🛠 Technical Architecture

### Frontend
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + Framer Motion (Glassmorphism & Micro-interactions)
-   **State**: TanStack Query + Wagmi
-   **AI**: Vercel AI SDK (Streaming responses)

### Backend / AI Engine
-   **Model**: OpenAI GPT-4o (via Vercel AI SDK)
-   **Tools**: Custom Function Calling (`get_odds`, `prepare_bet_transaction`)
-   **Data**: Polymarket Gamma API (Proxy buffered)

### Smart Contracts (Mantle Sepolia)
-   **Contract**: `ProphetMarket.sol`
-   **Address**: `0x...` (See `.env`)
-   **Functions**: `createMarket`, `placeBet`, `resolveMarket`

---

## 🏁 Getting Started

### Prerequisites
-   Node.js 18+
-   Mantle Sepolia funded wallet
-   OpenAI API Key

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/prophet-ai.git
    cd prophet-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file:
    ```env
    OPENAI_API_KEY=sk-...
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
    NEXT_PUBLIC_PROPHET_MARKET_ADDRESS=...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Open Prophet.AI**
    Navigate to `http://localhost:3000`.

---

## 🧪 How to Verify (Judges)

1.  **Connect Wallet**: Use the sidebar button to connect to Mantle Sepolia.
2.  **Ask the Oracle**: Type *"Who wins the US Election?"* or *"Mantle Price"*.
    -   *Observe*: The AI calls the `get_odds` tool and renders a "Vision Detected" card.
3.  **Explore Markets**: Go to the **Markets** tab.
    -   *Observe*: Real-time trending events.
4.  **Deep Link**: Click a market card.
    -   *Observe*: It redirects to chat and auto-starts the prediction flow.

---

## 🔮 Future Roadmap
-   **Automated Resolution**: Chainlink Oracle integration for decentralized settling.
-   **Social Betting**: "Challenge a Friend" links.
-   **Token Integration**: $PROPHET token for governance and fee rebates.

---

*Built with ❤️ for the Mantle Hackathon 2025.*