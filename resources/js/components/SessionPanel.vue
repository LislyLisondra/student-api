<script setup>
import { ref, computed } from 'vue';
import { request } from '../api';
import { useAuth } from '../composables/useAuth';

const { token, user, isAdmin, clearSession } = useAuth();

const checking = ref(false);
const result = ref('');


const tokenPreview = computed(() => (token.value ? token.value.slice(0, 12) + '...' : ''));

s
async function checkSession() {
    checking.value = true;
    result.value = '';
    try {
        const res = await request('GET', '/me');
        result.value = `Laravel confirmed: ${res.user.name} (${res.role}).`;
    } catch (e) {
        if (e.status === 401) return clearSession();
        result.value = e.message;
    } finally {
        checking.value = false;
    }
}
</script>

<template>
    <section class="panel">
        <h2>Session</h2>
        <p><strong>Signed in as:</strong> {{ user?.name }} ({{ user?.email }})</p>
        <p><strong>Role:</strong> {{ isAdmin ? 'Administrator' : 'Regular user' }}</p>
        <p><strong>Bearer token:</strong> <code>{{ tokenPreview }}</code></p>
        <button class="btn" :disabled="checking" @click="checkSession">
            {{ checking ? 'Checking...' : 'Test protected endpoint (GET /api/me)' }}
        </button>
        <p v-if="result" class="hint">{{ result }}</p>
    </section>
</template>