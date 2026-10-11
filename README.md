# fokat.
**Talk freely. Understand better.**

Fokat is an experimental multilingual conversation interface for travelers and face-to-face conversations. It aims to connect spoken language translation, hands-free listening, and opt-in dialogue memory.

> Status: Phase 0 — interactive research prototype. Translation quality, Bluetooth routing, and speaker isolation are **not validated**.

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

## Not implemented yet
- General live speech translation (STT → translation model → TTS).
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
