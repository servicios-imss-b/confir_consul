import { ChevronRight, ClipboardList } from 'lucide-react';
import type { State } from '@/data/states';

interface Props {
  states: State[];
  onSelectState: (stateId: string) => void;
}

export function StatesPage({ states, onSelectState }: Props) {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      {/* Hero header */}
      <header style={{ background: 'linear-gradient(135deg, #1E5B4F 0%, #164739 60%, #0f3028 100%)' }}>
        {/* Top bar */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                <ClipboardList className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">Sistema Nacional de Registro</span>
            </div>
            <span className="text-white/50 text-xs">Secretaría de Salud</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-14 pb-16">
          <div className="max-w-2xl">
            <div className="mb-6">
              <img
                src="https://imssbienestar.gob.mx/assets/img/imb_b.svg"
                alt="IMSS Bienestar"
                className="h-12 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Registro de Equipamiento<br />
              <span style={{ color: '#C99E3D' }}>Unidades Médicas</span>
            </h1>
            <p className="text-white/60 text-base mt-4 leading-relaxed max-w-xl">
              Seleccione el estado al que pertenece su unidad médica para comenzar el registro de equipamiento por consultorio.
            </p>


          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1200 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,48 L0,16 Q300,0 600,16 T1200,16 L1200,48 Z" fill="#f8f7f4" />
          </svg>
        </div>
      </header>

      {/* State grid */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {states.map((state, i) => {
            const colors = [
              { bg: '#1E5B4F', light: '#e8f3f1' },
              { bg: '#9B2247', light: '#f5e8ed' },
              { bg: '#A57F2C', light: '#f5efdf' },
            ];
            const c = colors[i % colors.length];
            return (
              <button
                key={state.id}
                onClick={() => onSelectState(state.id)}
                className="group relative bg-white rounded-xl border border-gray-200 p-4 text-left
                           hover:shadow-md hover:-translate-y-0.5 hover:border-transparent
                           transition-all duration-200 focus:outline-none overflow-hidden"
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: c.bg }}
                />
                {/* Abbr badge */}
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 text-xs font-bold transition-colors duration-200"
                  style={{ background: c.light, color: c.bg }}
                >
                  {state.abbr}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-gray-900">{state.name}</p>
                <div
                  className="mt-2 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: c.bg }}
                >
                  Seleccionar <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-10 py-6" style={{ background: '#f0ede8' }}>
        <p className="text-center text-gray-400 text-xs">
          Sistema de Registro de Equipamiento — Secretaría de Salud · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
