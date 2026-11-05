<script setup>
import { ref, onMounted } from 'vue';
import { request } from '../api';
import StudentTable from './StudentTable.vue';
import StudentForm from './StudentForm.vue';
import AlertMessage from './AlertMessage.vue';

defineProps({ isAdmin: { type: Boolean, default: false } });
const emit = defineEmits(['unauthorized']);

const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editing = ref(null);
const formErrors = ref({});
const alert = ref(null);

function notify(type, text) {
    alert.value = { type, text };
    setTimeout(() => (alert.value = null), 4000);
}

function handleError(e) {
    if (e.status === 401) return emit('unauthorized'); // token missing or revoked
    if (e.status === 422) formErrors.value = e.errors || {}; // validation errors
    notify('error', e.message);
}

async function loadStudents() {
    loading.value = true;
    try {
        const res = await request('GET', '/students');
        students.value = res.data;
    } catch (e) {
        handleError(e);
    } finally {
        loading.value = false;
    }
}

function openAdd() {
    editing.value = null;
    formErrors.value = {};
    showForm.value = true;
}

function openEdit(student) {
    editing.value = student;
    formErrors.value = {};
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editing.value = null;
}

async function saveStudent(payload) {
    saving.value = true;
    formErrors.value = {};
    try {
        if (editing.value) {
            await request('PUT', `/students/${editing.value.id}`, payload);
            notify('success', 'Student updated successfully.');
        } else {
            await request('POST', '/students', payload);
            notify('success', 'Student added successfully.');
        }
        closeForm();
        await loadStudents();
    } catch (e) {
        handleError(e);
    } finally {
        saving.value = false;
    }
}

async function deleteStudent(student) {
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    try {
        await request('DELETE', `/students/${student.id}`);
        notify('success', 'Student deleted successfully.');
        await loadStudents();
    } catch (e) {
        handleError(e);
    }
}

onMounted(loadStudents);
</script>

<template>
    <AlertMessage v-if="alert" :type="alert.type" :text="alert.text" />

    <StudentForm
        v-if="showForm"
        :student="editing"
        :errors="formErrors"
        :saving="saving"
        @save="saveStudent"
        @cancel="closeForm"
    />

    <section class="panel">
        <div class="row between">
            <h2>All students</h2>
            <button v-if="isAdmin && !showForm" class="btn primary" @click="openAdd">
                Add student
            </button>
        </div>

        <p v-if="!isAdmin" class="hint">You have view-only access. Only administrators can change records.</p>
        <p v-if="loading" class="empty">Loading students...</p>

        <StudentTable
            v-else
            :students="students"
            :is-admin="isAdmin"
            @edit="openEdit"
            @delete="deleteStudent"
        />
    </section>
</template>