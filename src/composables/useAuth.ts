import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { User } from "../types";
import axios from "axios";

const user: Ref<User | null> = ref(null);
const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value);
const token = ref(localStorage.getItem("token") || "");

export function useAuth() {
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      // Match the backend response structure
      const { token, user: userData } = response.data;

      // Ensure userData matches the User type with full_name
      const formattedUser: User = {
        id: userData.id,
        full_name: userData.full_name,
        username: userData.username,
        role: userData.role,
      };

      // Store token and user data
      localStorage.setItem("library_user", JSON.stringify(formattedUser));
      localStorage.setItem("token", token);
      user.value = formattedUser;

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = (): void => {
    user.value = null;
    localStorage.removeItem("library_user");
    localStorage.removeItem("token");
  };

  const checkAuth = (): void => {
    const savedUser = localStorage.getItem("library_user");
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser) as User;
      } catch (error) {
        console.error("Error parsing saved user:", error);
        logout();
      }
    }
  };

  if (!user.value) {
    checkAuth();
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
    checkAuth,
    token: computed(() => token.value),
  };
  
}