import { NextResponse } from 'next/server';
// Importa a tua biblioteca de JWT (ex: jsonwebtoken ou jose)
import jwt from 'jsonwebtoken'; 

const SECRET_KEY = process.env.JWT_SECRET || 'segredo_temporario';

export async function POST(req: Request) {
  try {
    // 1. Ler o Header "Authorization"
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Token não fornecido' }, { status: 401 });
    }

    // 2. Extrair o token (remover a palavra "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verificar se o token é válido
    const decoded: any = jwt.verify(token, SECRET_KEY);
    
    // Agora sabes quem é o user (decoded.id, decoded.role, etc.)
    // Podes verificar se é admin ou customer aqui
    if (!decoded || !decoded.id) {
        return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 403 });
    }

    // --- LÓGICA DE ATUALIZAR PONTOS AQUI ---
    const body = await req.json();
    // (O resto do teu código de base de dados...)

    return NextResponse.json({ success: true, newBalance: 100 }); // Exemplo

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  }
}