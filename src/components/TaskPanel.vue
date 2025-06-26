<template>
    <div>
        <div v-if="props.project" class="project-info">
            <div class="project-title">{{ props.project.title }}</div>
            <div class="project-description">{{ props.project.description || 'No description' }}</div>
            <button @click="showEditProjectDialog" class="edit-project-button">Edit Project</button>
            <button @click="deleteProject" class="delete-project-button">Delete Project</button>
        </div>
        <div v-else class="no-project">
            <p>Choose Project.</p>
        </div>

        <div v-if="project" class="add-task-form">
            <button @click="showAddTaskDialog" class="add-task-button">Add Task</button>
            <ul>
                <li v-for="task in filteredTasks" :key="task.id" class="task-item">
                    <input type="checkbox" class="task-checkbox" v-model="task.completed" />
                    <span :class="{ done: task.completed }">{{ task.text }}</span>
                    <button @click="showEditTaskDialog(task)" class="edit-task-button">Edit</button>
                    <button @click="deleteTask(task.id)" class="delete-task-button">Delete</button>
                </li>
            </ul>
        </div>


        <!-- add task-->
        <modal-form :visible="showAddTaskModal" title="Add Task" :fields="taskFields" :submit-button-text="'Add'"
            @submit="addTask" @close="showAddTaskModal = false">
        </modal-form>

        <!-- edit task-->
        <modal-form :visible="showEditTaskModal" title="Edit Task" :fields="taskFields" :initial-data="editingTask"
            :submit-button-text="'Save'" @submit="saveTask" @close="showEditTaskModal = false">
        </modal-form>

        <!-- edit project-->
        <modal-form :visible="showEditProjectModal" title="Edit Project" :fields="projectFields"
            :initial-data="editedProject" :submit-button-text="'Save'" @submit="saveProject"
            @close="showEditProjectModal = false">
        </modal-form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModalForm from './UI/ModalForm.vue';

const props = defineProps({
    project: Object,
    tasks: Array,
    searchQuery: String
});
const showAddTaskModal = ref(false);
const showEditTaskModal = ref(false);
const showEditProjectModal = ref(false);
const editingTask = ref({ text: '' });
const editedProject = ref({ title: '', description: '' });
const taskFields = ref([
    { name: 'text', label: 'Task', type: 'text', placeholder: 'Enter task', required: true }
]);
const projectFields = ref([
    { name: 'title', label: 'Project Title', type: 'text', placeholder: 'Enter project title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: false },
]);

//emit
const emit = defineEmits(['add-task', 'update-task', 'remove-task', 'update-project', 'remove-project']);

// computed
const filteredTasks = computed(() => {
    if (!Array.isArray(props.tasks)) return [];
    return props.tasks.filter((task) => {
        if (!task || typeof task.text !== 'string') return false;
        return task.text.toLowerCase().includes((props.searchQuery || '').toLowerCase());
    });
})

// methods
const showAddTaskDialog = () => {
    showAddTaskModal.value = true;
};
const addTask = (taskData) => {
    if (taskData.text && taskData.text.trim()) {
        const newTask = { id: Date.now(), text: taskData.text, completed: false };
        emit('add-task', newTask);
        showAddTaskModal.value = false;
    } else {
        return;
    }
};
const showEditTaskDialog = (task) => {
    editingTask.value = { text: task.text, id: task.id };
    showEditTaskModal.value = true;
};
const saveTask = (taskData) => {
    if (taskData.text && taskData.text.trim()) {
        emit('update-task', { id: editingTask.value.id, text: taskData.text });
        showEditTaskModal.value = false;
    }
};

const deleteTask = (taskId) => {
    emit('remove-task', taskId);
};
const showEditProjectDialog = () => {
    editedProject.value = { ...props.project };
    showEditProjectModal.value = true;
};
const saveProject = (projectData) => {
    if (projectData.title && projectData.title.trim()) {
        emit('update-project', projectData);
        showEditProjectModal.value = false;
    }
};
const deleteProject = () => {
    if (confirm('Are you sure you want to delete this project?')) {
        emit('remove-project', props.project.numericId);
    }
};

</script>