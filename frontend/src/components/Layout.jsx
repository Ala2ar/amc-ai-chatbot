import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-2 px-4 fixed w-full top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo placeholder - replace src with actual AMC logo */}
            <img
              src="/amc-logo.png"
              alt="AMC Logo"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-800">ቻት ቦት</h1>
              <p className="text-sm text-gray-600">Chat Bot</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm py-2 px-4 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Amhara Media Corporation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 