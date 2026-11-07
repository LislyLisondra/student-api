<script setup>
import { ref, computed } from 'vue';
import { request } from './api';
import LoginForm from './components/LoginForm.vue';
import StudentManager from './components/StudentManager.vue';

const token = ref(localStorage.getItem('token'));
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

const isAdmin = computed(() => user.value?.role === 'admin');

function onLoggedIn({ token: newToken, user: newUser }) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    token.value = newToken;
    user.value = newUser;
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token.value = null;
    user.value = null;
}

async function logout() {
    try {
        await request('POST', '/logout');
    } catch (e) {
        
    }
    clearSession();
}
</script>

<template>
    <header class="topbar">
        <h1>Student Records</h1>
        <div v-if="token && user" class="session">
            <span>{{ user.name }}</span>
            <span class="badge">{{ user.role }}</span>
            <button class="btn" @click="logout">Log out</button>
        </div>
    </header>

    <main class="container">
        <StudentManager
            v-if="token"
            :is-admin="isAdmin"
            @unauthorized="clearSession"
        />
        <LoginForm v-else @logged-in="onLoggedIn" />
    </main>
</template>