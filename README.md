# WHC - Web společnosti

Moderní, responzivní web společnosti WHC s.r.o. s AI asistentem, SEO optimalizacemi a Netlify deploymentem.

## 🎯 Funkce

- ✨ **Moderní design** - Dark/Light mode, animace, Tailwind CSS
- 🤖 **AI Asistent** - Plovoucí chatbot widget (připraven na Cloudflare Workers)
- 📱 **Responzivní** - Optimalizováno pro desktop, tablet i mobil
- 🔍 **SEO optimalizace** - JSON-LD schema, robots.txt, sitemap.xml
- 📋 **Kontaktní formulář** - Netlify Forms
- 🎨 **Light/Dark mode** - Uživatelská volba s localStorage

## 📦 Složka struktura

```
.
├── index.html           # Hlavní stránka
├── netlify.toml         # Netlify konfigurace
├── robots.txt          # SEO config
├── sitemap.xml         # Mapa webu
├── .gitignore          # Git ignorování
└── README.md           # Tato dokumentace
```

## 🚀 Nasazení na Netlify

1. **Push do GitHubu**
   ```bash
   git add .
   git commit -m "Production ready: Netlify + AI asistent + SEO"
   git push origin main
   ```

2. **Jdi na [Netlify.com](https://netlify.com)**
   - "Add new site" → "Import an existing project"
   - Vyber `MEVERIK-SOLUTION/whc`
   - Deploy automaticky

## 🤖 AI Asistent - Setup (GitHub Models nebo NVIDIA NIM)

Chatbot běží přes `cloudflare-worker-template.js` a umí 2 providery:

- `github` (default) přes `GITHUB_TOKEN`
- `nvidia` přes `NVIDIA_API_KEY` (NVIDIA NIM endpoint)

### 1) Nasazení Workeru

1. Vytvoř Cloudflare Worker.
2. Vlož obsah souboru `cloudflare-worker-template.js`.
3. Deploy.

### 2) Environment variables v Cloudflare

Pro GitHub Models:

- `AI_PROVIDER=github`
- `GITHUB_TOKEN=...`

Pro NVIDIA NIM:

- `AI_PROVIDER=nvidia`
- `NVIDIA_API_KEY=...`

### 3) Propojení frontendu

V `index.html` uprav hodnotu:

```javascript
const workerURL = 'https://YOUR_WORKER_SUBDOMAIN.workers.dev/api/chat';
```

### 4) Test

- Otevři web.
- Klikni na AI chat.
- Napiš dotaz.
- Pokud odpovídá, integrace je hotová.

## 📧 Kontakt

info@whc.cz

---

**Verze:** 1.0.0 | **Status:** Production-ready
