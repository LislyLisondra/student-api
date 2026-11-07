<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import AlertMessage from './AlertMessage.vue';

const { login } = useAuth();


const email = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

async function submit() {
    error.value = '';
    loading.value = true;
    try {
        await login(email.value, password.value);
    } catch (e) {
        error.value = e.errors ? Object.values(e.errors).flat().join(' ') : e.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="login-shell">
        <aside class="login-side">
            <h2>Student Records</h2>
            <p>Sign in to view and manage student information.</p>
           
        </aside>

        <section class="login-main">
            <h2>Welcome back</h2>
            <AlertMessage v-if="error" type="error" :text="error" />
            <form @submit.prevent="submit">
                <label>
                    Email address
                    <input v-model="email" type="email" required autocomplete="username" />
                </label>
                <label>
                    Password
                    <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        autocomplete="current-password"
                    />
                </label>
                <label class="check">
                    <input v-model="showPassword" type="checkbox" />
                    Show password
                </label>
                <button class="btn primary wide" :disabled="loading">
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>
            </form>
        </section>
    </div>
</template>