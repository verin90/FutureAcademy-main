import { createContext, useContext } from 'react';

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export async function api(path, body, signal) {
    const response = await fetch('/api' + path, {
        signal,
        ...(body !== undefined && { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
    if (response.status === 204) return null;
    const data = await response.json().catch(() => null);
    if (!response.ok || data === null) throw new Error(data?.error || 'Сервис временно недоступен. Попробуйте ещё раз.');
    return data;
}
