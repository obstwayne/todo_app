<template>
  <div class="app-container">
    <!-- settings button -->
    <button v-if="!sidebarOpen" @click="sidebarOpen = true" class="sidebar-toggle">☰</button>
    <SideBarItem :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- left side -->
    <div class="left-panel">
      <div class="left-panel__top">
        <div class="meeting">
          <h1>Hi, {{ settingsStore.username || 'Guest' }}</h1>
          <h3>Welcome back to the workspace, nice to meet u!</h3>
        </div>
        <div class="search-panel">
          <div class="input-with-icon">
            <SearchIcon class="w-5 h-5 text-gray-600" />
            <input type="text" v-model="searchQuery" placeholder="Write some name of project" class="search-input">
          </div>
        </div>
      </div>

      <div class="left-panel__bottom">
        <h2 class="projects-title">Projects ({{ projectsStore.projects.length }})</h2>
        <div class="projects-grid">
          <project-card v-for="project in projectsStore.filteredProjects(searchQuery)" :key="project.id"
            :project="project" @select="projectsStore.selectProject(project.numericId)">
          </project-card>
        </div>
        <button @click.stop="showCreateProjectDialog" class="create-button">Create New Project
        </button>
      </div>
    </div>

    <!-- right side -->
    <div class="right-panel">
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
import { useSettingsStore } from './stores/settings';
import ProjectCard from './components/ProjectCard.vue';
import TaskPanel from './components/TaskPanel.vue';
// import FormDialog from './components/FormDialog.vue';
import ModalForm from './components/UI/ModalForm.vue';
import SideBarItem from './components/SideBarItem.vue';
import SearchIcon from './components/icons/search.svg';

export default {
  components: {
    ProjectCard, TaskPanel, ModalForm, SideBarItem, SearchIcon
  },
  data() {
    return {
      searchQuery: '',
      dialogVisible: false,
      projectFields: [
        { name: 'title', label: 'Project Title', type: 'text', placeholder: 'Enter project title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: false },
      ],
      sidebarOpen: false,
    }
  },
  setup() {
    const projectsStore = useProjectsStore();
    const settingsStore = useSettingsStore();
    return { projectsStore, settingsStore }
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
  async mounted() {
    this.projectsStore.fetchProjects();
    this.settingsStore.fetchSettings('default');
  }
}
</script>

<style>
.sidebar-toggle {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background-color: #333;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
}
</style>