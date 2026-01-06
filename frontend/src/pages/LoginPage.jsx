import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message || error.message || "An error occurred"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline">
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ANIMATED SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 items-center justify-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
            
            {/* Animated Lines */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="max-w-md p-8 relative z-10">
            {/* Animated Icon Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0.2s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0.4s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0.6s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0.8s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="text-center space-y-3 text-white">
              <h2 className="text-2xl font-bold">Connect with language partners worldwide</h2>
              <p className="text-blue-100">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
