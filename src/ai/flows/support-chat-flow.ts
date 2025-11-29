'use server';
/**
 * @fileOverview A support chatbot AI agent.
 *
 * - supportChat - A function that handles the support chat process.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SupportChatInputSchema = z.object({
  query: z.string().describe('The user\'s question about the store.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function supportChat(
  input: SupportChatInput
): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const storePolicies = `
  **Política de Tempo de Entrega:**
  - As encomendas para Portugal Continental são normalmente entregues em 2-3 dias úteis.
  - Para as Ilhas (Açores e Madeira), o tempo de entrega é de 5-7 dias úteis.
  - As entregas são feitas pela transportadora CTT Expresso.
  - Receberá um e-mail de confirmação com um código de seguimento assim que a sua encomenda for enviada.

  **Política de Devoluções:**
  - Aceitamos devoluções no prazo de 14 dias após a receção da encomenda.
  - Os produtos devem ser devolvidos na sua embalagem original, selada e sem sinais de uso.
  - Para iniciar uma devolução, por favor contacte o nosso suporte ao cliente através da sua área de conta.
  - Os custos de envio da devolução são da responsabilidade do cliente, exceto em caso de produto defeituoso ou erro da nossa parte.
  - O reembolso será processado para o método de pagamento original assim que recebermos e verificarmos o produto.

  **Métodos de Pagamento:**
  - Aceitamos os seguintes métodos de pagamento:
    - Cartão de Crédito (Visa, Mastercard, American Express)
    - PayPal
    - MB Way
  - Todos os pagamentos são processados de forma segura. Não armazenamos os detalhes do seu cartão de crédito.

  **Loja de Pontos e Sistema de Pontos:**
  - Por cada euro gasto na nossa loja, ganha 1 ponto (excluindo portes e taxas).
  - Os pontos acumulados podem ser usados para resgatar recompensas exclusivas na nossa Loja de Pontos.
  - As recompensas incluem descontos, produtos gratuitos ou saldo em loja.
  - Também pode usar os seus pontos para comprar produtos diretamente. A taxa de conversão é de 50 pontos por cada 1€ do valor do produto.
  - O seu saldo de pontos pode ser consultado a qualquer momento na sua área de cliente.
  - Os pontos não têm data de validade.
`;

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `É um assistente virtual de apoio ao cliente da Games Paradise. A sua tarefa é responder às perguntas dos utilizadores de forma clara, concisa e amigável.

  Use as seguintes informações sobre as nossas políticas para formular as suas respostas. Se a pergunta não estiver relacionada com estas políticas, responda educadamente que não tem essa informação.

  Contexto das Políticas da Loja:
  ---
  ${storePolicies}
  ---

  Pergunta do Utilizador: {{{query}}}

  Responda à pergunta com base no contexto fornecido.
  `,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
