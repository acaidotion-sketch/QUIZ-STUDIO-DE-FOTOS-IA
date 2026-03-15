/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  MessageSquare,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Types
interface QuizAnswers {
  objective: string;
  style: string;
  frequency: string;
  name: string;
  email: string;
  phone: string;
  instagram?: string;
}

const STEPS = 8;

export default function App() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    objective: '',
    style: '',
    frequency: '',
    name: '',
    email: '',
    phone: '',
  });
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes

  // Gemini Initialization
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' }), []);

  // Timer for Step 7
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 7 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setTimeout(() => setStep(prev => prev + 1), 300);
  };

  const generateDiagnosis = async () => {
    setIsLoading(true);
    setStep(5);
    try {
      const prompt = `
        Você é um especialista em imagem pessoal e fotografia. 
        Analise as seguintes respostas de um cliente para o "Studio de Fotos Digital Online IA":
        - Objetivo: ${answers.objective}
        - Estilo: ${answers.style}
        - Frequência de uso: ${answers.frequency}
        
        Crie um diagnóstico personalizado curto (máximo 3 parágrafos) em tom profissional e encorajador.
        Destaque como fotos geradas por IA podem resolver os desafios dele e elevar sua autoridade visual.
        Use Markdown para formatação.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setDiagnosis(response.text || 'Não foi possível gerar seu diagnóstico no momento, mas estamos prontos para transformar sua imagem!');
    } catch (error) {
      console.error("Error generating diagnosis:", error);
      setDiagnosis("Ocorreu um erro ao processar seu diagnóstico. Prossiga para ver como podemos ajudar!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDiagnosis();
  };

  const openPayment = () => {
    window.open('https://loja.infinitepay.io/fenixdigital/mav3162-studio-de-fotos-digital-online-ia', '_blank');
    setStep(8);
  };

  const redirectToWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Acabei de fazer o quiz no Studio de Fotos IA.\nNome: ${answers.name}\nObjetivo: ${answers.objective}\nEstilo: ${answers.style}\nQuero minhas fotos profissionais!`);
    window.open(`https://wa.me/5591981305395?text=${message}`, '_blank');
  };

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [recentPurchase, setRecentPurchase] = useState<{name: string, city: string} | null>(null);

  // Recent Purchase Notifications
  useEffect(() => {
    const buyers = [
      { name: "Ana", city: "Belém" },
      { name: "Carlos", city: "São Paulo" },
      { name: "Juliana", city: "Curitiba" },
      { name: "Marcos", city: "Fortaleza" },
      { name: "Fernanda", city: "Rio de Janeiro" },
      { name: "Pedro", city: "Belo Horizonte" },
      { name: "Sofia", city: "Salvador" },
      { name: "Lucas", city: "Porto Alegre" }
    ];

    const interval = setInterval(() => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      setRecentPurchase(randomBuyer);
      setTimeout(() => setRecentPurchase(null), 5000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const applyCoupon = () => {
    const code = coupon.toUpperCase();
    if (code === 'FENIX10') {
      setDiscount(1.49);
      setCouponError('');
    } else if (code === 'PROMO5') {
      setDiscount(5);
      setCouponError('');
    } else if (code === 'VIPSTUDIO') {
      setDiscount(2.98);
      setCouponError('');
    } else {
      setCouponError('Cupom inválido');
      setDiscount(0);
    }
  };

  const finalPrice = Math.max(0, 14.9 - discount).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Recent Purchase Notification */}
      <AnimatePresence>
        {recentPurchase && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-4 left-4 z-50 glass-card p-3 flex items-center gap-3 shadow-2xl border-accent/20"
          >
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent">
              <Zap size={16} />
            </div>
            <div className="text-[10px] leading-tight">
              <p className="font-bold text-white">{recentPurchase.name} de {recentPurchase.city}</p>
              <p className="text-white/60">acabou de garantir suas fotos!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full max-w-2xl mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} />
          Quiz de Diagnóstico
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Studio de Fotos Digital <span className="text-accent">Online IA</span>
        </h1>
        <p className="text-white/60 text-sm">Fênix Digital — Transformando sua imagem com IA</p>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-white/5 h-1.5 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(step / STEPS) * 100}%` }}
        />
      </div>

      <main className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Objective */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h2 className="text-xl font-bold mb-6">Qual é o seu principal objetivo com as fotos?</h2>
              <div className="space-y-3">
                {[
                  "Autoridade no LinkedIn/Profissional",
                  "Engajamento nas Redes Sociais",
                  "Uso em Site ou Landing Page",
                  "Melhorar Imagem Pessoal"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleOptionSelect('objective', opt)}
                    className="quiz-option"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Style */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h2 className="text-xl font-bold mb-6">Qual estilo de foto você prefere?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Executivo/Corporativo",
                  "Casual Moderno",
                  "Lifestyle/Outdoor",
                  "Estúdio Minimalista"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleOptionSelect('style', opt)}
                    className="quiz-option h-full flex items-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h2 className="text-xl font-bold mb-6">Com que frequência você atualiza suas fotos?</h2>
              <div className="space-y-3">
                {[
                  "Todo mês para conteúdo",
                  "A cada 6 meses",
                  "Uma vez por ano",
                  "Raramente atualizo"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleOptionSelect('frequency', opt)}
                    className="quiz-option"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Lead Capture */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h2 className="text-xl font-bold mb-2">Quase lá!</h2>
              <p className="text-white/60 mb-6 text-sm">Preencha seus dados para receber o diagnóstico da nossa IA.</p>
              
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                      required
                      type="text"
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                      value={answers.name}
                      onChange={e => setAnswers({...answers, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                      required
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                      value={answers.email}
                      onChange={e => setAnswers({...answers, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                      required
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                      value={answers.phone}
                      onChange={e => setAnswers({...answers, phone: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="gold-button w-full flex items-center justify-center gap-2 mt-4">
                  Ver Meu Diagnóstico <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 5: Diagnosis */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card text-center"
            >
              {isLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                  <p className="text-accent font-bold animate-pulse">Gemini está analisando seu perfil...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                    <Sparkles size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Seu Diagnóstico IA</h2>
                  <div className="text-white/80 text-sm leading-relaxed mb-8 text-left bg-white/5 p-6 rounded-xl border border-white/10">
                    {diagnosis.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  <button 
                    onClick={() => setStep(6)}
                    className="gold-button w-full"
                  >
                    Ver Resultados Reais
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Step 6: Social Proof */}
          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Resultados de Clientes</h2>
                <p className="text-white/60">Veja a transformação que a nossa IA proporciona.</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="glass-card p-4">
                  <div className="proof-images">
                    <div className="proof-img-wrap">
                      <img src="https://i.imgur.com/Ql6zSU9.jpeg" alt="Antes" referrerPolicy="no-referrer" />
                    </div>
                    <div className="proof-img-wrap">
                      <img src="https://i.imgur.com/We0eZze.jpeg" alt="Depois IA" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                      AM
                    </div>
                    <div>
                      <p className="text-sm font-bold">Ana M. — Designer</p>
                      <div className="flex text-accent">
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-3 italic">"Parece foto de estúdio de verdade. Fiquei impressionada!"</p>
                </div>
              </div>

              <button 
                onClick={() => setStep(7)}
                className="gold-button w-full flex items-center justify-center gap-2"
              >
                Quero Minhas Fotos Agora <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 7: Payment */}
          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card"
            >
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-accent/20 rounded-2xl text-accent mb-4">
                  <Zap size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Oferta Exclusiva</h2>
                <p className="text-white/60 text-sm">Qualquer estilo, resultado profissional em minutos.</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60">Pacote 1 Foto Profissional</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <span className="text-xs text-white/40 line-through block">R$ 14,90</span>
                    )}
                    <span className="text-2xl font-bold text-accent">R$ {finalPrice.replace('.', ',')}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Alta resolução (4K)",
                    "Qualquer estilo (Corporativo, Casual, etc)",
                    "Entrega em até 24h",
                    "Suporte via WhatsApp"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 size={16} className="text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] uppercase font-bold text-white/40 mb-2">Tem um cupom?</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="CÓDIGO"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                    />
                    <button 
                      onClick={applyCoupon}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-400 mt-1">{couponError}</p>}
                  {discount > 0 && <p className="text-[10px] text-emerald-400 mt-1">Desconto aplicado com sucesso!</p>}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                  <Clock size={14} />
                  OFERTA RESERVADA POR: {formatTime(timer)}
                </div>
                
                <button 
                  onClick={openPayment}
                  disabled={timer <= 0}
                  className="gold-button w-full flex flex-col items-center py-6"
                >
                  <span className="text-lg">PAGAR R$ {finalPrice.replace('.', ',')}</span>
                  <span className="text-[10px] opacity-80">Pagamento Seguro via InfinitePay</span>
                </button>

                <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest">
                  <div className="flex items-center gap-1"><ShieldCheck size={12} /> 100% Seguro</div>
                  <div className="flex items-center gap-1"><Zap size={12} /> Entrega Rápida</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 8: Success */}
          {step === 8 && (
            <motion.div 
              key="step8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Quase Tudo Pronto!</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Para finalizar a criação das suas fotos, clique no botão abaixo para falar com nosso suporte no WhatsApp e enviar sua foto de referência.
              </p>

              <button 
                onClick={redirectToWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare size={20} />
                Falar no WhatsApp Agora
              </button>

              <p className="text-[10px] text-white/40 mt-6 uppercase tracking-widest">
                Fênix Digital — Atendimento das 08h às 22h
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-white/20 text-[10px] uppercase tracking-[0.2em]">
        &copy; 2026 Fênix Digital • Studio de Fotos IA
      </footer>
    </div>
  );
}
