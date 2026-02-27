## 2026-02-22 - Supply Chain Security: Pin Python dependencies
**Vulnerability:** The GitHub Actions workflow installed Python dependencies using `pip install package_name` without specifying a version. This made the build process susceptible to breaking changes or malicious code injection if a new, compromised version of the package were released (supply chain attack).
**Learning:** Reproducibility and security in CI/CD pipelines require explicit version pinning. Relying on "latest" implicitly trusts the package registry and maintainers at all times, which is a risk.
**Prevention:** Always use a `requirements.txt` file (or similar lock file mechanism) with pinned versions (e.g., `package==1.0.0`) for all dependencies, and install using `pip install -r requirements.txt`. This ensures that the exact same code is used every time the workflow runs.

## 2026-05-20 - Defense in Depth: Security Headers in Static Sites
**Vulnerability:** The application is a static site (likely hosted on GitHub Pages or similar) which limits the ability to set HTTP response headers like `Referrer-Policy` or `X-Frame-Options` via server configuration.
**Learning:** Security headers are a critical layer of defense, but their absence in static hosting environments is a common gap. We must rely on `<meta>` tags within the HTML itself to enforce policies where possible.
**Prevention:** For static sites, audit available `<meta>` tag equivalents for security headers (e.g., `Content-Security-Policy`, `Referrer-Policy`) and enforce their presence via automated testing (e.g., Python scripts in `tests/`).

## 2026-08-15 - Reverse Tabnabbing: The Hidden Danger of target="_blank"
**Vulnerability:** External links using `target="_blank"` allow the newly opened page to access the original window object via `window.opener`. A malicious site could use this to redirect the original page to a phishing site (reverse tabnabbing).
**Learning:** Even simple HTML attributes can have profound security implications. Developers often overlook the `window.opener` behavior, assuming the new tab is fully isolated.
**Prevention:** Always combine `target="_blank"` with `rel="noopener noreferrer"`. This cuts the reference to the opener window. We implemented an automated fix in `scripts/main.js` to enforce this pattern on all external links dynamically.

## 2024-05-27 - XSS Prevention: Safe DOM Manipulation
**Vulnerability:** The client-side search functionality (`renderResults` in `scripts/main.js`) used string concatenation to build HTML and injected it into the DOM via `innerHTML`. This allowed for Cross-Site Scripting (XSS) if malicious data were present in the search targets (e.g., `<img src=x onerror=alert(1)>`).
**Learning:** Even when data seems "internal" (like an array of search targets defined in JS), using `innerHTML` with unsanitized data is a dangerous pattern. If the data source ever changes (e.g., fetched from an API), the site becomes immediately vulnerable. Furthermore, replacing `innerHTML` with DOM creation (`document.createElement`) can introduce subtle UI regressions if whitespace/formatting is not explicitly preserved.
**Prevention:** Always use safe DOM manipulation methods (`document.createElement`, `element.textContent`, `element.appendChild`) when rendering dynamic content, especially user-facing text like labels or descriptions. Avoid `innerHTML` unless strictly necessary and combined with a robust sanitizer.
