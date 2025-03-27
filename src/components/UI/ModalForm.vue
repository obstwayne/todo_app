<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>{{ title }}</h2>
            <form @submit.prevent="handleSubmit">
                <div v-for="(field, index) in fields" :key="index" class="form-field">
                    <label :for="field.name">{{ field.label }}</label>
                    <input v-if="field.type === 'text'" :id="field.name" v-model="formData[field.name]"
                        :type="field.type" :placeholder="field.placeholder" :required="field.required"
                        class="input-field" />
                    <textarea v-if="field.type === 'textarea'" :id="field.name" v-model="formData[field.name]"
                        :placeholder="field.placeholder" :required="field.required" class="textarea-field"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="submit-button">{{ submitButtonText }}</button>
                    <button type="button" @click="close" class="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            default: 'Modal',
        },
        fields: {
            type: Array,
            required: true,
        },
        initialData: {
            type: Object,
            default: () => ({}),
        },
        submitButtonText: {
            type: String,
            default: 'Submit',
        },
    },
    data() {
        return {
            formData: { ...this.initialData },
        }
    },
    watch: {
        initialData(newData) {
            this.formData = { ...newData };
        },
        visible(newVisible) {
            if (newVisible) {
                this.formData = { ...this.initialData };
            }
        },
    },
    methods: {
        handleSubmit() {
            this.$emit('submit', this.formData);
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
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
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.textarea-field {
  height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #007bff;
  color: white;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}
</style>