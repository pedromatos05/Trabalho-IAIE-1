import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'; 

// --- ALTERAÇÃO AQUI ---
// Em vez de strings fixas, vamos buscar ao .env.local
// O '!' no final serve para dizer ao TypeScript que estas variáveis existem.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // <--- Esta chave resolve o erro "User not found"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// ----------------------

export async function POST(request: Request) {
  console.log("------------------------------------------------");
  console.log("🔑 [LOGIN] A tentar entrar...");

  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
        return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const emailLimpo = body.email.trim().toLowerCase(); 
    const passwordInput = body.password;

    console.log(`👤 [LOGIN] Procurando na tabela 'TrabalhoIAIE' pelo email: "${emailLimpo}"`);

    // 1. BUSCAR UTILIZADOR
    const { data: user, error } = await supabase
      .from('TrabalhoIAIE') 
      .select('*')
      .eq('email', emailLimpo) 
      .single();

    if (error || !user) {
      console.log("❌ [LOGIN] Utilizador não encontrado.");
      return NextResponse.json({ error: 'Email não registado' }, { status: 401 });
    }

    // 2. COMPARAR PASSWORDS
    const passwordMatch = await bcrypt.compare(passwordInput, user.password);

    if (!passwordMatch) {
      console.log("❌ [LOGIN] Password errada.");
      return NextResponse.json({ error: 'Password incorreta' }, { status: 401 });
    }

    const userRole = user.role || 'customer';

    // 3. GERAR UM TOKEN SIMPLES
    const tokenSimulado = `user-token-${user.id}-${Date.now()}`;

    console.log(`✅ [LOGIN] SUCESSO! User: ${user.first_name}, Pontos na DB: ${user.points_balance}`);

    // 4. RETORNAR RESPOSTA CORRIGIDA
    return NextResponse.json({ 
      success: true, 
      token: tokenSimulado, 
      user: {
        id: user.id,
        name: user.first_name, 
        email: user.email,
        points: user.points_balance || 0, 
        role: userRole 
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ [LOGIN] Erro de servidor:", error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}