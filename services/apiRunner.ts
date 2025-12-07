import { ApiDefinition } from '../types';

interface ExecutionResult {
  success: boolean;
  data: any;
  status: number;
  duration: number;
  source: 'Live' | 'Mock';
}

export const runApiRequest = async (
  api: ApiDefinition,
  userKey?: string
): Promise<ExecutionResult> => {
  const startTime = performance.now();
  
  // Safety check: If auth is required but no key provided, return Mock immediately
  if (api.authRequired && !userKey) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      data: api.mockResponse,
      status: 200,
      duration: Math.round(performance.now() - startTime),
      source: 'Mock',
    };
  }

  try {
    let url = api.endpoint;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Simple key injection logic for demonstration
    // In a real backend proxy, this would be handled securely
    if (userKey) {
      if (url.includes('?')) {
        url += `&appid=${userKey}&api_key=${userKey}&key=${userKey}`; 
      } else {
        url += `?appid=${userKey}&api_key=${userKey}&key=${userKey}`;
      }
      // Specific handling for header-based auth if needed (simplified for this demo)
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return {
      success: response.ok,
      data: data,
      status: response.status,
      duration: Math.round(performance.now() - startTime),
      source: 'Live',
    };
  } catch (error: any) {
    return {
      success: false,
      data: { error: error.message || 'Network Error' },
      status: 0,
      duration: Math.round(performance.now() - startTime),
      source: 'Live',
    };
  }
};