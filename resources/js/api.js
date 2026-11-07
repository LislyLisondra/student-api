import { ref } from 'vue';

// Details of the most recent API call, so the UI can show the Bearer token in action
export const lastRequest = ref(null);

// One place that talks to the Laravel API and attaches the Sanctum bearer token
export async function request(method, url, body) {
    const token = localStorage.getItem('token');

    const res = await fetch('/api' + url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    lastRequest.value = {
        method,
        url: '/api' + url,
        status: res.status,
        ok: res.ok,
        bearer: !!token,
    };

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const error = new Error(data.message || 'Something went wrong.');
        error.status = res.status;
        error.errors = data.errors || null;
        throw error;
    }

    return data;
}