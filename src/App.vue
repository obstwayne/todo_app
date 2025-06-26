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

            <div class="w-5 h-5 text-gray-600 icon">
              <svg width="18" height="18" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="26" height="26" rx="8" fill="none" /><svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 26 26" fill="#ffffff" x="0" y="0" width="26" height="26">
                  <path fill="#ffffff"
                    d="M10 .188A9.812 9.812 0 0 0 .187 10A9.812 9.812 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.824 1.824 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188zM10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM4.937 7.469a5.446 5.446 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.516 5.516 0 0 0 3.156-1a7.166 7.166 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312z" />
                </svg>
              </svg>
            </div>

            <input type="text" v-model="searchQuery" placeholder="Write some name of project" class="search-input">
          </div>
        </div>
      </div>

      <div class="left-panel__bottom">
        <div class="projects-title-and-add-button">
          <h2 class="projects-title">Projects ({{ projectsCount }})</h2>
          <button @click.stop="showCreateProjectDialog" class="create-button">Create New Project</button>
        </div>
        <div class="projects-grid">
          <project-card v-for="project in projectsStore.filteredProjects(searchQuery).slice(0, 8)" :key="project.id"
            :project="project" @select="projectsStore.selectProject(project.numericId)" class="">
          </project-card>
          <button v-if="projectsStore.filteredProjects(searchQuery).length > 0" class="view-all-projects"
            @click="showAllProjects = true">Show {{ projectsCount - 8 }}+ more</button>
        </div>
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
    <modal-form :visible="dialogVisible" title="Create New Project" :fields="projectFields"
      :submit-button-text="'Create'" @submit="createProject" @close="dialogVisible = false">
    </modal-form>

    <projects-list :visible="showAllProjects" :projects="projectsStore.projects" @close="showAllProjects = false"
      @select="selectProjectFromModal"></projects-list>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProjectsStore } from './stores/projects';
import { useSettingsStore } from './stores/settings';
import ProjectCard from './components/ProjectCard.vue';
import TaskPanel from './components/TaskPanel.vue';
// import FormDialog from './components/FormDialog.vue';
import ModalForm from './components/UI/ModalForm.vue';
import SideBarItem from './components/SideBarItem.vue';
import ProjectsList from './components/ProjectsList.vue';

const searchQuery = ref('');
const dialogVisible = ref(false);
const projectFields = ref([
  { name: 'title', label: 'Project Title', type: 'text', placeholder: 'Enter project title', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: false },
]);
const sidebarOpen = ref(false);
const showAllProjects = ref(false);

// setup
const projectsStore = useProjectsStore();
const settingsStore = useSettingsStore();

//computed
const projectsCount = computed(() => projectsStore.projects.length)

// methods
const showCreateProjectDialog = () => {
  dialogVisible.value = true;
};
const createProject = async (newProject) => {
  await projectsStore.createProject(newProject);
  dialogVisible.value = false;
};

const selectProjectFromModal = (numericId) => {
  projectsStore.selectProject(numericId);
  showAllProjects.value = false;
}

onMounted(async () => {
  try {
    await Promise.all([
      projectsStore.fetchProjects(),
      settingsStore.fetchSettings('default'),
    ]);
  } catch (error) {
    console.error('Error when load data to onMounted: ', error);
  }

});

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

.view-all-projects {
  padding: 2rem;
  border-radius: 0.5rem;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  border: 1px solid #989ea5;
  background-color: #333;
  transition: background-color 0.2s;
}

.view-all-projects:hover {
  background-color: rgb(40, 167, 103);
}
</style>