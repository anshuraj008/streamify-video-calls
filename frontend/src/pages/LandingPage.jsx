import { Link } from "react-router";
import { ShipWheelIcon, Video, MessageCircle, Globe, Users, Sparkles, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-black text-white" data-theme="forest">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-emerald-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <ShipWheelIcon className="size-10 text-emerald-400 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <span className="text-3xl font-bold font-mono bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent tracking-wider">
                Streamify
              </span>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="px-5 py-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg shadow-lg shadow-emerald-900/50 transition-all duration-300 hover:scale-105 hover:shadow-emerald-900/70">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-sm">
              <Sparkles className="size-4 text-emerald-400" />
              <span className="text-emerald-300">Connect. Learn. Grow Together.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Learn Languages Through
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                Real Conversations
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Connect with native speakers worldwide. Practice languages through video calls and messaging. 
              Make friends while mastering new languages.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold text-lg shadow-xl shadow-emerald-900/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-900/70 flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 border-2 border-emerald-600/50 hover:border-emerald-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-emerald-900/20">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-emerald-400">50+</div>
                <div className="text-sm text-gray-400">Languages</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-emerald-400">10K+</div>
                <div className="text-sm text-gray-400">Active Learners</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-emerald-400">1M+</div>
                <div className="text-sm text-gray-400">Conversations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-emerald-400">Streamify</span>?
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to master a new language</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-700/30 rounded-2xl hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
                <Video className="size-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Video Calls</h3>
              <p className="text-gray-400">Face-to-face conversations with native speakers in real-time</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-700/30 rounded-2xl hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
                <MessageCircle className="size-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Messaging</h3>
              <p className="text-gray-400">Chat anytime with friends and practice writing skills</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-700/30 rounded-2xl hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
                <Globe className="size-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Community</h3>
              <p className="text-gray-400">Connect with learners from every corner of the world</p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-700/30 rounded-2xl hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
                <Users className="size-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-400">AI-powered system finds perfect language exchange partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-900/40 via-green-900/40 to-emerald-900/40 border border-emerald-700/50 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-xl text-gray-300">
                Join thousands of language learners today. It's free to get started!
              </p>
              <Link to="/signup">
                <button className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold text-lg shadow-2xl shadow-emerald-900/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3">
                  Create Free Account
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-emerald-900/30 bg-black/20">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2026 Streamify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
