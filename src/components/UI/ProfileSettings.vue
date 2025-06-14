<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-window">
            <header class="modal-header">
                <h3>User settings</h3>
                <button class="close-btn" @click="close">✖</button>
            </header>
            <form submit.prevent="onSubmit" class="modal-body">
                <div class="form-row">
                    <label for="username">Username</label>
                    <input id="username" v-model="form.username" type="text" required>
                </div>
                <div class="form-row">
                    <label for="language">Language</label>
                    <select id="language" v-model="form.language">
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                <div class="form-row">
                    <label>
                        <input type="checkbox" v-model="form.darkMode" />
                        Dark theme
                    </label>
                </div>
            </form>
            <footer class="modal-footer">
                <button class="btn" @click="onSubmit">Save</button>
                <button class="btn btn-secondary" @click="close">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsModal",
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        initial: {
            type: Object,
            default: () => ({
                username: "Username",
                language: "ru",
                darkMode: false,
            }),
        },
    },
    data() {
        return {
            form: { ...this.initial },
        };
    },
    watch: {
        initial(newVal) {
            this.form = { ...newVal };
        },
    },
    methods: {
        onSubmit() {
            this.$emit("save", { ...this.form });
            this.close();
        },
        close() {
            this.$emit("close");
        },
    },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-window {
  background: #fff;
  border-radius: 6px;
  width: 360px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}
.modal-header,
.modal-footer {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-row {
  display: flex;
  flex-direction: column;
}
.form-row label {
  margin-bottom: 4px;
  font-size: 14px;
}
.form-row input,
.form-row select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-footer {
  border-top: none;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #007bff;
  color: white;
}
.btn-secondary {
  background: #ccc;
  color: #333;
}
.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>