<template>
  <main class="flex-1 p-4 sm:p-8 bg-white min-h-screen mt-0">
    <!-- Header -->
    <h1
      class="text-2xl sm:text-3xl font-semibold text-gray-800 animate-fade-in"
    >
      Borrowing Management
    </h1>
    <p class="text-gray-500 mb-4 sm:mb-6">Manage book loans</p>

    <!-- Add Loan Button -->
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in"
      >
        Borrowed Books List
      </h2>
      <button
        @click="openAddModal"
        class="px-4 sm:px-5 py-1 sm:py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        New
      </button>
    </div>

    <!-- Modal for Adding Loan -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-form-slide"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Add New Loan</h3>
        <form @submit.prevent="handleBorrow">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Student</label
              >
              <select
                v-model="newLoan.studentId"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @change="validateForm"
              >
                <option value="" disabled>Select a student</option>
                <option
                  v-for="student in students"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.name }} ({{ student.id_card }})
                </option>
              </select>
              <p v-if="errors.studentId" class="text-red-500 text-xs mt-1">
                {{ errors.studentId }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Book</label
              >
              <select
                v-model="newLoan.bookId"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @change="validateForm"
              >
                <option value="" disabled>Select a book</option>
                <option
                  v-for="book in availableBooks"
                  :key="book.id"
                  :value="book.id"
                >
                  {{ book.title }} ({{ book.author }})
                </option>
              </select>
              <p v-if="errors.bookId" class="text-red-500 text-xs mt-1">
                {{ errors.bookId }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Due Date</label
              >
              <input
                v-model="newLoan.dueDate"
                type="date"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.dueDate" class="text-red-500 text-xs mt-1">
                {{ errors.dueDate }}
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
              Borrow Book
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Borrowed Books Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs sm:text-sm">
        <thead>
          <tr class="bg-slate-800 text-white text-left">
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">No</th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Student
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Book
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Due Date
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Status
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Add
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Return
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(loan, index) in loans"
            :key="loan.id"
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
              {{ getStudentName(loan.studentId) }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ getBookTitle(loan.bookId) }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ loan.dueDate }}
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <span
                :class="{
                  'bg-green-100 text-green-800': loan.status === 'Borrowed',
                  'bg-gray-100 text-gray-800': loan.status === 'Returned',
                }"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="openAddModal"
                class="bg-orange-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-orange-500 transition-colors duration-300"
              >
                Add
              </button>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                v-if="loan.status === 'Borrowed'"
                @click.stop="returnBook(index)"
                class="bg-green-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-green-500 transition-colors duration-300"
              >
                Return
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
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import { useLibraryStore } from "../stores/library";

interface Loan {
  id: string;
  studentId: string;
  bookId: string;
  dueDate: string;
  status: "Borrowed" | "Returned";
}

interface NewLoan {
  studentId: string;
  bookId: string;
  dueDate: string;
}

const toast = useToast();
const store = useLibraryStore();

const loans = ref<Loan[]>([
  {
    id: "L001",
    studentId: "22345-1",
    bookId: "B001",
    dueDate: "2025-06-21",
    status: "Borrowed",
  },
  {
    id: "L002",
    studentId: "5151-7",
    bookId: "B002",
    dueDate: "2025-06-25",
    status: "Borrowed",
  },
]);

const newLoan = ref<NewLoan>({
  studentId: "",
  bookId: "",
  dueDate: "",
});

const errors = ref<Partial<Record<keyof NewLoan, string>>>({
  studentId: "",
  bookId: "",
  dueDate: "",
});

const showModal = ref(false);
const clickedRow = ref<number | null>(null);
const isFormValid = ref(false);

// Access students and books from store
const students = computed(() => store.students);
const books = computed(() => store.books);
const availableBooks = computed(() =>
  books.value.filter(
    (book) =>
      book.available &&
      !loans.value.some(
        (loan) => loan.bookId === book.id && loan.status === "Borrowed"
      )
  )
);

const validateForm = () => {
  const today = new Date().toISOString().split("T")[0];
  errors.value = {
    studentId: newLoan.value.studentId
      ? students.value.some((s) => s.id === newLoan.value.studentId)
        ? ""
        : "Student does not exist"
      : "Student is required",
    bookId: newLoan.value.bookId
      ? books.value.some((b) => b.id === newLoan.value.bookId && b.available)
        ? ""
        : "Book is not available or does not exist"
      : "Book is required",
    dueDate: newLoan.value.dueDate
      ? newLoan.value.dueDate >= today
        ? ""
        : "Due date must be today or later"
      : "Due date is required",
  };
  isFormValid.value = Object.values(errors.value).every((error) => !error);
};

const openAddModal = () => {
  newLoan.value = { studentId: "", bookId: "", dueDate: "" };
  errors.value = { studentId: "", bookId: "", dueDate: "" };
  isFormValid.value = false;
  showModal.value = true;
};

const handleBorrow = () => {
  if (!isFormValid.value) return;

  const id = `L${loans.value.length + 1}-${Math.floor(Math.random() * 1000)}`;
  loans.value.push({
    id,
    studentId: newLoan.value.studentId,
    bookId: newLoan.value.bookId,
    dueDate: newLoan.value.dueDate,
    status: "Borrowed",
  });
  store.setBookAvailability(newLoan.value.bookId, false); // Mark book as unavailable
  toast.success("Loan added successfully!");
  newLoan.value = { studentId: "", bookId: "", dueDate: "" };
  showModal.value = false;
};

const returnBook = (index: number) => {
  loans.value[index].status = "Returned";
  store.setBookAvailability(loans.value[index].bookId, true); // Mark book as available
  toast.success("Book returned successfully!");
};

const getStudentName = (studentId: string) => {
  const student = students.value.find((s) => s.id === studentId);
  return student ? `${student.name} (${student.id_card})` : "Unknown";
};

const getBookTitle = (bookId: string) => {
  const book = books.value.find((b) => b.id === bookId);
  return book ? `${book.title} (${book.author})` : "Unknown";
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
