import Link from "next/link";
import { Timestamp } from "../../components/Timestamp"; // ✅ Using your Timestamp component

export default async function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            AI-powered{" "}
            <span className="text-blue-600 dark:text-blue-400">
              social stories
            </span>{" "}
            <br className="hidden sm:block" />
            for neurodivergent learners
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Instantly create <strong>personalized</strong> social stories for
            children with autism and other neurodivergent learners.{" "}
            <strong>Designed for parents, therapists, and educators</strong>
            —powered by AI.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium">
                Get Started for Free
              </button>
            </Link>
            <Link href="#features">
              <button className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-md text-lg font-medium">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why NeuroTales?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Transform the way you create **social stories** with AI-driven
            assistance.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personalized AI Stories
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Generate **custom** social stories based on your child’s needs
                in **seconds**.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Visual Learning Support
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Integrated with **PECS images, Unsplash, and Cloudinary** to
                provide relevant visuals.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Download & Share
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Export your stories as **PDFs or PowerPoint slides** for offline
                use and easy sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trusted by Parents & Therapists
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                “NeuroTales has completely changed how I create social stories
                for my child!”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">
                - Sarah, Autism Parent
              </h4>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                “As a therapist, this saves me **hours**. AI suggestions are
                spot on!”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">
                - Dr. Emily, ABA Therapist
              </h4>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                “Absolutely love how fast and customizable it is for my
                students.”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">
                - Mike, Special Ed Teacher
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-info-700 text-white text-center">
        <h2 className="text-3xl font-bold">Start Creating Stories Today</h2>
        <p className="mt-4 text-lg">
          Sign up and generate your first story in seconds.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md text-lg font-medium">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer with Timestamp Component */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center text-gray-500 dark:text-gray-400">
          <p>
            © <Timestamp /> NeuroTales. Built to empower neurodivergent
            learners.
          </p>
        </div>
      </footer>
    </div>
  );
}
