import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';

// ✅ URL DO SUPABASE (Sem a barra '/' no final)
const SUPABASE_URL = 'https://fgeuwpcystjvvlfkwrjw.supabase.co';
// ✅ A TUA CHAVE SERVICE ROLE (Mestra)
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZXV3cGN5c3RqdnZsZmt3cmp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM2NDQ1NiwiZXhwIjoyMDc5OTQwNDU2fQ.iJCOxA3FBbZMTooU21BhF7PeRByBG7S0aoQGc4XISys'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request: Request) {
  console.log("------------------------------------------------");
  console.log("🔑 [LOGIN] A tentar entrar...");

  try {
    const body = await request.json();
    const emailLimpo = body.email.trim().toLowerCase(); // Limpa espaços e maiúsculas
    const passwordInput = body.password;

    console.log(`👤 [LOGIN] Procurando na tabela 'TrabalhoIAIE' pelo email: "${emailLimpo}"`);

    // 1. BUSCAR UTILIZADOR NA TABELA CERTA
    const { data: user, error } = await supabase
      .from('TrabalhoIAIE') // <--- 🚨 MUDANÇA IMPORTANTE: O NOME DA TUA TABELA
      .select('*')
      .eq('email', emailLimpo) // Procura na coluna 'email'
      .single();

    if (error || !user) {
      console.log("❌ [LOGIN] Utilizador não encontrado ou erro de tabela.");
      console.log("   -> Detalhe do erro:", error?.message);
      return NextResponse.json({ error: 'Email não registado' }, { status: 401 });
    }

    console.log("✅ [LOGIN] Encontrado! ID:", user.id);

    // 2. COMPARAR PASSWORDS
    const passwordMatch = await bcrypt.compare(passwordInput, user.password);

    if (!passwordMatch) {
      console.log("❌ [LOGIN] Password errada.");
      return NextResponse.json({ error: 'Password incorreta' }, { status: 401 });
    }

    console.log("✅ [LOGIN] SUCESSO! Login autorizado.");

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.first_name, // Confirma se a coluna se chama 'first_name' na tabela
        email: user.email,
        points: user.points_balance || 0 // Confirma se a coluna se chama 'points_balance'
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ [LOGIN] Erro de servidor:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}