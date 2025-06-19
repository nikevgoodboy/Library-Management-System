// composables/useLanguage.ts
import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { Translations } from "../types";

const language: Ref<"en" | "km"> = ref("en");

const translations: Translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.books": "Books",
    "nav.category": "Category",
    "nav.students": "Students",
    "nav.borrowing": "Borrowing",
    "nav.logout": "Logout",
    "nav.welcome": "Welcome",
    "dashboard.title": "Dashboard",
    "dashboard.overdue": "Manage your library efficiently",
    "students.title": "Students List",
    "students.new": "New",
    "students.no": "No",
    "students.name": "Name",
    "students.id": "ID",
    "students.edit": "Edit",
    "students.action": "Action",
    "students.number": "Number",
    "students.add": "Add",
    "students.delete": "Delete",
    "students.BooksManagerment": "Books Management",
  },
  km: {
    "nav.dashboard": "ផ្ទាំងគ្រប់គ្រង",
    "nav.books": "សៀវភៅ",
    "nav.students": "សិស្ស",
    "nav.borrowing": "ការខ្ចី",
    "nav.logout": "ចាកចេញ",
    "nav.welcome": "សូមស្វាគមន៍",
    "dashboard.title": "ផ្ទាំងគ្រប់គ្រង",
    "dashboard.overdue": "គ្រប់គ្រងបណ្ណាល័យរបស់អ្នកឱ្យមានប្រសិទ្ធភាព",
    "students.title": "បញ្ជីសិស្ស",
    "students.new": "ថ្មី",
    "students.no": "លេខ",
    "students.name": "ឈ្មោះ",
    "students.id": "អត្តសញ្ញាណ",
    "students.edit": "កែសម្រួល",
    "students.action": "សកម្មភាព",
    "students.number": "លេខទំនាក់ទំនង",
    "students.add": "បន្ថែម",
    "students.delete": "លុប",
    "students.BooksManagerment": "ការគ្រប់គ្រងសៀវភៅ",
    "nav.category": "ប្រភេទ",
  },
};

export function useLanguage() {
  const setLanguage = (lang: "en" | "km"): void => {
    language.value = lang;
    localStorage.setItem("library_language", lang);
  };

  const t = (key: string): string => {
    return translations[language.value][key] || key;
  };

  // Initialize from localStorage
  const savedLanguage = localStorage.getItem("library_language");
  if (savedLanguage && (savedLanguage === "en" || savedLanguage === "km")) {
    language.value = savedLanguage as "en" | "km";
  }

  return {
    language: computed(() => language.value),
    setLanguage,
    t,
  };
}
