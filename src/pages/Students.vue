<template>
  <main class="flex-1 p-4 sm:p-8 bg-white min-h-screen mt-0">
    <!-- Header -->
    <h1
      class="text-2xl sm:text-3xl font-semibold text-gray-800 animate-fade-in"
    >
      {{ t("nav.dashboard") }}
    </h1>
    <p class="text-gray-500 mb-4 sm:mb-6">
      {{ t("dashboard.overview") }}
    </p>

    <!-- Add Student Button -->
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in"
      >
        {{ t("students.title") }}
      </h2>
      <button
        @click="openAddModal"
        class="px-4 sm:px-5 py-1 sm:py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        New
      </button>
    </div>

    <!-- Modal for Adding/Editing Student -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-form-slide"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ editingStudent ? "Edit Student" : "Add New Student" }}
        </h3>
        <form @submit.prevent="submitStudent">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Name</label
              >
              <input
                v-model="newStudent.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >ID Card</label
              >
              <input
                v-model="newStudent.id_card"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.id_card" class="text-red-500 text-xs mt-1">
                {{ errors.id_card }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Contact Number</label
              >
              <input
                v-model="newStudent.contact_number"
                required
                type="tel"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.contact_number" class="text-red-500 text-xs mt-1">
                {{ errors.contact_number }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Registration Date</label
              >
              <input
                v-model="newStudent.registration_date"
                required
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p
                v-if="errors.registration_date"
                class="text-red-500 text-xs mt-1"
              >
                {{ errors.registration_date }}
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              {{ editingStudent ? "Update Student" : "Add Student" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Students Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs sm:text-sm">
        <thead>
          <tr class="bg-slate-800 text-white text-left">
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.no") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.name") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.id") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Contact Number
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Registration Date
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.add") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.edit") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.delete") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in students"
            :key="student.id"
            :class="[
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              'animate-row-slide',
              'hover:bg-gray-100 transition-colors duration-200',
              clickedRow === index ? 'bg-blue-100' : '',
            ]"
            @click="handleRowClick(index)"
          >
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ index + 1 }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.name }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.id_card }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.contact_number }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.registration_date }}
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="openAddModal"
                class="bg-orange-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-orange-500 transition-colors duration-300"
              >
                {{ t("students.add") }}
              </button>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="openEditModal(index)"
                class="bg-blue-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300"
              >
                Edit
              </button>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="deleteStudent(index)"
                class="bg-red-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-red-500 transition-colors duration-300"
              >
                {{ t("students.delete") }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end mt-4 sm:mt-6 space-x-2 sm:space-x-3">
      <button
        v-for="page in 3"
        :key="page"
        class="border px-3 sm:px-4 py-1 sm:py-2 text-blue-600 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
      >
        {{ page }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLanguage } from "../composables/useLanguage";
import { useToast } from "vue-toastification";

interface Student {
  id: string;
  name: string;
  id_card: string;
  contact_number: string;
  registration_date: string;
}

const { t } = useLanguage();
const toast = useToast();

const students = ref<Student[]>([
  {
    id: "22345-1",
    name: "Kevin",
    id_card: "STU001",
    contact_number: "0963559607",
    registration_date: "2025-01-15",
  },
  {
    id: "5151-7",
    name: "Zeru",
    id_card: "STU002",
    contact_number: "0886886775",
    registration_date: "2025-02-10",
  },
  {
    id: "5566-2",
    name: "Chang",
    id_card: "STU003",
    contact_number: "0123456789",
    registration_date: "2025-03-05",
  },
  {
    id: "7788-9",
    name: "Than",
    id_card: "STU004",
    contact_number: "0987654321",
    registration_date: "2025-04-20",
  },
]);

const newStudent = ref<Partial<Student>>({
  name: "",
  id_card: "",
  contact_number: "",
  registration_date: "",
});

const errors = ref<Partial<Record<keyof Student, string>>>({
  name: "",
  id_card: "",
  contact_number: "",
  registration_date: "",
});

const showModal = ref(false);
const clickedRow = ref<number | null>(null);
const editingStudent = ref<Student | null>(null);
const isFormValid = ref(false);

const validateForm = () => {
  errors.value = {
    name: newStudent.value.name ? "" : "Name is required",
    id_card: newStudent.value.id_card
      ? students.value.some(
          (s) =>
            s.id_card === newStudent.value.id_card &&
            s.id !== (editingStudent.value?.id || "")
        )
        ? "ID Card must be unique"
        : ""
      : "ID Card is required",
    contact_number: newStudent.value.contact_number
      ? /^\d{10}$/.test(newStudent.value.contact_number)
        ? ""
        : "Contact number must be 10 digits"
      : "Contact number is required",
    registration_date: newStudent.value.registration_date
      ? ""
      : "Registration date is required",
  };

  isFormValid.value = Object.values(errors.value).every((error) => !error);
};

const openAddModal = () => {
  editingStudent.value = null;
  newStudent.value = {
    name: "",
    id_card: "",
    contact_number: "",
    registration_date: "",
  };
  errors.value = {
    name: "",
    id_card: "",
    contact_number: "",
    registration_date: "",
  };
  isFormValid.value = false;
  showModal.value = true;
};

const openEditModal = (index: number) => {
  editingStudent.value = { ...students.value[index] };
  newStudent.value = { ...editingStudent.value };
  validateForm();
  showModal.value = true;
};

const submitStudent = () => {
  if (!isFormValid.value) return;

  if (editingStudent.value) {
    // Update existing student
    const index = students.value.findIndex(
      (s) => s.id === editingStudent.value!.id
    );
    if (index !== -1) {
      students.value[index] = {
        ...newStudent.value,
        id: editingStudent.value.id,
      } as Student;
      toast.success("Student updated successfully!");
    }
  } else {
    // Add new student
    const id = `${students.value.length + 1}-${Math.floor(
      Math.random() * 1000
    )}`;
    students.value.push({
      ...newStudent.value,
      id,
    } as Student);
    toast.success("Student added successfully!");
  }

  newStudent.value = {
    name: "",
    id_card: "",
    contact_number: "",
    registration_date: "",
  };
  showModal.value = false;
  editingStudent.value = null;
};

const deleteStudent = (index: number) => {
  students.value.splice(index, 1);
  toast.success("Student deleted successfully!");
};

const handleRowClick = (index: number) => {
  clickedRow.value = index;
  setTimeout(() => {
    clickedRow.value = null;
  }, 300); // Reset after 300ms for visual feedback
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-form-slide {
  animation: slide-in 0.6s ease-out;
}

.animate-row-slide {
  animation: slide-in 0.4s ease-out;
}

/* Ensure table is responsive */
table {
  width: 100%;
  table-layout: auto;
}

/* Improve readability on small screens */
@media (max-width: 640px) {
  table {
    font-size: 0.75rem; /* Smaller text on mobile */
  }
  th,
  td {
    min-width: 80px; /* Prevent columns from collapsing too much */
  }
}

/* Custom backdrop blur for Tailwind */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* For Safari compatibility */
}
</style>
