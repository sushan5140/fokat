# Fokat Phase 4.5 — bilingual translation acceptance tests

Run manually in Microsoft Edge against GitHub Pages, with Real translation ON. Record exact outputs and timing; do not assume correctness from HTTP 200. Native Korean reviewers should rate naturalness and register. No provider secrets or private conversations in test logs.

| ID | Direction | Source | Expected meaning (not exact string) | Risk |
|---|---|---|---|---|
| E01 | EN→KO | Thanks. | 감사합니다 | Basic |
| E02 | EN→KO | How are you? | 어떻게 지내세요? / 잘 지내세요? | Basic |
| E03 | EN→KO | I want to buy a train ticket for tomorrow. | 내일 기차표를 사고 싶어요. | Travel |
| E04 | EN→KO | I'm down for it, but let's do it tomorrow. | 좋아요, 그런데 내일 해요. | Idiom |
| E05 | EN→KO | Could you please speak more slowly? | 좀 더 천천히 말씀해 주시겠어요? | Politeness |
| E06 | EN→KO | The meeting is at 7:30 p.m. on Friday. | 금요일 오후 7시 30분에 회의가 있어요. | Dates |
| E07 | EN→KO | I don't want to cancel the reservation. | 예약을 취소하고 싶지 않아요. | Negation |
| E08 | EN→KO | Is there a vegetarian option without fish sauce? | 액젓이 없는 채식 메뉴가 있나요? | Food |
| K01 | KO→EN | 안녕하세요. | Hello. | Basic |
| K02 | KO→EN | 혹시 지하철역이 어디에 있는지 아세요? | Do you know where the subway station is? | Politeness |
| K03 | KO→EN | 내일은 시간이 없어서 다음 주에 만나요. | I don't have time tomorrow, so let's meet next week. | Causality |
| K04 | KO→EN | 그거 진짜 대박이다. | That's amazing / unbelievable. | Slang |
| K05 | KO→EN | 예약을 취소하지 말아 주세요. | Please don't cancel the reservation. | Negation |
| K06 | KO→EN | 지금 출발하면 늦지 않을 거예요. | If we leave now, we won't be late. | Conditional |

Acceptance: 14/14 yield translations without provider errors (availability); independent bilingual review of meaning and register; no fabricated numbers, names, negations, or instructions. Report failure rates and latency separately. Repeat via microphone and TTS only after text correctness.

## Current capabilities
- MyMemory translation for ordinary text with known restrictions (network access, quota, up to 500 input bytes in app).
- Verified exact phrasebook may intercept common phrases; mark source clearly.
- Retry and manual correction apply to the current conversation only.
- No validated context-aware translation, register/style control, backend orchestration or confidence model.
- On GitHub Pages, do not embed private commercial API keys in JavaScript.

## Future implementation gate
Before adding Natural/Polite/Casual: integrate a provider with documented controllable tone (or controlled Korean rewrite layer), keep an explicit opt-in and privacy disclosure, compare semantic accuracy before/after rewrite, and build human-reviewed tests.
