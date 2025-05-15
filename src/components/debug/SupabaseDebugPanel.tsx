
import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseClientStatus, testSupabaseManualFetch } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const SupabaseDebugPanel = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<'unknown' | 'authenticated' | 'unauthenticated'>('unknown');
  const [dbConnectivity, setDbConnectivity] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSessionInfo(data);
      setAuthStatus(data.session ? 'authenticated' : 'unauthenticated');
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthStatus('unauthenticated');
    }
  };
  
  const runDiagnosticTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Check client configuration
      setTestResults(prev => [...prev, { name: 'Client Configuration', status: 'running' }]);
      const clientOk = checkSupabaseClientStatus();
      setTestResults(prev => prev.map(t => t.name === 'Client Configuration' ? 
        { ...t, status: clientOk ? 'success' : 'error' } : t));
      
      // Test 2: Auth session test
      setTestResults(prev => [...prev, { name: 'Auth Session', status: 'running' }]);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      setTestResults(prev => prev.map(t => t.name === 'Auth Session' ? 
        { ...t, status: sessionError ? 'error' : 'success', details: sessionError || `Session: ${sessionData.session ? 'Active' : 'None'}` } : t));
      
      // Test 3: Database connection test
      setTestResults(prev => [...prev, { name: 'Database Connectivity', status: 'running' }]);
      try {
        const { data: countData, error: countError } = await supabase
          .from('tournaments')
          .select('count(*)', { count: 'exact', head: true });
        
        setTestResults(prev => prev.map(t => t.name === 'Database Connectivity' ? 
          { ...t, status: countError ? 'error' : 'success', details: countError || countData } : t));
          
        setDbConnectivity(countError ? 'error' : 'success');
      } catch (dbError) {
        setTestResults(prev => prev.map(t => t.name === 'Database Connectivity' ? 
          { ...t, status: 'error', details: dbError } : t));
        setDbConnectivity('error');
      }
      
      // Test 4: Manual fetch test
      setTestResults(prev => [...prev, { name: 'Manual Fetch', status: 'running' }]);
      const manualResult = await testSupabaseManualFetch();
      setTestResults(prev => prev.map(t => t.name === 'Manual Fetch' ? 
        { ...t, status: manualResult.error ? 'error' : 'success', details: manualResult } : t));
    } catch (error) {
      console.error("Error running diagnostic tests:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Connection Diagnostics</span>
          <div className="flex gap-2">
            {authStatus === 'authenticated' && (
              <Badge variant="outline" className="bg-green-50">Authenticated</Badge>
            )}
            {authStatus === 'unauthenticated' && (
              <Badge variant="outline" className="bg-yellow-50">Not authenticated</Badge>
            )}
            {dbConnectivity === 'success' && (
              <Badge variant="outline" className="bg-green-50">Database Connected</Badge>
            )}
            {dbConnectivity === 'error' && (
              <Badge variant="outline" className="bg-red-50">Database Error</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Use this panel to diagnose Supabase connection issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Session Status</h3>
              <p className="text-sm text-gray-500">
                {authStatus === 'authenticated' 
                  ? `Logged in as: ${sessionInfo?.session?.user?.email || 'Unknown user'}`
                  : 'Not logged in'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Supabase URL</h3>
              <p className="text-sm text-gray-500 truncate">{supabase.supabaseUrl}</p>
            </div>
          </div>
          
          {testResults.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="test-results">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>Test Results</span>
                    <span className="text-xs">
                      ({testResults.filter(t => t.status === 'success').length}/{testResults.length} passed)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {testResults.map((test, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {test.status === 'running' && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
                          {test.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {test.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          <span>{test.name}</span>
                        </div>
                        <Badge variant={
                          test.status === 'running' ? 'outline' :
                          test.status === 'success' ? 'secondary' :
                          'destructive'
                        }>
                          {test.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="test-details">
                        <AccordionTrigger>Details</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(testResults, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={checkAuthStatus}
          variant="outline"
        >
          Check Auth
        </Button>
        <Button 
          onClick={runDiagnosticTests} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Diagnostic Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseDebugPanel;
