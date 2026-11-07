<script setup>

defineProps({
    students: { type: Array, required: true },
    isAdmin: { type: Boolean, default: false },
    deletingId: { type: Number, default: null },
});
defineEmits(['edit', 'delete']);
</script>

<template>
    <p v-if="students.length === 0" class="empty">
        No students yet. Add the first record to get started.
    </p>

    <div v-else class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>GPA</th>
                    <th v-if="isAdmin">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in students" :key="s.id">
                    <td class="muted">{{ s.id }}</td>
                    <td>
                        <div class="student-cell">
                            <span class="avatar">{{ s.first_name?.[0] }}{{ s.last_name?.[0] }}</span>
                            <div>
                                <strong>{{ s.first_name }} {{ s.last_name }}</strong>
                                <small>{{ s.email }}</small>
                            </div>
                        </div>
                    </td>
                    <td>{{ s.course }}</td>
                    <td><span class="chip">Year {{ s.year_level }}</span></td>
                    <td><span class="chip">{{ s.gpa ?? 'N/A' }}</span></td>
                    <td v-if="isAdmin" class="actions">
                        <button class="btn small" @click="$emit('edit', s)">Edit</button>
                        <button
                            class="btn small danger"
                            :disabled="deletingId === s.id"
                            @click="$emit('delete', s)"
                        >
                            {{ deletingId === s.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>