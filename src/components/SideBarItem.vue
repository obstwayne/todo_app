<template>
  <div>
    <div class="sidebar" :class="{ 'sidebar--open': props.isOpen }">
      <div class="sidebar-header">
        <h3>Settings</h3>
        <button class="close-btn" @click="emit('close')">✖</button>
      </div>
      <div class="sidebar-content">
        <!-- content -->
        <p>Some content</p>
      </div>

      <!-- real settings modal -->
      <div class="sidebar-footer">
        <div class="sidebar-settings">
          <button class="settings-modal-btn" @click="show = true">Profile Settings</button>
          <ProfileSettings :visible="show" :initial="userSettings" @save="onSave" @close="show = false" />
        </div>
      </div>
    </div>

    <!-- page hover -->
    <div v-if="props.isOpen" class="sidebar-overlay" @click="emit('close')">
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProfileSettings from './UI/ProfileSettings.vue';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

//emits
const emit = defineEmits(['close']);

const show = ref(false);

// setup
const settingsStore = useSettingsStore();

const userSettings = computed(() => ({
  username: settingsStore.username || 'username',
  language: settingsStore.language,
  darkMode: settingsStore.darkMode
}));

// methods
const onSave = async (updated) => {
  settingsStore.username = updated.username;
  settingsStore.language = updated.language;
  settingsStore.theme = updated.darkMode;
  await settingsStore.saveSettings('default');
  show.value = false;
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -300px;
  width: 280px;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
  transition: left .3s ease;
  z-index: 1000;

  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 10px;
}

.sidebar--open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-content {
  overflow-y: auto;
}

.sidebar-footer {
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.settings-modal-btn {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: background-color .2s;
}

.settings-modal-btn:hover {
  background-color: #e0e0e0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.sidebar-content {
  margin-top: 20px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
</style>