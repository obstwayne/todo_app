import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useSettingsStore = defineStore("settings", () => {
  const username = ref("");
  const language = ref("en");
  const theme = ref(false);

  const fetchSettings = async (userId) => {
    const settingsRef = doc(db, "settings", userId);
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      username.value = data.username || "";
      language.value = data.language || "en";
      theme.value = data.theme || false;
    }
  };

  const saveSettings = async (userId) => {
    const settingsRef = doc(db, "settings", userId);
    await setDoc(settingsRef, {
      username: username.value,
      language: language.value,
      theme: theme.value,
    });
  };

  return { username, language, theme, fetchSettings, saveSettings };
});
