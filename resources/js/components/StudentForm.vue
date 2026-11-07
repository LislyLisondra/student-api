<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    student: { type: Object, default: null },
    errors: { type: Object, default: () => ({}) },
    saving: { type: Boolean, default: false },
});
const emit = defineEmits(['save', 'cancel']);

const fields = [
    { key: 'first_name', label: 'First name', type: 'text' },
    { key: 'last_name', label: 'Last name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'year_level', label: 'Year level (1-5)', type: 'number' },
    { key: 'gpa', label: 'GPA (0-4)', type: 'number' },
];

const blank = () => ({
    first_name: '', last_name: '', email: '', course: '', year_level: '', gpa: '',
});
const form = reactive(blank());


watch(
    () => props.student,
    (s) => {
        Object.assign(form, blank());
        if (s) {
            fields.forEach((f) => (form[f.key] = s[f.key] ?? ''));
        }
    },
    { immediate: true }
);

function submit() {
    emit('save', {
        ...form,
        year_level: form.year_level === '' ? null : Number(form.year_level),
        gpa: form.gpa === '' || form.gpa === null ? null : Number(form.gpa),
    });
}
</script>

<template>
    <form class="panel" @submit.prevent="submit" novalidate>
        <h2>{{ student ? 'Edit student' : 'Add student' }}</h2>

        <div class="grid">
            <label v-for="f in fields" :key="f.key">
                {{ f.label }}
                <input
                    v-model="form[f.key]"
                    :type="f.type"
                    :step="f.key === 'gpa' ? '0.01' : undefined"
                    :class="{ invalid: errors[f.key] }"
                />
                <small v-if="errors[f.key]" class="field-error">{{ errors[f.key][0] }}</small>
            </label>
        </div>

        <div class="row">
            <button class="btn primary" :disabled="saving">
                {{ saving ? 'Saving...' : student ? 'Save changes' : 'Add student' }}
            </button>
            <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
        </div>
    </form>
</template>