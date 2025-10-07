import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

// Ensure the environment is read; set a default if not provided during test.
vi.stubEnv("VITE_APP_NAME", "PPH Lite Test");

test("renders app name from env", () => {
  render(<App />);
  expect(screen.getByText(/PPH Lite Test/i)).toBeInTheDocument();
});
