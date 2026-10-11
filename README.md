# fokat.
**Talk freely. Understand better.**

Fokat is an experimental multilingual conversation interface for travelers and face-to-face conversations. It aims to connect spoken language translation, hands-free listening, and opt-in dialogue memory.

> Status: Phase 2 — guided push-to-talk speech recognition → translation → spoken reply wired together. Real-world translation quality, browser CORS/runtime behavior, Bluetooth routing, and speaker isolation are **not validated**.

## Live prototype
Open `index.html` in a recent Chrome/Edge browser, or enable GitHub Pages (Settings → Pages → Deploy from branch → main / root).

## Implemented in Phase 0
- Responsive two-person conversation interface (English ↔ Korean).
- User-activated microphone dictation using browser SpeechRecognition where supported.
- Speech playback using built-in browser text-to-speech voices (subject to installed voices).
- Explicit opt-in local conversation history; clear/delete/export JSON.
- Manual text entry, conversation switching, and starter demo dialogue.
- Transparent **demo phrasebook**: only predefined phrases are translated. Unmatched text is clearly marked as **not translated**. Never mistaken for general-purpose AI translation.
- No external API requests or credentials.

## Phase 1 integration\n- Optional MyMemory public translation API mode for English ↔ Korean, using a live HTTP request on each submitted phrase. No provider key is needed for the basic public endpoint, but quotas and availability may change.\n- Disabled by default. Enabling it sends entered or browser-dictated text to MyMemory (a third party); do not transmit private information.\n- Explicit errors, 12-second timeout, pending state, and provider-result label in the message data.\n- Existing demo phrasebook remains the offline default; it is **not** general-purpose translation.\n- Static JavaScript syntax checked after commit, but actual network requests, cross-origin policy, browser speech recognition, and audio-device behavior have **not** been verified in a live browser.\n\n## Phase 2 guided voice mode\n- Enable **Voice conversation mode** and (optionally) **Online translation**. Tap Mic, speak one phrase, and let recognition stop before translation/playback.\n- Uses browser speech recognition and browser TTS, with recognition disabled during speech playback to reduce feedback loops. Manually tap Mic again for each turn.\n- Swap direction to interpret the other participant; this does not identify speakers automatically.\n- Audio playback follows the browser and operating system output device; Bluetooth routing is **not controlled** by Fokat.\n- JavaScript syntax validated after integration; full browser and Android hardware testing pending.\n\n## Not implemented yet
- Validated, uninterrupted real-time speech interpretation. Guided push-to-talk steps are wired but unbenchmarked.
- Continuous listening, automatic speaker identification, echo cancellation validation.
- Native Android Bluetooth output routing and background support.
- Offline translation packs or encrypted local database. Browser localStorage is not encrypted; avoid sensitive content.

## Research question
Can an interruption-resistant speech workflow plus understandable, searchable session memory reduce interaction burden compared to conventional translation interfaces?

## Prototype evaluation plan
Compare against a standard translation workflow under consented English/Korean role-play tasks:
1. Task completion and successful clarification rate.
2. Time to understandable translated output.
3. Number of manual repairs/restarts.
4. Word error rate and semantic adequacy, evaluated separately for STT and translation.
5. History retrieval speed and perceived utility.

Keep raw measurements, versions, environment, and failures. Do not present demo phrases as model results.

## Next technical phase
Implement a replaceable pipeline for ASR, translation, and TTS, beginning with push-to-talk rather than unbounded ambient recording. Then build an Android prototype for genuine Bluetooth earbud/phone-speaker routing and permissions.

## Privacy
Conversation saving is opt-in. The demo stores text in this browser's localStorage until cleared; it is not end-to-end encrypted. Only record/save speech when everyone involved agrees and local law permits.

## Team
Founded by Susan and Shruti.

## License
To be decided.
