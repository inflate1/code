import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { MockModeProvider } from "./hooks/useMockMode";
import FileClerkAIDashboard from "./components/FileClerkAIDashboard";
import { Toaster } from "./components/ui/toaster";

function App() {
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