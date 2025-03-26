<template>
  <div class="app-container">Left side
    <div class="left-panel">
      <input type="text" v-model="searchQuery" placeholder="Write some name of project" class="search-input">
      <h2 class="projects-title">Projects: {{ projects.length }}</h2>
      <div class="projects-grid">
        <project-card v-for="project in filteredProjects" :key="project.id" :project="project" @select="selectProject">
        </project-card>
      </div>
      <button @click="showCreateProjectDialog" class="create-button">Create New Project
      </button>
    </div>

    <div class="right-panel">Right side
      <task-panel :tasks="selectedProjectTasks" :searchQuery="searchQuery">
      </task-panel>
    </div>
    <form-dialog v-if="dialogVisible" @close="dialogVisible = false" @create="createProject">
    </form-dialog>
  </div>
</template>

<script>
import ProjectCard from './components/ProjectCard.vue';
import TaskPanel from './components/TaskPanel.vue';
import FormDialog from './components/FormDialog.vue';

export default {
  components: {
    ProjectCard, TaskPanel, FormDialog
  },
  data() {
    return {
      projects: [],
      selectedProjectId: null,
      searchQuery: '',
      dialogVisible: false,
    }
  },
  computed: {
    filteredProjects() {
      return this.projects.filter((project) =>
        project.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    selectedProjectTasks() {
      const selectedProject = this.projects.find(
        (p) => p.id === this.selectedProjectId
      );
      return selectedProject ? selectedProject.tasks : [];
    }
  },
  methods: {
    selectProject(projectId) {
      this.selectedProjectId = projectId;
    },
    showCreateProjectDialog() {
      this.dialogVisible = true;
    },
    createProject(newProject) {
      newProject.id = Date.now();
      newProject.tasks = [];
      this.projects.push(newProject);
      this.dialogVisible = false;
    }
  }
}
</script>