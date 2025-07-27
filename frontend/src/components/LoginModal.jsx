import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginModal = ({ onClose }) => {
  const [credentials, setCredentials] = useState({
    username: 'demo_user',
    password: 'demo_password'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, createSession } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(credentials);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await createSession();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Welcome to FileClerkAI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Access</CardTitle>
              <CardDescription>
                Get instant access to explore FileClerkAI features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDemoAccess}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  'Try Demo'
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or login with credentials
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Login</CardTitle>
              <CardDescription>
                Use demo credentials or your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="demo_user"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="demo_password"
                    required
                  />
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Username: <code className="bg-gray-100 px-1 rounded">demo_user</code></p>
            <p>Password: <code className="bg-gray-100 px-1 rounded">demo_password</code></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;