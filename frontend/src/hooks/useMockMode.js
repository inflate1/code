import { useState, useEffect, useContext, createContext } from 'react';

const MockModeContext = createContext();

export const useMockMode = () => {
  const context = useContext(MockModeContext);
  if (!context) {
    throw new Error('useMockMode must be used within a MockModeProvider');
  }
  return context;
};

export const MockModeProvider = ({ children }) => {
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check for mock mode query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mockParam = urlParams.get('mock');
    
    if (mockParam === 'true') {
      setIsMockMode(true);
    }
  }, []);

  const toggleMockMode = () => {
    setIsMockMode(!isMockMode);
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (!isMockMode) {
      url.searchParams.set('mock', 'true');
    } else {
      url.searchParams.delete('mock');
    }
    window.history.replaceState({}, '', url);
  };

  return (
    <MockModeContext.Provider value={{ isMockMode, toggleMockMode }}>
      {children}
    </MockModeContext.Provider>
  );
};