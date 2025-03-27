<template>
    <div>
        <div v-if="project" class="project-info">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-description">{{ project.description || 'No description' }}</div>
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
                    <span>{{ task.text }}</span>
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

<script>
import ModalForm from './UI/ModalForm.vue';

export default {
    components: {
        ModalForm
    },
    props: {
        project: Object,
        tasks: Array,
        searchQuery: String
    },
    data() {
        return {
            showAddTaskModal: false,
            showEditTaskModal: false,
            showEditProjectModal: false,
            editingTask: { text: '' },
            editedProject: { title: '', description: '' },
            taskFields: [
                { name: 'text', label: 'Task', type: 'text', placeholder: 'Enter task', required: true },
            ],
            projectFields: [
                { name: 'title', label: 'Project Title', type: 'text', placeholder: 'Enter project title', required: true },
                { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: false },
            ],
        };
    },
    computed: {
        filteredTasks() {
            if (!Array.isArray(this.tasks)) return [];
            return this.tasks.filter((task) => {
                if (!task || typeof task.text !== 'string') return false;
                return task.text.toLowerCase().includes((this.searchQuery || '').toLowerCase());
            });
        }
    },
    methods: {
        showAddTaskDialog() {
            this.showAddTaskModal = true;
        },
        addTask(taskData) {
            if (taskData.text && taskData.text.trim()) {
                const newTask = { id: Date.now(), text: taskData.text };
                this.$emit('add-task', newTask);
                this.showAddTaskModal = false;
            } else {
                return;
            }
        },
        showEditTaskDialog(task) {
            this.editingTask = { text: task.text, id: task.id };
            this.showEditTaskModal = true;
        },
        saveTask(taskData) {
            if (taskData.text.trim()) {
                this.$emit('update-task', { id: this.editingTask.id, text: taskData.text });
                this.showEditTaskModal = false;
            }
        },
        deleteTask(taskId) {
            this.$emit('remove-task', taskId);
        },
        showEditProjectDialog() {
            this.editedProject = { ...this.project };
            this.showEditProjectModal = true;
        },
        saveProject(projectData) {
            if (projectData.title.trim()) {
                this.$emit('update-project', projectData);
                this.showEditProjectModal = false;
            }
        },
        deleteProject() {
            if (confirm('Are you sure you want to delete this project?')) {
                this.$emit('remove-project', this.project.numericId);
            }
        },
    },
};

</script>