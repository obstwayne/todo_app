<template>
    <div class="project-card" @click="$emit('select', project.id)">
        <div>{{ props.project.title }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    project: {
        type: Object,
        required: true,
    }
});
</script>