import { defineStore } from "pinia";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    selectedProjectId: null,
  }),
  getters: {
    filteredProjects: (state) => (searchQuery) => {
      return state.projects.filter((project) =>
        project.title.toLowerCase().includes((searchQuery || "").toLowerCase())
      );
    },
    selectedProject: (state) => {
        return state.projects.find((p) => p.numericId === state.selectedProjectId) || null;
      },
      selectedProjectTasks: (state) => {
        const selectedProject = state.projects.find(
          (p) => p.numericId === state.selectedProjectId
        );
        return selectedProject && Array.isArray(selectedProject.tasks)
          ? selectedProject.tasks
          : [];
      },
    },
  actions: {
    async fetchProjects() {
      onSnapshot(
        collection(db, "projects"),
        (querySnapshot) => {
          this.projects = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            numericId: doc.data().id,
          }));
        },
        (error) => {
          console.error("Failed to fetch projects:", error);
        }
      );
    },
    async createProject(newProject) {
      try {
        newProject.id = Date.now();
        newProject.tasks = [];
        await addDoc(collection(db, "projects"), newProject);
        // this.projects.push({ ...newProject, id: docRef.id });
      } catch (error) {
        console.error("Failed to create project:", error);
      }
    },
    async updateProject(updatedProject) {
      try {
        const projectDoc = this.projects.find(
          (p) => p.numericId === updatedProject.numericId
        );
        if (projectDoc) {
          await updateDoc(doc(db, "projects", projectDoc.id), {
            title: updatedProject.title,
            description: updatedProject.description,
            id: updatedProject.numericId,
            tasks: projectDoc.tasks,
          });
        }
      } catch (error) {
        console.error("Failed to update project:", error);
      }
    },
    async removeProject(projectId) {
        try {
          const projectDoc = this.projects.find((p) => p.numericId === projectId);
          if (projectDoc) {
            await deleteDoc(doc(db, "projects", projectDoc.id));
            this.selectedProjectId = null; // Сбрасываем выбранный проект
          }
        } catch (error) {
          console.error("Failed to remove project:", error);
        }
      },
    selectProject(projectId) {
      this.selectedProjectId = projectId;
    },
    async addTask(task) {
      const project = this.selectedProject;
      if (project) {
        project.tasks.push(task);
        try {
          await updateDoc(doc(db, "projects", project.id), {
            tasks: project.tasks,
          });
        } catch (error) {
          console.error("Failed to add task:", error);
        }
      }
    },
    async updateTask(updatedTask) {
      const project = this.selectedProject;
      if (project) {
        const index = project.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          project.tasks[index] = updatedTask;
          try {
            await updateDoc(doc(db, "projects", project.id), {
              tasks: project.tasks,
            });
          } catch (error) {
            console.error("Failed to update task:", error);
          }
        }
      }
    },
    async removeTask(taskId) {
      const project = this.selectedProject;
      if (project) {
        project.tasks = project.tasks.filter((task) => task.id !== taskId);
        try {
          await updateDoc(doc(db, "projects", project.id), {
            tasks: project.tasks,
          });
        } catch (error) {
          console.error("Failed to remove task:", error);
        }
      }
    },
  },
});
