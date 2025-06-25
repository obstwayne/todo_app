<template>
    <div v-if="props.visible" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>All Projects</h2>
                <button class="close-btn" @click="emit('close')">Close</button>
            </div>
            <div class="modal-body">
                <div class="project-list">
                <div class="project-card" v-for="project in props.projects" :key="project.id"
                    @click="emit('select', project.numericId); emit('close')">
                    
                        <div>{{ project.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    projects: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['close', 'select']);


</script>

<style scoped>
.projects-list {
    display: grid;
    grid-template-columns: repeat(3, 8rem);
    gap: 2rem;
    /* margin-top: 2rem; */
    justify-content: center;
}

.project-card {
    padding: 2rem;
    border-radius: 0.5rem;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    border: 1px solid #989ea5;
    border-radius: 20px;
    background-color: #333;
    transition: background-color 0.2s;

}

.project-card:hover {
    background-color: teal;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
    padding: 1rem;
}
</style>