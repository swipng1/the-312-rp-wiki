import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// IMPORTANT: set `base` to match your GitHub repo name, e.g. "/the-312-rp-wiki/"
// If you're deploying to a custom domain or a user/org page (username.github.io), use "/" instead.
export default defineConfig({
  base: "/the-312-rp-wiki/",
  plugins: [react(), tailwindcss()],
});
