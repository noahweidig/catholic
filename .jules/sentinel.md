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

## 2026-11-05 - DOM-based XSS Risk: Unsafe Use of `innerHTML`
**Vulnerability:** The client-side search functionality (`renderResults` in `scripts/main.js`) used `innerHTML` to inject search results directly into the DOM. If user input were to be improperly sanitized or incorporated into the search targets, it could result in Cross-Site Scripting (XSS).
**Learning:** `innerHTML` inherently executes injected scripts or dangerous HTML if not properly scrubbed. It bypasses many built-in protections and is heavily discouraged for rendering user-facing content or even internal data that might be modified.
**Prevention:** Construct HTML using safe DOM manipulation APIs (`document.createElement()`, `element.textContent`, `element.appendChild()`). This approach inherently escapes text, ensuring no injected string is interpreted as HTML tags or scripts. Whitespace nodes can be added explicitly to maintain exact rendering structures.
## 2025-03-05 - Avoid exposing system internals in exception logging
**Vulnerability:** Information leakage through verbose exception output.
**Learning:** Uncaught Python exceptions or unhandled standard error from `subprocess` can inadvertently expose file paths, package versions, and system environment variables in public GitHub action logs.
**Prevention:** In backend scripts like `update_today.py`, explicitly trap `Exception`, log a safe/generic warning message, and gracefully return `None` (or exit safely) without printing `e.stderr` or `e.stack`.
## 2026-12-05 - Security Enhancements Bypassed by UI conditionals
**Vulnerability:** A script intended to automatically add `rel="noopener noreferrer"` to all `target="_blank"` external links to prevent reverse tabnabbing contained a UI conditional: it returned early if the link contained an image (to avoid adding an "external link" icon next to images). Because the early return was placed *before* the security attributes were added, image links with `target="_blank"` remained completely unprotected.
**Learning:** Security fixes must never be coupled with or placed after non-security-related conditionals or UI early returns in the same iteration block. Doing so risks leaving parts of the application vulnerable.
**Prevention:** Apply sweeping security modifications (like DOM manipulation for security headers or attributes) at the very top of execution blocks or in entirely separate, dedicated loops from visual or UX enhancements.
