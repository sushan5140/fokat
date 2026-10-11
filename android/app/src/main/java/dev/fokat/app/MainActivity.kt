package dev.fokat.app

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.content.Intent
import android.speech.tts.TextToSpeech
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import java.util.Locale

/**
 * Native hardware feasibility harness. NOT a translation application.
 * Records only one explicitly requested utterance; displays recognized text locally.
 * Routes communication audio only while the activity is in use.
 */
class MainActivity : Activity(), TextToSpeech.OnInitListener {
    private lateinit var audio: AudioManager
    private lateinit var log: TextView
    private var recognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private var selected: AudioDeviceInfo? = null
    private var active = false
    private var localeTag = "en-US"
    private var ttsReady = false
    private val permissionCode = 21

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        audio = getSystemService(AUDIO_SERVICE) as AudioManager
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(32, 35, 32, 25) }
        val heading = TextView(this).apply { text = "fokat. / Android audio lab"; textSize = 24f }
        log = TextView(this).apply { text = "Native Phase 3 test harness. No translated audio yet.\n"; textSize = 15f }
        val scroll = ScrollView(this).apply { addView(log) }
        root.addView(heading)
        fun button(title: String, action: () -> Unit) {
            root.addView(Button(this).apply { text = title; setOnClickListener { action() } })
        }
        button("Refresh audio devices") { refresh() }
        button("Route to Bluetooth communication device") { route(true) }
        button("Route to phone speaker") { route(false) }
        button("Reset audio route") { resetRoute() }
        button("Switch recognition EN / KO") { localeTag = if (localeTag == "en-US") "ko-KR" else "en-US"; write("Recognition: $localeTag") }
        button("Listen once (permission required)") { listen() }
        button("Speak sample phrase (test route)") { speak() }
        button("Stop audio") { recognizer?.cancel(); tts?.stop(); write("Audio stopped") }
        root.addView(scroll, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))
        setContentView(root)
        tts = TextToSpeech(this, this)
        refresh()
    }

    private fun write(s: String) { log.append("\n$s"); android.util.Log.i("FokatAudio", s) }
    private fun label(d: AudioDeviceInfo): String = "${d.productName} [type=${d.type}, id=${d.id}]"
    private fun refresh() {
        val devices = audio.availableCommunicationDevices
        write("Available communication outputs: " + (if (devices.isEmpty()) "none" else devices.joinToString("; ") { label(it) }))
        write("Selected: " + (audio.communicationDevice?.let { label(it) } ?: "system default"))
    }
    private fun route(bluetooth: Boolean) {
        // Android setCommunicationDevice controls communication routing, not arbitrary
        // independent source/sink combinations; hardware-dependent.
        val candidates = audio.availableCommunicationDevices
        val device = candidates.firstOrNull {
            if (bluetooth) it.type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO || it.type == AudioDeviceInfo.TYPE_BLE_HEADSET
            else it.type == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER
        }
        if (device == null) { write("Requested output unavailable. No routing change."); return }
        try {
            audio.mode = AudioManager.MODE_IN_COMMUNICATION
            val ok = audio.setCommunicationDevice(device)
            if (ok) selected = device
            write("Route requested: ${label(device)} accepted=$ok; active=${audio.communicationDevice?.let { label(it) }}")
        } catch (ex: SecurityException) { write("Routing permission denied: ${ex.message}") }
    }
    private fun resetRoute() {
        audio.clearCommunicationDevice()
        audio.mode = AudioManager.MODE_NORMAL
        selected = null
        write("Routing restored to OS default")
    }
    private fun listen() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), permissionCode); return
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { write("No recognition service installed"); return }
        recognizer?.destroy()
        recognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) { write("Listening…") }
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() { write("Recognition ended") }
                override fun onError(error: Int) { active = false; write("Recognition failed, code=$error") }
                override fun onResults(results: Bundle?) {
                    active = false
                    val text = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
                    write("Recognized ($localeTag): ${text ?: "[no words]"}")
                }
                override fun onPartialResults(partialResults: Bundle?) {}
                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }
        active = true
        recognizer?.startListening(Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, localeTag)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        })
    }
    private fun speak() {
        if (!ttsReady) { write("TTS unavailable"); return }
        if (active) { write("Stop recognition before audio playback"); return }
        val korean = localeTag == "ko-KR"
        val text = if (korean) "안녕하세요. 반갑습니다." else "Hello. This is an audio routing test."
        val locale = if (korean) Locale.KOREAN else Locale.ENGLISH
        val result = tts?.setLanguage(locale)
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            write("Missing voice data for $locale"); return
        }
        tts?.setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "fokat-route-test")
        write("Speaking sample via currently available route: $locale")
    }
    override fun onInit(status: Int) { ttsReady = status == TextToSpeech.SUCCESS; write("TTS ready=$ttsReady") }
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == permissionCode && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) listen()
        else write("Microphone permission not granted")
    }
    override fun onDestroy() { recognizer?.destroy(); tts?.shutdown(); resetRoute(); super.onDestroy() }
}
