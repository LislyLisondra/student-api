<script setup>

defineProps({
    students: { type: Array, required: true },
    isAdmin: { type: Boolean, default: false },
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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>GPA</th>
                    <th v-if="isAdmin">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in students" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.first_name }} {{ s.last_name }}</td>
                    <td>{{ s.email }}</td>
                    <td>{{ s.course }}</td>
                    <td>{{ s.year_level }}</td>
                    <td>{{ s.gpa ?? 'N/A' }}</td>
                    <td v-if="isAdmin" class="actions">
                        <button class="btn small" @click="$emit('edit', s)">Edit</button>
                        <button class="btn small danger" @click="$emit('delete', s)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>