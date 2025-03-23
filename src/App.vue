<template>
  <div id="app">
    <h1>Todo app</h1>
    <form @submit.prevent="addTodo">
      <input type="text" v-model="newTodo" placeholder="Add task" required />
      <button type="submit">{{ editIndex !== null ? 'Save' : 'Add' }}</button>
    </form>
    <ul>
      <todo-item v-for="(todo, index) in todos" :key="index" :todo="todo" :index="index" @toggle-todo="toggleTodo"
        @edit-todo="startEditTodo" @removeTodo="removeTodo" />
    </ul>
  </div>
</template>

<script>
import TodoItem from './components/TodoItem.vue';

export default {
  name: 'App',
  components: {
    TodoItem
  },
  data() {
    return {
      newTodo: '',
      todos: [],
      editIndex: null
    };
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim() !== '') {
        if (this.editIndex !== null) {
          this.todos[this.editIndex].text = this.newTodo;
          this.editIndex = null;
        } else {
          this.todos.push({ text: this.newTodo, completed: false });
        }
        this.newTodo = '';
        this.saveTodos();
      }
    },
    toggleTodo(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodos();
    },
    startEditTodo(index) {
      this.newTodo = this.todos[index].text;
      this.editIndex = index;
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
      this.saveTodos();
    },
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    loadTodos() {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
    },
  },
  created() {
    this.loadTodos();
  }
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
