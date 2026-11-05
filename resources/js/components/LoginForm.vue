<script setup>
import { ref } from 'vue';
import { request } from '../api';
import AlertMessage from './AlertMessage.vue';

const emit = defineEmits(['logged-in']);

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
    error.value = '';
    loading.value = true;
    try {
        const data = await request('POST', '/login', {
            email: email.value,
            password: password.value,
        });
        emit('logged-in', { token: data.token, user: data.user });
    } catch (e) {
        error.value = e.errors ? Object.values(e.errors).flat().join(' ') : e.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <section class="panel narrow">
        <h2>Log in</h2>
        <AlertMessage v-if="error" type="error" :text="error" />
        <form @submit.prevent="submit">
            <label>
                Email
                <input v-model="email" type="email" required />
            </label>
            <label>
                Password
                <input v-model="password" type="password" required />
            </label>
            <button class="btn primary" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Log in' }}
            </button>
        </form>
    </section>
</template>