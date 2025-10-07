// Temporary ambient types to satisfy TypeScript when test deps aren't installed locally.

declare const test: (name: string, fn: () => unknown) => void;
declare const expect: any;

declare module '@testing-library/react' {
  export const screen: any;
  export function render(ui: React.ReactElement): { unmount: () => void };
}


