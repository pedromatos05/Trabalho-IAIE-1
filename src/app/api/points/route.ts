import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ Configuração do Supabase (A mesma do Login)
const SUPABASE_URL = 'https://fgeuwpcystjvvlfkwrjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZXV3cGN5c3RqdnZsZmt3cmp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM2NDQ1NiwiZXhwIjoyMDc5OTQwNDU2fQ.iJCOxA3FBbZMTooU21BhF7PeRByBG7S0aoQGc4XISys'; // ⚠️ Cola aqui a tua Service Role Key (a mesma do login)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, pointsChange } = body;

    if (!email || pointsChange === undefined) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    console.log(`💎 [API PONTOS] A alterar ${pointsChange} pontos para: ${email}`);

    // 1. Buscar o utilizador e o saldo atual
    const { data: user, error: fetchError } = await supabase
      .from('TrabalhoIAIE') // ⚠️ Confirma se é este o nome da tua tabela
      .select('points_balance')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      console.error("Erro ao buscar user:", fetchError);
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    }

    // 2. Calcular novo saldo
    const currentPoints = user.points_balance || 0;
    const newBalance = currentPoints + pointsChange;

    // Proteção: Não deixar o saldo ficar negativo
    if (newBalance < 0) {
       return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
    }

    // 3. Gravar na Base de Dados
    const { error: updateError } = await supabase
      .from('TrabalhoIAIE')
      .update({ points_balance: newBalance })
      .eq('email', email);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, newBalance }, { status: 200 });

  } catch (error: any) {
    console.error("❌ [API PONTOS] Erro:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}