# Chinese Pinyin Reader userscript

Select Chinese text on any web page and get **pinyin with tone marks** and a **Listen** button for pronunciation. A small userscript for Tampermonkey, Violentmonkey or Greasemonkey. No account, no tracking, nothing is sent anywhere: pinyin is computed in your browser and speech uses your browser's built-in voices.

**Want natural Mandarin voices, speed control, MP3 download and PDF import? → [Open the full Chinese text to speech reader](https://www.uranbekanarbaev.dev/?utm_source=github&utm_medium=readme&utm_campaign=chinese-pinyin-reader-userscript&utm_content=top)** or [add the Chrome extension](https://chromewebstore.google.com/detail/chinese-text-to-speech/kfoonobmdlloonajhikajicnohljhdnk) to read whole pages with a highlighted sentence.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Open [`chinese-pinyin-reader.user.js`](chinese-pinyin-reader.user.js) in this repository and click **Raw**. Your manager will offer to install it.
3. Select any Chinese text on a page. A small card shows the pinyin and a **Listen** button. Press `Esc` to close it.

## What it does

- Shows pinyin with tone marks for the selected characters (up to 200 characters).
- **Listen** reads the selection with a Chinese voice installed on your device (Web Speech API).
- Works inside the page's shadow root so page styles do not break the card; follows light and dark mode.
- Links to the full reader for MP3 download and document import.

## Limits

- Voice quality and availability depend on your operating system and browser; some devices have no Chinese voice.
- Heteronyms (characters with several readings) are converted using the library's context rules and can be wrong in unusual words; check a dictionary for important text.
- Mandarin only. It does not score pronunciation or read Cantonese.
- The script requests `pinyin-pro` from jsDelivr (pinned version) via `@require`.

## Conversion note

The card's **Open full reader** and **Add to Chrome** links are the only outbound links. Source is a single file: read it before installing.

## License

MIT
