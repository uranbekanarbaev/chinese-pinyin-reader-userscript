// ==UserScript==
// @name         Chinese Pinyin Reader: pinyin and pronunciation for selected text
// @namespace    https://github.com/uranbekanarbaev/chinese-pinyin-reader-userscript
// @version      1.0.0
// @description  Select Chinese text on any page to see pinyin with tone marks and hear it read aloud. Open the full Chinese text to speech reader for MP3 and more.
// @author       Uranbek Anarbaev
// @license      MIT
// @homepageURL  https://github.com/uranbekanarbaev/chinese-pinyin-reader-userscript
// @supportURL   https://github.com/uranbekanarbaev/chinese-pinyin-reader-userscript/issues
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/pinyin-pro@3.29.3/dist/index.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  var READER_URL = 'https://www.uranbekanarbaev.dev/?utm_source=github&utm_medium=userscript&utm_campaign=chinese-pinyin-reader-userscript&utm_content=popup';
  var STORE_URL = 'https://chromewebstore.google.com/detail/chinese-text-to-speech/kfoonobmdlloonajhikajicnohljhdnk';
  var MAX_CHARS = 200;
  var HAN = /[㐀-䶿一-鿿]/;

  var host, shadow, box;

  function ensureBox() {
    if (host) return;
    host = document.createElement('div');
    host.style.cssText = 'all:initial;position:absolute;z-index:2147483647;';
    shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<style>' +
      ':host{all:initial}' +
      '.box{font:14px/1.5 system-ui,sans-serif;background:#fff;color:#242019;border:1px solid #cfc9bd;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.18);padding:12px 14px;max-width:360px}' +
      '@media(prefers-color-scheme:dark){.box{background:#24211c;color:#ece7dc;border-color:#3a352c}}' +
      '.py{font-size:15px;color:#8c2e20;margin:4px 0 8px;word-break:break-word}' +
      '@media(prefers-color-scheme:dark){.py{color:#e0836f}}' +
      '.zh{font-size:18px;word-break:break-word}' +
      '.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}' +
      'button,a.btn{font:inherit;border:1px solid #8c2e20;background:#8c2e20;color:#fff;border-radius:6px;padding:6px 10px;cursor:pointer;text-decoration:none}' +
      'a.alt{background:transparent;color:#8c2e20}' +
      '@media(prefers-color-scheme:dark){a.alt{color:#e0836f}}' +
      '.hint{font-size:12px;opacity:.75;margin-top:8px}' +
      '</style><div class="box" role="dialog" aria-label="Pinyin"></div>';
    box = shadow.querySelector('.box');
    document.documentElement.appendChild(host);
  }

  function hide() { if (host) host.style.display = 'none'; if (window.speechSynthesis) window.speechSynthesis.cancel(); }

  function speak(text, btn) {
    if (!('speechSynthesis' in window)) { btn.textContent = 'No speech support'; return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    var zh = window.speechSynthesis.getVoices().filter(function (v) { return /^zh/i.test(v.lang); });
    if (zh.length) u.voice = zh[0];
    window.speechSynthesis.speak(u);
  }

  function show(text, rect) {
    ensureBox();
    var py = window.pinyinPro.pinyin(text, { toneType: 'symbol', type: 'string' }).replace(/\s+([，。！？：、；])/g, '$1');
    box.textContent = '';
    var zh = document.createElement('div'); zh.className = 'zh'; zh.textContent = text;
    var p = document.createElement('div'); p.className = 'py'; p.textContent = py;
    var row = document.createElement('div'); row.className = 'row';
    var play = document.createElement('button'); play.type = 'button'; play.textContent = 'Listen';
    play.addEventListener('click', function () { speak(text, play); });
    var full = document.createElement('a'); full.className = 'btn alt'; full.href = READER_URL; full.target = '_blank'; full.rel = 'noopener';
    full.textContent = 'Open full reader';
    row.appendChild(play); row.appendChild(full);
    var hint = document.createElement('div'); hint.className = 'hint';
    hint.appendChild(document.createTextNode('Female/male Mandarin voices, speed control, MP3 and PDF import. '));
    var ext = document.createElement('a'); ext.href = STORE_URL; ext.target = '_blank'; ext.rel = 'noopener'; ext.textContent = 'Add to Chrome';
    hint.appendChild(ext);
    box.appendChild(zh); box.appendChild(p); box.appendChild(row); box.appendChild(hint);
    host.style.display = 'block';
    host.style.left = Math.max(8, window.scrollX + rect.left) + 'px';
    host.style.top = (window.scrollY + rect.bottom + 8) + 'px';
  }

  document.addEventListener('mouseup', function (e) {
    if (host && e.composedPath().indexOf(host) !== -1) return;
    setTimeout(function () {
      var sel = window.getSelection();
      var text = sel ? sel.toString().trim() : '';
      if (!text || !HAN.test(text)) { hide(); return; }
      if (text.length > MAX_CHARS) text = text.slice(0, MAX_CHARS);
      var rect = sel.getRangeAt(0).getBoundingClientRect();
      show(text, rect);
    }, 10);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
})();
