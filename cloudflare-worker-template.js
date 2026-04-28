/**
 * WHC AI Asistent - Cloudflare Worker
 *
 * Podporovaní provideři:
 * - GitHub Models (default): AI_PROVIDER=github
 * - NVIDIA NIM: AI_PROVIDER=nvidia
 *
 * Env vars:
 * - AI_PROVIDER: github | nvidia (optional, default github)
 * - GITHUB_TOKEN: required for github
 * - NVIDIA_API_KEY: required for nvidia
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DEFAULT_SYSTEM_PROMPT =
  'Jste AI asistent společnosti WHC s.r.o. ' +
  'Specializace: Spatial Computing, LiDAR, BIM, digitalizace budov, Apple ekosystém, dotační strategie. ' +
  'Odpovídejte česky, stručně, přátelsky a profesionálně. ' +
  'Pro detailní konzultaci doporučte kontakt info@whc.cz.';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response('OK', { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return json({ error: 'Not found' }, 404);
    }

    try {
      const body = await request.json();
      const message = (body?.message || '').trim();
      const context = (body?.context || '').trim();

      if (!message) {
        return json({ error: 'message is required' }, 400);
      }

      const provider = (env.AI_PROVIDER || 'github').toLowerCase();
      const systemPrompt = context || DEFAULT_SYSTEM_PROMPT;

      let reply;
      if (provider === 'nvidia') {
        reply = await generateWithNvidiaNIM(message, systemPrompt, env);
      } else {
        reply = await generateWithGitHubModels(message, systemPrompt, env);
      }

      return json({ reply, provider });
    } catch (error) {
      console.error('Worker error:', error);
      return json(
        {
          reply:
            'Omlouváme se, AI je dočasně nedostupná. Zkuste to prosím znovu, nebo napište na info@whc.cz.',
        },
        500,
      );
    }
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

async function generateWithGitHubModels(message, systemPrompt, env) {
  const apiKey = env.GITHUB_TOKEN;
  if (!apiKey) {
    return 'Chybí GITHUB_TOKEN v nastavení Cloudflare Workeru.';
  }

  const response = await fetch('https://models.inference.ai.azure.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
    }),
  });

  return extractReplyOrThrow(response, 'GitHub Models');
}

async function generateWithNvidiaNIM(message, systemPrompt, env) {
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) {
    return 'Chybí NVIDIA_API_KEY v nastavení Cloudflare Workeru.';
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: 'meta/llama-4-maverick-17b-128e-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
    }),
  });

  return extractReplyOrThrow(response, 'NVIDIA NIM');
}

async function extractReplyOrThrow(response, providerName) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${providerName} error:`, response.status, errorText);
    if (response.status === 401 || response.status === 403) {
      return `Neplatný API klíč pro ${providerName}.`;
    }
    if (response.status === 429) {
      return `Limit požadavků pro ${providerName} byl vyčerpán. Zkuste to za chvíli.`;
    }
    return `Dočasná chyba ${providerName}. Zkuste to prosím později.`;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error(`${providerName} unexpected response:`, data);
    return 'Model nevrátil odpověď ve správném formátu.';
  }

  return content;
}

