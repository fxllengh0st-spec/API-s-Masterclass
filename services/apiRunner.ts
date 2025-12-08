import { ApiDefinition } from '../types';

interface ExecutionResult {
  success: boolean;
  data: any;
  status: number;
  duration: number;
  source: 'Live' | 'Mock' | 'Proxy';
}

export const runApiRequest = async (
  api: ApiDefinition,
  userKey?: string,
  useProxy: boolean = false
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
    
    // Inject Key if present
    if (userKey) {
      const separator = url.includes('?') ? '&' : '?';
      // Attempt to cover common parameter names for API keys
      url += `${separator}appid=${userKey}&api_key=${userKey}&key=${userKey}&access_key=${userKey}`;
    }

    // Handle Proxy Wrapping
    if (useProxy) {
        // Using allorigins.win as a stable, free CORS proxy for educational purposes
        url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    }

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);
    
    // Robustly handle response body parsing
    let data;
    const contentType = response.headers.get("content-type");
    const textBody = await response.text();

    try {
      // Try to parse as JSON if header says so or if it looks like JSON
      if (
        (contentType && contentType.includes("application/json")) || 
        (textBody.trim().startsWith('{') || textBody.trim().startsWith('['))
      ) {
        data = JSON.parse(textBody);
      } else {
        // Fallback for HTML error pages or plain text
        data = textBody ? { message: textBody } : { message: response.statusText };
      }
    } catch (e) {
      data = { message: "Could not parse response", raw: textBody };
    }

    return {
      success: response.ok,
      data: data,
      status: response.status,
      duration: Math.round(performance.now() - startTime),
      source: useProxy ? 'Proxy' : 'Live',
    };

  } catch (error: any) {
    let errorMessage = error.message || 'Network Error';
    
    // Heuristic for CORS or Network Failure
    if (error.name === 'TypeError' && errorMessage === 'Failed to fetch') {
        errorMessage = 'Network Error: The browser blocked the request. This is often due to CORS (Cross-Origin Resource Sharing) restrictions on the API or a loss of internet connection.';
    }

    return {
      success: false,
      data: { error: errorMessage },
      status: 0,
      duration: Math.round(performance.now() - startTime),
      source: useProxy ? 'Proxy' : 'Live',
    };
  }
};