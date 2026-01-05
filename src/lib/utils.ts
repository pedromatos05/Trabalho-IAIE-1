import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Importe o tipo Customer que você definiu no data.ts
import { Customer } from "@/lib/data" 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- ADICIONE ESTA FUNÇÃO ABAIXO ---

export function isProfileComplete(customer: Customer | null | undefined): boolean {
  // Se não houver cliente logado, considera incompleto
  if (!customer) return false;

  // Verifica se todos os campos obrigatórios estão preenchidos
  // O operador !! converte para verdadeiro/falso (verifica se não está vazio)
  const hasName = !!customer.firstName && !!customer.lastName;
  const hasNif = !!customer.nif;
  const hasAddress = !!customer.address && !!customer.postalCode && !!customer.city;
  
  // Pode adicionar mais campos aqui se necessário (ex: telefone)
  return hasName && hasNif && hasAddress;
}