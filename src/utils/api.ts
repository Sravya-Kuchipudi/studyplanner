
/**
 * Utility functions for API calls
 */

/**
 * Base fetch wrapper for API calls
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Chat API specific functions
 */
export const chatAPI = {
  /**
   * Send a message to the AI assistant
   */
  sendMessage: async (message: string, history: Array<{role: string, content: string}> = []) => {
    return fetchAPI('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  },
};
