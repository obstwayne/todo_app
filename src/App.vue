<template>
  <div class="app-container">
    <div class="left-panel">Left side
      <input type="text" v-model="searchQuery" placeholder="Write some name of project" class="search-input">
      <h2 class="projects-title">Projects: {{ projectsStore.projects.length }}</h2>
      <div class="projects-grid">
        <project-card v-for="project in projectsStore.filteredProjects(searchQuery)" :key="project.id"
          :project="project" @select="projectsStore.selectProject(project.numericId)">
        </project-card>
      </div>
      <button @click.stop="showCreateProjectDialog" class="create-button">Create New Project
      </button>
    </div>

    <div class="right-panel">Right side
      <task-panel :project="projectsStore.selectedProject" :tasks="projectsStore.selectedProjectTasks"
        :searchQuery="searchQuery" @add-task="projectsStore.addTask" @update-task="projectsStore.updateTask"
        @remove-task="projectsStore.removeTask" @update-project="projectsStore.updateProject"
        @remove-project="projectsStore.removeProject">
      </task-panel>
    </div>
    <modal-form :visible="dialogVisible"
      title="Create New Project"
      :fields="projectFields"
      :submit-button-text="'Create'"
      @submit="createProject"
      @close="dialogVisible = false"
    >
    </modal-form>
  </div>
</template>

<script>
import { useProjectsStore } from './stores/projects';
import ProjectCard from './components/ProjectCard.vue';
import TaskPanel from './components/TaskPanel.vue';
// import FormDialog from './components/FormDialog.vue';
import ModalForm from './components/UI/ModalForm.vue';

export default {
  components: {
    ProjectCard, TaskPanel, ModalForm
  },
  data() {
    return {
      searchQuery: '',
      dialogVisible: false,
      projectFields: [
        { name: 'title', label: 'Project Title', type: 'text', placeholder: 'Enter project title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: false },
      ],
    }
  },
  setup() {
    const projectsStore = useProjectsStore();
    return { projectsStore }
  },
  methods: {
    showCreateProjectDialog() {
      this.dialogVisible = true;
    },
    async createProject(newProject) {
      await this.projectsStore.createProject(newProject);
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.projectsStore.fetchProjects();
  }
}
</script>