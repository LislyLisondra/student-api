<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useStudents } from '../composables/useStudents';
import SessionPanel from './SessionPanel.vue';
import StudentTable from './StudentTable.vue';
import StudentForm from './StudentForm.vue';
import AlertMessage from './AlertMessage.vue';

const { isAdmin } = useAuth();
const {
    students, loading, saving, deletingId, formErrors, feedback,
    loadStudents, saveStudent, deleteStudent,
} = useStudents();

// UI state for the add/edit form
const showForm = ref(false);
const editing = ref(null);

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

async function onSave(payload) {
    const saved = await saveStudent(payload, editing.value?.id);
    if (saved) closeForm();
}

async function onDelete(student) {
    if (confirm(`Delete ${student.first_name} ${student.last_name}?`)) {
        await deleteStudent(student);
    }
}

onMounted(loadStudents);
</script>

<template>
    <SessionPanel />

    <AlertMessage v-if="feedback" :type="feedback.type" :text="feedback.text" />

    <StudentForm
        v-if="showForm"
        :student="editing"
        :errors="formErrors"
        :saving="saving"
        @save="onSave"
        @cancel="closeForm"
    />

    <section class="panel">
        <div class="row between">
            <h2>All students</h2>
            <button v-if="isAdmin && !showForm" class="btn primary" @click="openAdd">
                Add student
            </button>
        </div>

        <p v-if="!isAdmin" class="hint">
            You have view-only access. Only administrators can change records.
        </p>
        <p v-if="loading" class="empty">Loading students...</p>

        <StudentTable
            v-else
            :students="students"
            :is-admin="isAdmin"
            :deleting-id="deletingId"
            @edit="openEdit"
            @delete="onDelete"
        />
    </section>
</template>