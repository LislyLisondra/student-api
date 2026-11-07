<script setup>
import { ref, computed } from 'vue';
import { request, lastRequest } from '../api';
import { useAuth } from '../composables/useAuth';

const { token, user, isAdmin, clearSession } = useAuth();

const checking = ref(false);
const result = ref('');
const revealed = ref(false);
const copied = ref(false);

const tokenPreview = computed(() => (token.value ? token.value.slice(0, 12) + '...' : ''));
const shownToken = computed(() => (revealed.value ? token.value : tokenPreview.value));

async function copyToken() {
    try {
        await navigator.clipboard.writeText(token.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch (e) {
        
    }
}


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

        <div class="token-box">
            <span class="token-label">Authorization header sent with every request</span>
            <code>Bearer {{ shownToken }}</code>
            <div class="row">
                <button class="btn small" @click="revealed = !revealed">
                    {{ revealed ? 'Hide token' : 'Show token' }}
                </button>
                <button class="btn small" @click="copyToken">{{ copied ? 'Copied' : 'Copy' }}</button>
                <button class="btn small" :disabled="checking" @click="checkSession">
                    {{ checking ? 'Checking...' : 'Test GET /api/me' }}
                </button>
            </div>
        </div>

        <p v-if="result" class="hint">{{ result }}</p>
        <p v-if="lastRequest" class="request-line">
            Last request: <strong>{{ lastRequest.method }}</strong> {{ lastRequest.url }}
            returned <span :class="lastRequest.ok ? 'ok' : 'bad'">{{ lastRequest.status }}</span>
            <span v-if="lastRequest.bearer"> with Bearer token</span>
        </p>
    </section>
</template>