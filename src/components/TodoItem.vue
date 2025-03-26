<template>
    <li class="p-4 bg-white rounded-md shadow-md hover:shadow-lg transition duration-200">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span @click="toggleTodo" class="cursor-pointer flex items-center">
            <i :class="todo.completed ? 'fas fa-check-circle text-green-500' : 'far fa-circle text-gray-400'"></i>
            <span class="ml-2 text-gray-700" :class="{ 'line-through text-gray-400': todo.completed }">{{ todo.text }}</span>
          </span>
        </div>
        <div class="space-x-2">
          <button @click="editTodo" class="text-blue-500 hover:text-blue-700 transition duration-200">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="removeTodo" class="text-red-500 hover:text-red-700 transition duration-200">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="mt-2">
        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{{ todo.status }}</span>
      </div>
    </li>
</template>

<script>
export default {
    name: 'TodoItem',
    props: {
        todo: Object,
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