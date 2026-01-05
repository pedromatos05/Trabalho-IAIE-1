import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Receber também o name e o price
    const { product_id, qty, name, price } = body;

    // Validação
    if (!product_id) {
      return NextResponse.json({ error: 'Falta o product_id' }, { status: 400 });
    }
    if (!qty || Number(qty) <= 0) {
      return NextResponse.json({ error: 'Quantidade inválida' }, { status: 400 });
    }

    console.log(`📦 A atualizar stock... Produto: ${name} (${product_id}), Qty: ${qty}`);

    const n8nUrl = process.env.N8N_UPDATE_STOCK_URL;

    // URL de fallback para os teus testes (mas usa o .env preferencialmente)
    const targetUrl = n8nUrl || 'http://193.136.11.144:5609/webhook/7cc39b45-d44e-4973-9544-390f9d9ec846';

    // 2. Enviar tudo para o n8n
    const n8nResponse = await fetch(targetUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ 
           product_id: product_id,   
           qty: qty,
           name: name,   // <--- Novo campo enviado
           price: price  // <--- Novo campo enviado
       })
    });

    if (!n8nResponse.ok) {
       const errorText = await n8nResponse.text();
       throw new Error(`O n8n rejeitou o pedido: ${errorText}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Stock atualizado com sucesso.` 
    });

  } catch (error: any) {
    console.error('[API UPDATE STOCK] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}