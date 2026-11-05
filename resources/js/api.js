
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

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const error = new Error(data.message || 'Something went wrong.');
        error.status = res.status;
        error.errors = data.errors || null;
        throw error;
    }

    return data;
}