import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { MockModeProvider } from "./hooks/useMockMode";
import FileClerkAIDashboard from "./components/FileClerkAIDashboard";
import MockModeDemo from "./components/MockModeDemo";
import { Toaster } from "./components/ui/toaster";

function App() {
  // Check if we should show the demo
  const urlParams = new URLSearchParams(window.location.search);
  const showDemo = urlParams.get('demo') === 'true';

  if (showDemo) {
    return (
      <div className="App">
        <MockModeDemo />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="App">
      <MockModeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<FileClerkAIDashboard />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </MockModeProvider>
    </div>
  );
}

export default App;