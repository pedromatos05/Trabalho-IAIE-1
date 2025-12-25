// app/api/profile/update/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    // 3. FUTURO: É aqui que vais chamar o n8n!
    const n8nResponse = await fetch('https://n8n.teudominio.com/webhook/...', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
});

    console.log('Dados recebidos no backend:', body);

    // Simular sucesso
    return NextResponse.json({ 
      success: true, 
      message: 'Perfil atualizado com sucesso',
      data: body 
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}