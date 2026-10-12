# fokat. — talk freely

Fokat is an **English ↔ Korean conversation translation research prototype** built for web-first testing. It supports browser speech recognition, browser TTS, optional local conversation history, and multiple translation engines.

**Status (October 2026): Translation Engine 2.0a integrated, not a complete context-aware translator.** The available engines are MyMemory online and an experimental browser on-device Translator API. The original phrasebook remains a verified fallback for specific phrases, not a substitute for general translation. Full end-to-end browser and device tests are pending.

## Run Fokat
- Development: https://sushan5140.github.io/fokat/
- Translation baseline lab: https://sushan5140.github.io/fokat/benchmark.html
- From a local checkout, open `index.html` in a supported browser (or serve via local HTTP). The app loads `translation-engine.js` from the same directory.
- GitHub Pages publishes `index.html`, `benchmark.html`, and `translation-engine.js` through `.github/workflows/pages.yml`. Vercel is reserved for later production use.

## Translation Engine 2.0a (new)
The **Provider** selector offers:
1. **MyMemory online** (default). General text translation via the public third-party service; internet access required. Requests respect a 450-UTF-8-byte section budget. Longer text is translated sequentially (up to 20 sections and 8,000 input characters), with a warning about context lost at section boundaries.
2. **Auto: local if ready**. Prefers Edge/Chrome's built-in Translator API *only if the specified language model is already available*; otherwise uses MyMemory. If it uses MyMemory, your input leaves your device.
3. **On-device only (beta)**. Attempts the browser-native Translator API with no online fallback. Hardware/browser/language-pack compatibility varies. Click **Prepare on-device model** to explicitly approve initial model download for the current direction; repeat for the reverse direction. The browser may reject this on unsupported devices.

**Translation enabled** can be switched off. With it off, only known demo/reviewed phrases translate.

**Visible safeguards**: distinguish provider source, error states, request retry, user corrections, output-language/numeral/context warnings, and the current speaker's text vs translated reply. These warnings are lightweight heuristics, **not calibrated confidence scores**.

**Important limits**:
- Neither MyMemory nor the built-in Translator API currently implements our planned contextual intent/honorific pipeline. The model may mistranslate idioms, subjects, register, negation, and names.
- Manually reviewed exact-phrase overrides fix *observed* issues only; they do not generalize to other expressions.
- MyMemory is a free-to-try third-party service with rate/usage limits and possible CORS, quota, or network failure. Do not send sensitive conversations.
- Edge/Chrome on-device models require compatible desktop browsers and hardware; the app cannot guarantee on-device mode will work. Local models need initial download.
- Browser SpeechRecognition may use external speech services; browser TTS/voice availability varies by device. Neither Bluetooth routing nor continuous listening is validated.

## Tests and research
- `node --test tests/translation-engine.test.cjs` — offline unit tests (Node 22+ recommended). No paid API calls or live provider requests.
- `.github/workflows/translation-tests.yml` — runs those tests on relevant pushes and pull requests.
- `TRANSLATION_TESTS.md` — EN↔KO manual acceptance cases and quality review criteria.
- `benchmark.html` — interactive MyMemory baseline: 14 examples, manual semantic rating, export CSV/JSON. It does **not** claim comparative superiority. Provider comparison remains future work.

## Roadmap (web first)
- **4.5b — Contextual engine:** secure and cost-capped model backend (or proven free alternative), polite/natural/casual Korean register, context-window consent, meaning checks, fair provider benchmarks. **Not deployed yet.**
- **5 — Bluetooth/listening:** controlled push-to-talk improvements, browser-output feasibility tests, then native Android only if required for separate earbuds/speaker routing.
- **6 — Conversation memory:** search, bookmarks, corrections and replay (privacy first).
- **7 — UI/UX & reliability:** performance, recoverability, desktop/mobile testing.
- **8 — Research:** controlled evaluation, reliability and semantic-quality benchmarks, professor-ready report.

## Privacy
Local conversation saving is opt-in and uses unencrypted localStorage; do not store secrets. **MyMemory sends text to a third party** when used. The on-device Translator API can keep translation text on the device *after language pack download*, where supported. Browser speech recognition may still transmit audio to browser services. Get consent before recording or saving others.

## Team
Founded by Susan and Shruti.

## License
To be decided.

## Translation Engine 2.0b — contextual and honorific controls (experimental)
The web UI now includes **Smart contextual** provider mode with context toggle, honorific selection (Auto / Polite / Formal / Casual), relationship, situation, and configurable Smart API URL. When a compatible backend is configured, the frontend sends the current text and up to six prior conversation turns to that backend. **These controls do not change MyMemory or on-device translation.** If Smart is unavailable, the UI uses MyMemory and warns that context/style controls did not apply.

Optional Vercel-compatible backend: `api/translate-context.js`. Configure the following **server-side** environment variables on your own authorized service:
- `SMART_TRANSLATION_API_KEY`: OpenAI-compatible provider API key (never put this in GitHub Pages HTML/JS)
- `SMART_TRANSLATION_BASE_URL`: HTTPS provider API base URL, ending before `/chat/completions`
- `SMART_TRANSLATION_MODEL`: model ID supported by that provider
- `ALLOWED_ORIGINS`: comma-separated origins permitted to call the API (default GitHub Pages project origin and local dev)

**Not currently configured or deployed.** The backend requires provider credentials/quotas; ₹0 unrestricted translation isn't guaranteed. For now select *Smart contextual* only to inspect the clear fallback behavior; once a backend is set up, enter its HTTPS origin in the app's Smart API URL control. The backend attempts to preserve meaning and request the chosen Korean register but is not yet empirically validated. Secure deployments must add per-user usage quotas/rate limiting, abuse prevention, logging policy and provider cost controls before enabling public traffic. No secret keys or credentials are stored in the public frontend.
