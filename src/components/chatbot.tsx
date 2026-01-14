'use client';

import { useState } from 'react';
import { Bot, Send, X, Loader, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from './logo';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ⚠️ IMPORTANTE: Substitui pelo teu URL de Produção do Webhook n8n
  const N8N_WEBHOOK_URL = 'http://193.136.11.144:5609/webhook/76b092a2-6f2b-4b1b-8ec4-dbfa676b8ddd/chat'; 

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Adiciona a mensagem do utilizador à UI
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput(''); 
    setIsLoading(true);

    try {
      // 2. Faz o pedido ao n8n
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ✅ CORREÇÃO: Mudado de 'message' para 'chatInput' conforme o erro do n8n pedia
        body: JSON.stringify({ chatInput: currentInput }),
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();

      // 3. Processa a resposta
      // O n8n (LangChain) costuma devolver { "text": "..." } ou tu configuraste { "response": "..." }
      const botResponseText = data.text || data.response || data.output || "Recebi, mas sem texto.";

      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error getting response from chatbot:', error);
      const errorMessage: Message = {
        text: 'Desculpe, não consegui ligar ao assistente neste momento.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Chat de Suporte"
      >
        <Bot className="h-8 w-8" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col p-0 w-full sm:max-w-[400px]">
          <SheetHeader className="p-4 border-b bg-background">
            <SheetTitle className="flex items-center gap-2 font-headline">
              <Logo className="size-6" />
              Assistente Games Paradise
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                 <div className="text-center text-muted-foreground mt-10 text-sm">
                    <p>Olá! 👋</p>
                    <p>Sou o assistente IA da Games Paradise.</p>
                    <p>Pergunte-me sobre stocks, encomendas ou produtos.</p>
                 </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage asChild src="/icon.png"><Logo/></AvatarImage>
                        <AvatarFallback>GP</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage asChild src="/icon.png"><Logo/></AvatarImage>
                        <AvatarFallback>GP</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-xs text-muted-foreground">A pensar...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="p-4 border-t bg-background">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Escreva a sua pergunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                autoFocus
                className="flex-1"
              />
              <Button type="submit" size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
           
           <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
            </SheetClose>
        </SheetContent>
      </Sheet>
    </>
  );
}