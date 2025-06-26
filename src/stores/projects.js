import { defineStore } from "pinia";
import { db } from "@/firebase";
import { ref, computed } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const useProjectsStore = defineStore("projects", () => {
  // state
  const projects = ref([]);
  const selectedProjectId = ref(null);

  // getters
  const filteredProjects = computed(() => (searchQuery) => {
    return projects.value.filter((project) =>
      project.title.toLowerCase().includes((searchQuery || "").toLowerCase())
    );
  });

  const selectedProject = computed(() => {
    return (
      projects.value.find((p) => p.numericId === selectedProjectId.value) ||
      null
    );
  });

  const selectedProjectTasks = computed(() => {
    const selectedProject = projects.value.find(
      (p) => p.numericId === selectedProjectId.value
    );
    return selectedProject && Array.isArray(selectedProject.tasks)
      ? selectedProject.tasks
      : [];
  });

  // actions
  const fetchProjects = () => {
    onSnapshot(
      collection(db, "projects"),
      (querySnapshot) => {
        projects.value = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          numericId: doc.data().id,
        }));
      },
      (error) => {
        console.error("Failed to fetch projects:", error);
      }
    );
  };

  const createProject = async (newProject) => {
    try {
      newProject.id = Date.now();
      newProject.tasks = [];
      await addDoc(collection(db, "projects"), newProject);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const updateProject = async (updatedProject) => {
    try {
      const projectDoc = projects.value.find(
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
  };

  const removeProject = async (projectId) => {
    try {
      const projectDoc = projects.value.find((p) => p.numericId === projectId);
      if (projectDoc) {
        await deleteDoc(doc(db, "projects", projectDoc.id));
        selectedProjectId.value = null; // remove selected project
      }
    } catch (error) {
      console.error("Failed to remove project:", error);
    }
  };
  const selectProject = (projectId) => {
    selectedProjectId.value = projectId;
  };

  const addTask = async (task) => {
    const project = selectedProject.value;
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
  };

  const updateTask = async (updatedTask) => {
    const project = selectedProject.value;
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
  };
  const removeTask = async (taskId) => {
    const project = selectedProject.value;
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
  };

  return {
    projects,
    selectedProjectId,
    filteredProjects,
    selectedProject,
    selectedProjectTasks,
    fetchProjects,
    createProject,
    updateProject,
    removeProject,
    selectProject,
    addTask,
    updateTask,
    removeTask,
  };
});
