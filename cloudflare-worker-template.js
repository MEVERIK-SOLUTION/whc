/**
 * WHC AI Asistent - Cloudflare Worker s GitHub Models
 * 
 * Propojení: Cloudflare Worker → GitHub Models API
 * Model: gpt-4o-mini (zdarma v rámci GitHub Copilot)
 * 
 * Setup:
 * 1. https://workers.cloudflare.com → Create Worker
 * 2. Zkopíruj tento kód
 * 3. Přidej env vars (viz níže)
 * 4. Deploy
 * 5. Uprav Worker URL v index.html
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response('OK', { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const { message, context } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
      }

      // Volání GitHub Models (v rámci Copilot předplatného)
      const reply = await generateWithGitHubModels(message, context, env);

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        reply: '😅 Omlouváme se, AI je právě unavená. Zkuste za chvíli nebo napište nám na info@whc.cz'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

/**
 * GitHub Models - AI Asistent (GPT-4o-mini)
 * ZDARMA v rámci GitHub Copilot předplatného
 * 
 * Env vars potřebné:
 * - GITHUB_TOKEN: tvůj GitHub personal access token
 */
async function generateWithGitHubModels(message, context, env) {
  const apiKey = env.GITHUB_TOKEN;
  
  if (!apiKey) {
    console.error('GITHUB_TOKEN not configured');
    return 'Omlouváme se, AI je právě nedostupná. Správce ji právě konfiguruje.';
  }

  try {
    const systemPrompt = context || `Jste AI asistent společnosti WHC s.r.o.
Specialisté jsme na: Spatial Computing, LiDAR, BIM, digitalizace budov, Apple ekosystém.
Odpovídejte česky, stručně, přátelsky a profesionálně.
Buďte užiteční a doporučujte kontakt na info@whc.cz pro hlubší diskusi.`;

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Zdarma model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1.0
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub Models API error:', response.status, error);
      
      if (response.status === 401) {
        return 'API token je neplatný. Prosím, zkontroluj GITHUB_TOKEN v Cloudflare Workers environment.';
      }
      if (response.status === 429) {
        return 'Příliš mnoho dotazů. Zkuste za chvíli.';
      }
      
      return 'Chyba AI modelu. Zkuste později.';
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected response format:', data);
      return 'Omlouváme se, model vrátil neplatnou odpověď.';
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('GitHub Models fetch error:', error);
    return 'Síťová chyba. Zkuste znovu.';
  }
}

/**
 * FALLBACK - Cloudflare AI (pokud GitHub Models selže)
 * Obsahuje vestavěné modely bez API klíče
 */
async function generateWithCloudflareAI(message, context, env) {
  // Toto je mock - Cloudflare AI vyžaduje AI bindings
  const responses = {
    'ahoj': 'Ahoj! Jak vám mohu pomoci?',
    'spatial': '🏢 Spatial Computing propojuje fyzický svět s digitální realitou pomocí LiDARu a 3D modelů.',
    'lidar': '📡 LiDAR je senzor, který skenuje prostory pomocí paprsků. Používáme ho pro digitalizaci budov.',
    'bim': '🏗️ BIM je Building Information Model - komplexní digitální model stavby.',
    'dotace': '💰 Řídíme projekty s dotačním financováním z EU fondů (NPO, IROP, OP TAK, SFPI).',
    'kontakt': '📧 Napiš nám na info@whc.cz nebo vyplň formulář na webu.'
  };

  const lowerMsg = message.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) {
      return value;
    }
  }

  return `Děkuji za otázku. Více informací najdeš na webu nebo nás kontaktuj na info@whc.cz`;
}

