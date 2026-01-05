import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Receber os dados
    const checkoutData = await request.json();

    // ADICIONE ISTO PARA VERIFICAR NO TERMINAL:
    console.log('📦 Dados recebidos do Frontend:', JSON.stringify(checkoutData, null, 2));

    // 2. Configurar o URL do n8n
    const N8N_WEBHOOK_URL = 'http://193.136.11.144:5609/webhook/ce5f80f6-330e-4b2d-bfb3-e668621ec7b5';

    // 3. Enviar para o n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData), // Aqui ele já leva os IDs novos!
    });

    if (!response.ok) {
      throw new Error('O n8n rejeitou o pedido');
    }

    const n8nData = await response.json();

    return NextResponse.json({ success: true, data: n8nData });

  } catch (error) {
    console.error('Erro na API de Checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar checkout' },
      { status: 500 }
    );
  }
}