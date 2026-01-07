import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear the auth user data immediately
      queryClient.setQueryData(["authUser"], null);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Force a hard redirect to landing page to avoid any routing conflicts
      window.location.href = "/";
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
