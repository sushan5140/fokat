# Fokat Android audio feasibility harness

This is an independent **native Android Phase 3 scaffold**, not a production translation app. Requires Android Studio, Android SDK 35, JDK 17, and a device on Android 12+ (API 31+). Open this `android/` directory in Android Studio and let Gradle sync.

## Try it
1. Install on a test phone; attach ordinary Bluetooth earbuds through OS settings.
2. Press **Refresh audio devices** to inspect supported communication outputs.
3. Try the Bluetooth and speaker route controls; see which requests are accepted.
4. Use **Listen once** and grant microphone permission to test Android SpeechRecognizer.
5. Use **Speak sample phrase** to test a short English/Korean voice over the selected communication route.
6. Record actual device model, Android version, earbud model, output heard, error messages, and failures.

## Limitations
- There is no translation API in the Android scaffold and no cloud synchronization.
- `setCommunicationDevice` sets a communication **output** and the platform can select its corresponding input. It does not independently guarantee Bluetooth-earbud output and phone-speaker output simultaneously.
- Routing is device-dependent; this code logs requested/active routes but cannot prove which physical speaker emitted sound.
- Android permission/service behavior varies by OS and device. Bluetooth permissions may require an additional runtime grant on some models.
- No background listening or recording. Avoid sensitive recordings; obtain participant consent.
- This source has not been compiled or run on hardware in this environment. Do not claim verified support.
