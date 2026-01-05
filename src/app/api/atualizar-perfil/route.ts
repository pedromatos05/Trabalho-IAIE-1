import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch('http://193.136.11.144:5609/webhook/f9344d6e-1f95-4174-9dcf-48626055175c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Se o n8n responder com erro (ex: e-mail já existe)
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao conectar ao servidor' }, { status: 500 });
  }
}