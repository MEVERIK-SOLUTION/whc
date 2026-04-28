/**
 * WHC AI Asistent - Cloudflare Worker
 * 
 * Tento worker obsluhuje AI chatbota na webu WHC.
 * Nasaď na https://workers.cloudflare.com
 * 
 * Setup:
 * 1. Vytvoř nový Worker
 * 2. Zkopíruj tento kód
 * 3. Přidej env proměnné (pokud používáš vlastní model)
 * 4. Nasaď
 * 5. Uprav URL v index.html na tvůj Worker URL
 */

export default {
  async fetch(request, env, ctx) {
    // Povolení CORS
    if (request.method === 'OPTIONS') {
      return new Response('OK', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, context } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
      }

      // ============================================
      // VOLBA AI BACKENDU
      // ============================================

      // 1. CLOUDFLARE AI (bez API klíče - integrované)
      // Kompatibilní modely: meta/llama-2-7b-chat-int8, mistral-7b-instruct-v0.1
      
      const reply = await generateWithCloudflareAI(message, context, env);

      // ============================================

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        reply: 'Omlouváme se, došlo k chybě. Zkuste později.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Cloudflare AI (doporučeno - bez dalších API klíčů)
 */
async function generateWithCloudflareAI(message, context, env) {
  try {
    // Použij Cloudflare AI binding (musí být nastaveno v wrangler.toml)
    // Nebo zavolej API přímo - zatím jen mock
    
    const systemPrompt = context || 'Jste AI asistent společnosti WHC s.r.o. Odpovídejte česky, stručně a přátelsky.';
    
    // Příklad odpovědi (v produkci napojit na model)
    const responses = {
      'ahoj': 'Ahoj! Jak ti mohu pomoci?',
      'spatial': 'Spatial Computing je technologie, která propojuje fyzický svět s digitální realitou. WHC se v tom specialistuje!',
      'lidar': 'LiDAR je senzor, který skenuje prostory 3D paprskami. Našich apps jej využívají pro digitalizaci budov.',
      'bim': 'BIM (Building Information Modeling) je komplexní digitální model budovy. Propojujeme jej s našimi skeny.',
      'dotace': 'Naší specialitou je strategické řízení projektů s dotačním financováním z EU.',
      'kontakt': 'Kontaktujte nás na info@whc.cz nebo zaplňte formulář na webu.'
    };

    // Hledej klíčová slova v dotazu
    const lowerMsg = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        return value;
      }
    }

    // Default odpověď
    return `Na vaši zprávu "${message}" jsem připravený odpovědět. Zkuste se zeptat na: Spatial Computing, LiDAR, BIM, dotace, nebo kontakt.`;

  } catch (error) {
    console.error('CF AI Error:', error);
    return 'Omlouváme se, AI model není dostupný. Napište nám na info@whc.cz';
  }
}

/**
 * GitHub Models - Alternativa (vyžaduje API klíč)
 * Aktivuj: const reply = await generateWithGitHubModels(message, context, env);
 */
async function generateWithGitHubModels(message, context, env) {
  const apiKey = env.GITHUB_TOKEN;
  if (!apiKey) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: context || 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 1024,
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub Models API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * OpenAI - Alternativa (vyžaduje API klíč)
 * Aktivuj: const reply = await generateWithOpenAI(message, context, env);
 */
async function generateWithOpenAI(message, context, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: context || 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
