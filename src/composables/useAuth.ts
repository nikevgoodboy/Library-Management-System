// composables/useAuth.ts
import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { User, AuthCredential } from "../types";

const user: Ref<User | null> = ref(null);
const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value);

// Demo credentials
const ADMIN_CREDENTIALS: AuthCredential[] = [
  { username: "admin", password: "admin123", id: "1", role: "admin" },
  { username: "librarian", password: "lib123", id: "2", role: "librarian" },
];

export function useAuth() {
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log("Login attempt with username:", username);

    const foundUser = ADMIN_CREDENTIALS.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      };
      user.value = userData;
      localStorage.setItem("library_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = (): void => {
    user.value = null;
    localStorage.removeItem("library_user");
  };

  const checkAuth = (): void => {
    const savedUser = localStorage.getItem("library_user");
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser) as User;
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("library_user");
      }
    }
  };

  // Initialize on first use
  if (!user.value) {
    checkAuth();
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
