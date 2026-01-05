import { NextResponse } from 'next/server';
// 👇 A MUDANÇA MÁGICA: O asterisco (*) resolve o erro de importação no Next.js
import * as bcrypt from 'bcryptjs'; 

export async function POST(request: Request) {
  console.log("🚀 [API] Recebi pedido em /api/customers");

  try {
    // 1. Ler o corpo (body) que vem do Frontend
    const body = await request.json();

    // 🕵️‍♂️ DEBUG: Verifica no terminal do VS Code se a password aparece aqui
    console.log("📦 [API] Dados recebidos:", { 
        ...body, 
        password: body.password ? "****** (Recebida)" : "NÃO RECEBIDA ❌" 
    });

    // 2. Validação de segurança
    if (!body.password) {
        return NextResponse.json(
            { error: 'Password em falta' }, 
            { status: 400 }
        );
    }

    // 3. Hashing da Password
    // Se o 'bcrypt' não estiver importado com 'import * as', o código CRASHA aqui
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    console.log("🔒 [API] Senha encriptada com sucesso!");

    // 4. Preparar envio para o n8n
    const payloadParaN8N = {
        ...body,
        password: hashedPassword 
    };

    // 5. Enviar para o Webhook do n8n
    const n8nUrl = 'http://193.136.11.144:5609/webhook/d3e77174-680b-4a85-b606-c416e282538b'; // Confirma se o link é este
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadParaN8N),
    });

    // 6. Ler resposta do n8n (Tratando caso não seja JSON)
    const responseText = await response.text();
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        data = { message: "Sucesso (n8n recebeu sem JSON de volta)", raw: responseText };
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error(" [API] ERRO CRÍTICO:", error);
    return NextResponse.json(
        { error: 'Erro interno no servidor', details: error.message }, 
        { status: 500 }
    );
  }
}