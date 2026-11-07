<script setup>
import { useAuth } from './composables/useAuth';
import LoginForm from './components/LoginForm.vue';
import StudentManager from './components/StudentManager.vue';

const { user, isLoggedIn, logout } = useAuth();
</script>

<template>
    <header class="topbar">
        <h1>Student Records</h1>
        <div v-if="isLoggedIn && user" class="session">
            <span>{{ user.name }}</span>
            <span class="badge">{{ user.role }}</span>
            <button class="btn" @click="logout">Log out</button>
        </div>
    </header>

    <main class="container">
        <StudentManager v-if="isLoggedIn" />
        <LoginForm v-else />
    </main>
</template>