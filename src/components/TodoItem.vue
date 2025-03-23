<template>
    <li>
        <span @click="toggleTodo" :style="{ textDecoration: todo.completed ? 'line-though' : 'none' }">{{ todo.text}}</span>
        <!--------->
        <button @click="editTodo">Edit</button>
        <button @click="removeTodo">Remove</button>
    </li>
</template>

<script>
export default {
    name: 'TodoItem',
    props: {
        todo: Object,
        index: Number
    },
    methods: {
        toggleTodo() {
            this.$emit('toggle-todo', this.index);
        },
        editTodo() {
            this.$emit('edit-todo', this.index);
        },
        removeTodo() {
            this.$emit('remove-todo', this.index);
        },
    },
}
</script>