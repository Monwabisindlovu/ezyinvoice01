// src/global.d.ts or any .d.ts file in your project
declare global {
    interface Window {
      google: any;  // Add this line to declare the google object
    }
  }
  
  export {}; // This ensures the file is treated as a module
  