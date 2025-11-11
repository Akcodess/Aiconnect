// Centralized API version sourced from environment variables
// Fallback to '1' if not provided
export const apiVersion: string = process.env.API_VERSION ?? '1';