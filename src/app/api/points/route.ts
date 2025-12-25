import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request: Request) {
  try {
    // 1. 🔒 SEGURANÇA: Ler o Token do Cabeçalho
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Falta o token de autenticação' }, { status: 401 });
    }

    // O header vem como "Bearer eyJhbGci...", queremos só a parte depois do espaço
    const token = authHeader.replace('Bearer ', '');

    // 2. 🕵️‍♂️ VERIFICAÇÃO: Perguntar ao Supabase quem é o dono deste token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    // AQUI ESTÁ O TRUQUE ANTI-HACKER:
    // Ignoramos o email que vem no body. Usamos o email garantido pelo token.
    const emailSeguro = user.email;

    // Lemos apenas a mudança de pontos do corpo
    const body = await request.json();
    const { pointsChange } = body;

    if (pointsChange === undefined) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    console.log(`💎 [API PONTOS] User verificado (${emailSeguro}) a alterar ${pointsChange} pontos.`);

    // 3. Buscar o utilizador na tabela (usando o email seguro)
    const { data: userData, error: fetchError } = await supabase
      .from('TrabalhoIAIE')
      .select('points_balance')
      .eq('email', emailSeguro) // <--- USAMOS A VARIÁVEL SEGURA AQUI
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'Utilizador não encontrado na BD' }, { status: 404 });
    }

    // 4. Calcular novo saldo
    const currentPoints = userData.points_balance || 0;
    const newBalance = currentPoints + pointsChange;

    if (newBalance < 0) {
       return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
    }

    // 5. Gravar na Base de Dados
    const { error: updateError } = await supabase
      .from('TrabalhoIAIE')
      .update({ points_balance: newBalance })
      .eq('email', emailSeguro); // <--- E AQUI TAMBÉM

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, newBalance }, { status: 200 });

  } catch (error: any) {
    console.error("❌ [API PONTOS] Erro:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}