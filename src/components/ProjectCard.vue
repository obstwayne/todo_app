<template>
    <div class="project-card"
        @click="$emit('select', project.id)">
        <div>{{ project.title }}</div>
    </div>
</template>

<script>
export default {
    props: {
        project: {
            type: Object,
            required: true,
        }
    },
}
</script>