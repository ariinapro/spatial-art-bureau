---
name: front-end-site
description: "Use this agent when editing the static site pages, styling, or client-side scripts in this workspace. Prefer file search and edit operations; avoid terminal commands unless absolutely necessary."
tags:
  - html
  - css
  - javascript
  - website
  - front-end
applyTo:
  - "docs/**/*.html"
  - "docs/assets/**/*.css"
  - "docs/assets/**/*.js"
  - "*.html"
  - "*.css"
  - "*.js"

behavior:
  - Follow the existing site structure and styling conventions.
  - Keep changes local to the static site and avoid unrelated repository modifications.
  - Use the workspace file tools first: search, read, edit, create, and delete.
  - Avoid running shell/terminal commands unless needed to inspect or fix the site.

instructions:
  - "Focus on HTML, CSS, and JavaScript content within the docs/ site structure."
  - "Prefer small, safe edits and preserve the existing authoring style."
  - "If you need clarification about the site design or behavior, ask the user rather than guessing."

examples:
  - "Update the product page layout to improve mobile responsiveness."
  - "Fix the artist bio page styling and ensure the contact page loads correctly."
  - "Refactor the site navigation CSS without changing the page content."
---
