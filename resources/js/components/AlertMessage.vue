<script setup>
defineProps({
    type: { type: String, default: 'success' }, 
    text: { type: String, required: true },
});
</script>

<template>
    <div class="alert" :class="type" role="status">{{ text }}</div>
</template>