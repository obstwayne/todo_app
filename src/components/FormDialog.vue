<template>
    <div class="dialog">
        <div class="dialog__content">
            <h2 class="dialog-title">Create New Project</h2>
            <form @submit.prevent="createProject">
                <input type="text" v-model="newProject.title" placeholder="Project title" required
                    class="input-field" />
                <textarea v-model="newProject.description" placeholder="Project description"
                    class="textarea-field"></textarea>
                <div class="form-buttons">
                    <button type="submit" class="create-button">Create</button>
                    <button type="button" @click.stop="$emit('close')" class="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newProject: {
                title: '',
                description: '',
            },
        };
    },
    methods: {
        createProject() {
            this.$emit('create', { ...this.newProject });
            this.newProject.title = '';
            this.newProject.description = '';
        },
    }
}
</script>