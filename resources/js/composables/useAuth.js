import { ref, computed } from 'vue';
import { request } from '../api';


const token = ref(localStorage.getItem('token'));
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

export function useAuth() {
    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    async function login(email, password) {
        const data = await request('POST', '/login', { email, password });
        token.value = data.token;
        user.value = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    function clearSession() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    async function logout() {
        try {
            await request('POST', '/logout'); 
        } catch (e) {
            
        }
        clearSession();
    }

    return { token, user, isLoggedIn, isAdmin, login, logout, clearSession };
}