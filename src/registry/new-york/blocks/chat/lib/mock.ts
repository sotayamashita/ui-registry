export const mockSleep = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve();
    }, ms);

    // Listen for abort signal
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Request was aborted", "AbortError"));
      });
    }
  });
};

export const mockApiCall = async (
  message: string,
  signal?: AbortSignal,
): Promise<string> => {
  try {
    // Simulate API delay (3 seconds)
    await mockSleep(3000, signal);

    // Simulate response
    return `Mock response to: "${message}". This took 3 seconds to process.`;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request was cancelled by user");
    }
    throw error;
  }
};
