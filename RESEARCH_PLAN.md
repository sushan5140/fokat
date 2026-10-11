# Fokat — Research Prototype Completion Gate

## Goal
Build a consent-based bilingual communication app in which a user can listen to a nearby speaker, hear translated speech through a preferred audio output, speak back, and retrieve a faithful conversation record.

## Current scope
A static web prototype for English ↔ Korean. Optional remote MyMemory text translation, browser dictation and synthesis, opt-in browser history. No claimed production-grade interpretation, no speaker separation, no controlled Bluetooth routing.

## Completion gates (required before professor outreach)
- [ ] Validate production-like hosting on HTTPS on both Android and desktop.
- [ ] Verify microphone recognition in supported browsers with explicit language selection.
- [ ] Verify online translation requests, quota responses, CORS, provider errors, and text encoding.
- [ ] Verify language switching and both-sided labeling with two consenting participants.
- [ ] Verify TTS playback language and routing with wired, built-in speaker and Bluetooth earbuds.
- [ ] Verify transcript saving opt-in, session deletion, export and privacy copy.
- [ ] Confirm no audible output is transcribed into a new message in the default turn-taking workflow.
- [ ] Benchmark translation request latency and full interaction completion time across 30+ test turns in both directions.
- [ ] Record real errors and interruptions, never report invented performance measurements.
- [ ] Review accessibility, UI clarity and mobile viewport behavior.
- [ ] Review third-party data-sharing policy and translation-provider terms before public deployment.
- [ ] Build native Android routing prototype if separated earbud input and phone speaker output remain essential.

## Test matrix
| Context | Speech | Audio | Expected evidence |
|---|---|---|---|
| Quiet room | EN→KO, KO→EN | Phone speaker | transcript, timing, comprehensibility |
| Street noise playback | EN→KO, KO→EN | Earbuds | recognition repairs, failure counts |
| Conversation | alternating speakers | Phone + earbuds | label correctness and echo loops |
| Offline | any | Phone | explicit unavailable state; no invented translation |
| Provider failure | any | any | error preserved, no fabricated text |
| Privacy | any | any | opt-in behavior, export and deletion |

## Measures
1. ASR word error rate (against participant-approved reference text).
2. Translation adequacy judged independently by bilingual raters (record rubric).
3. End-to-end turn completion time with timestamps and environment.
4. Manual intervention count per conversation.
5. Conversation-history retrieval success and time.
6. Failed or misattributed turns and playback feedback events.

## Research novelty hypothesis
A deliberately controlled speech-to-speech workflow with transparent uncertainty and chronological memory could reduce interaction repairs and improve later recall compared with a conventional translator interface. This is a hypothesis, **not** a demonstrated result.

## Technical integrity
Browser SpeechRecognition may depend on proprietary browser speech services; MyMemory receives submitted text when enabled. Browser localStorage is not encrypted. A web page cannot guarantee split Bluetooth-versus-phone output routing or continual background capture. Android native APIs and device testing are required for that claim.

## Pitch gate
Pitch after a reproducible live demo, results table, failure analysis, and one-page honest comparison to a baseline app. Do not present prototype UI as scientific validation.
