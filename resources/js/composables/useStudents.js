import { ref } from 'vue';
import { request } from '../api';
import { useAuth } from './useAuth';

export function useStudents() {
    const { clearSession } = useAuth();

    const students = ref([]);
    const loading = ref(false);
    const saving = ref(false);
    const deletingId = ref(null);
    const formErrors = ref({});
    const feedback = ref(null); 

    function notify(type, text) {
        feedback.value = { type, text };
        setTimeout(() => (feedback.value = null), 4000);
    }

    function handleError(e) {
        if (e.status === 401) return clearSession(); 
        if (e.status === 422) formErrors.value = e.errors || {}; 
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

   
    async function saveStudent(payload, id = null) {
        saving.value = true;
        formErrors.value = {};
        try {
            if (id) {
                await request('PUT', `/students/${id}`, payload);
                notify('success', 'Student updated successfully.');
            } else {
                await request('POST', '/students', payload);
                notify('success', 'Student added successfully.');
            }
            await loadStudents();
            return true;
        } catch (e) {
            handleError(e);
            return false;
        } finally {
            saving.value = false;
        }
    }

    async function deleteStudent(student) {
        deletingId.value = student.id;
        try {
            await request('DELETE', `/students/${student.id}`);
            notify('success', 'Student deleted successfully.');
            await loadStudents();
        } catch (e) {
            handleError(e);
        } finally {
            deletingId.value = null;
        }
    }

    return {
        students, loading, saving, deletingId, formErrors, feedback,
        loadStudents, saveStudent, deleteStudent,
    };
}