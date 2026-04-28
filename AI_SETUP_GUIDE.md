# 🤖 Aktivace AI Asistenta - GitHub Models Setup

**Status:** ✅ Production-ready | 🟡 Vyžaduje 5 minut konfigurace

---

## 🎯 Co dělámě?

Propojujeme Cloudflare Worker s **GitHub Models** (GPT-4o-mini).
- **Model:** gpt-4o-mini (zdarma v rámci GitHub Copilot)
- **Backend:** Cloudflare Worker (free tier)
- **Frontend:** Chatbot widget na webu

---

## 📋 Krok 1: Vytvoř GitHub Personal Access Token

1. Jdi na https://github.com/settings/tokens?type=beta
2. Klikni **Generate new token**
3. Pojmenuj ho: `whc-cloudflare-worker`
4. Vyber scope: **Models** (to stačí)
5. Nastav expiraci: **90 dní** nebo **No expiration**
6. Klikni **Generate token**
7. **ZKOPÍRUJ token** (neuvidíš ho znovu!)

Token vypadá takto:
```
github_pat_xxxxxxxxxxxxxxxxxxxx
```

---

## 📋 Krok 2: Vytvoř Cloudflare Worker

1. Jdi na https://workers.cloudflare.com
2. Zaregistruj se (free) / Přihlas se
3. Klikni **Create a new Service**
4. Pojmenuj ho: `whc-ai-asistent`
5. Vyber template: **Hello World**
6. Klikni **Create Service**

---

## 📋 Krok 3: Vlož Worker Kód

1. V editoru (który se otevřel) **vše vymažeš** (Ctrl+A, Delete)
2. Otevři `cloudflare-worker-template.js` z našeho repozitáře
3. Zkopíruj všechno
4. Vlož to do Cloudflare editoru
5. Klikni **Deploy** (vpravo nahoře)

---

## 📋 Krok 4: Přidej Environment Variable

1. V Cloudflare Worker dashboardu jdi na tvůj worker
2. Vlevo klikni **Settings**
3. Dole najdi **Environment Variables**
4. Klikni **Edit variables**
5. Přidej:
   - **Variable name:** `GITHUB_TOKEN`
   - **Value:** `github_pat_xxxxxxxxxxxxxxxxxxxx` (tvůj token)
6. Klikni **Encrypt and save**

---

## 📋 Krok 5: Zjisti Worker URL

1. Jdi na **Deployments** tab
2. Vlevo vidíš **Subdomain** (možná `whc-ai-asistent.your-account.workers.dev`)
3. **ZKOPÍRUJ TUTO URL** (budeš ji potřebovat v index.html)

---

## 📋 Krok 6: Propoj Worker s Webem

1. Otevři `index.html` v editoru
2. Najdi řádek (cca na řádku 950):
   ```javascript
   const workerURL = 'https://your-worker-domain.workers.dev/api/chat';
   ```
3. Nahraď `your-worker-domain` svým subdoménem
   - Např.: `https://whc-ai-asistent.matej1234.workers.dev/api/chat`
4. Ulož (Ctrl+S)
5. Commituj a pushuj:
   ```bash
   git add index.html
   git commit -m "Aktivace: GitHub Models AI asistent"
   git push origin main
   ```
6. Netlify automaticky redeploy (2-3 min)

---

## ✅ Testování

1. Jdi na https://whc-web.netlify.app
2. Klikni na **AI Asistent** (chat bubble vpravo dole)
3. Napiš: "Ahoj" nebo "Co je LiDAR?"
4. AI by měla odpovědět! 🎉

---

## 🔍 Troubleshooting

### ❌ AI neodpovídá (timeout)
- Zkontroluj **GITHUB_TOKEN** v Worker settings
- Token musí být validní a nesmí expirovat
- Zkus token regenerovat

### ❌ Error 401 Unauthorized
- GITHUB_TOKEN je neplatný nebo smazaný
- Jdi na https://github.com/settings/tokens a vytvoř nový

### ❌ Error 429 Too many requests
- Máš moc requestů - GitHub Models má limity
- Počkej pár minut, pak zkus znovu

### ❌ CORS error
- Worker musí mít správné CORS headers (měl by je)
- Zkontroluj, že Worker je deploynutý

---

## 💡 Co se stane když budu volat AI?

1. **Uživatel** napíše zprávu v chatu
2. **JavaScript** pošle request na Worker
3. **Worker** vezme zprávu a GITHUB_TOKEN
4. **GitHub Models API** vrátí odpověď (GPT-4o-mini)
5. **Worker** vrátí odpověď uživateli
6. **Chat** zobrazí odpověď

Vše trvá ~1-2 sekundy. ⚡

---

## 📊 Limity GitHub Models

- **Zdarma:** 15 requests za hodinu (měl by stačit)
- **Placený GitHub Copilot:** Větší limity
- Když dosáhneš limitu, čekáš 1 hodinu nebo upgradneš

Pokud potřebuješ więcej:
1. Upgraduj na placený GitHub Copilot Pro
2. Nebo přepni na OpenAI (placené, ale bez limitů)

---

## 🎉 Done!

Máš AI asistenta! 🤖

Co ještě chceš zlepšit?
- [ ] Newsletter signup?
- [ ] Favicon a OG obrázky?
- [ ] Blog/Resources sekce?
- [ ] Trust badges (sertifikace)?

