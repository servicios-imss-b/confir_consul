import { useState } from 'react';
import { ArrowLeft, Building2, Mail, User, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import type { State } from '@/data/states';

interface Props {
  state: State;
  onBack: () => void;
  onContinue: (entityName: string, email: string) => void;
}

export function StateIntroPage({ state, onBack, onContinue }: Props) {
  const [entityName, setEntityName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canContinue = entityName.trim().length >= 3 && isEmailValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (canContinue) onContinue(entityName.trim(), email.trim());
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f7f4' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1E5B4F 0%, #164739 100%)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <img
            src="https://imssbienestar.gob.mx/assets/img/imb_b.svg"
            alt="IMSS Bienestar"
            className="h-9 object-contain brightness-0 invert flex-shrink-0"
          />
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60 text-xs">Registro de Equipamiento</span>
            </div>
            <h1 className="text-white font-bold text-lg leading-none mt-0.5">{state.name}</h1>
          </div>
          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/30 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-white text-xs">Datos</span>
            </div>
            <div className="w-8 h-px bg-white/30" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                <span className="text-white/50 text-xs font-bold">2</span>
              </div>
              <span className="text-white/40 text-xs">Cuestionario</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* State badge */}
          <div className="flex justify-center mb-6">
            <div
              className="px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm border"
              style={{ background: '#e8f3f1', color: '#1E5B4F', borderColor: '#b8d8d2' }}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {state.name}
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            {/* Top gradient accent */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #1E5B4F, #A57F2C, #9B2247)' }} />

            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Datos del responsable</h2>
              <p className="text-gray-500 text-sm mb-7">
                Complete la información del responsable del cuestionario para continuar.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Entity name */}
                <div>
                  <label htmlFor="entityName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 flex justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      id="entityName"
                      type="text"
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      placeholder="Ej. María González Pérez"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-300 bg-gray-50
                                 focus:outline-none focus:ring-2 focus:border-transparent
                                 transition placeholder:text-gray-400"
                      style={{ '--tw-ring-color': '#1E5B4F' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#1E5B4F'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                  {touched && entityName.trim().length < 3 && (
                    <p className="text-sm mt-1.5 font-medium" style={{ color: '#9B2247' }}>Ingrese el nombre completo del responsable.</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 flex justify-center">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="responsable@salud.gob.mx"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-300 bg-gray-50
                                 focus:outline-none transition placeholder:text-gray-400"
                      onFocus={(e) => e.currentTarget.style.borderColor = '#1E5B4F'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                  {touched && !isEmailValid && (
                    <p className="text-sm mt-1.5 font-medium" style={{ color: '#9B2247' }}>Ingrese un correo electrónico válido.</p>
                  )}
                </div>

                {/* Privacy note */}
                <div
                  className="flex items-start gap-3 rounded-xl p-3.5 text-xs"
                  style={{ background: '#f0f8f6', borderLeft: '3px solid #1E5B4F', color: '#2d6b5f' }}
                >
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#1E5B4F' }} />
                  <p>Sus datos serán utilizados únicamente para dar seguimiento al cuestionario de equipamiento de su unidad médica. Secretaría de Salud.</p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl
                             text-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                             focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                  style={{ background: canContinue ? 'linear-gradient(135deg, #1E5B4F, #2E7A68)' : '#9ca3af' }}
                  disabled={touched && !canContinue}
                >
                  Continuar al cuestionario
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-5">
            Paso 1 de 2 — Datos del responsable · Sistema de Registro de Equipamiento
          </p>
        </div>
      </main>
    </div>
  );
}
