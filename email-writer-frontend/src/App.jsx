import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import EmailGenerator from './components/EmailGenerator';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
          },
        }} 
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Email Writer
              </h1>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Draft emails effortlessly
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Tell us what you want to say, choose your tone, and let our AI handle the rest.
          </p>
        </div>
        
        <EmailGenerator />
      </main>
      
      {/* Footer */}
      <footer className="mt-auto py-8">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Powered by Spring Boot & React &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
