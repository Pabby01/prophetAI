import { Message } from 'ai'

// Storage Keys
const STORAGE_KEYS = {
    CHATS: 'prophet_chats', // Metadata list: { id, title, timestamp }[]
    MESSAGES: 'prophet_messages_', // Prefix for messages: prophet_messages_uuid
}

// In ChatInterface.tsx
// 1. Accept optional 'chatId' prop.
// 2. If 'chatId' provided -> Load initialMessages from localStorage.
// 3. If no 'chatId' -> Create one on first user message.
// 4. On messages change -> Save to localStorage(chatId).

// In AppSidebar.tsx
// 1. List items from 'prophet_chats'.
// 2. On click -> router.push('/c/[chatId]') or just handle via query param ?c=chatId
