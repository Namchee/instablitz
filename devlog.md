## Development Log

- POST API gives 500
- Trying to inject the SDK in an HTML file is problematic due to html files.
    - Fixed by escaping `</script>` with `<\\/script>`
- Tested Hono template, works correctly
