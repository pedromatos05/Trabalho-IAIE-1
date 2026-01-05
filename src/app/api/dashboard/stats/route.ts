import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // ⚠️ CONFIRME SE ESTE URL ESTÁ CERTO E SE O WORKFLOW ESTÁ ATIVO/A OUVIR
  const N8N_URL = 'http://193.136.11.144:5609/webhook/26561efd-6a6b-4de2-b76d-5cb052955b96'; 

  console.log("🚀 1. O Next.js vai tentar chamar o n8n agora...");
  console.log("👉 URL:", N8N_URL);

  try {
    const response = await fetch(N8N_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    console.log("u2705 2. O n8n respondeu com status:", response.status);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const textData = await response.text();
    console.log("📦 3. Dados recebidos do n8n:", textData);

    // Tentar converter para JSON
    try {
        const jsonData = JSON.parse(textData);
        return NextResponse.json(jsonData);
    } catch (e) {
        console.error("❌ O n8n não devolveu JSON válido. Devolveu texto.");
        return NextResponse.json({ totalRevenue: 0, recentSales: [] });
    }

  } catch (error) {
    console.error("❌ ERRO FATAL: O Next.js não conseguiu conectar ao n8n.");
    console.error(error);
    return NextResponse.json({ totalRevenue: 0, recentSales: [] });
  }
}