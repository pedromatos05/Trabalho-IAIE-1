import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Importante: Não fazer cache

export async function GET() {
  try {
    const N8N_WEBHOOK_URL = 'http://193.136.11.144:5609/webhook/60712118-ab17-41c1-9cd1-1cb818f1eda8'; // Confirme se o ID do webhook é este

    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json({ error: 'URL do n8n não configurado' }, { status: 500 });
    }

    // Chama o n8n para pedir a lista atualizada
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Erro ao comunicar com n8n');
    }

    const data = await response.json();
    
    // Devolve os dados ao Frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API GET STOCK] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}