import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Search, Unlock, Building2, AlertTriangle,
  Loader2, CheckCircle2, Info, ChevronDown, ChevronUp,
  RefreshCw, Lock, X, WifiOff, Save,
} from 'lucide-react';
import type { State } from '@/data/states';
import { EQUIPMENT_QUESTIONS } from '@/data/equipment';
import { CATALOGO_UNIDADES, type UnidadCatalogo } from '@/data/catalogoUnidades';

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwUcleq5TN8iHNJJXMIUlKUsVYKHjqASxYq4kjtt67q4JsKPQrK354pF5VjSHe80OtV/exec';

// ← URL del Apps Script de guardado (nueva hoja)
const SAVE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrc-cYAoi5q8Ya8HKLvF6ei8r_NcsDzOnGf64dbVNWpg8Lwhf0lE-nhTgyCBy2Wsn-/exec';

interface Props {
  state: State;
  entityName: string;
  email: string;
  onBack: () => void;
}

interface DatosUnidad {
  nombre_de_la_unidad?: string;
  categoria_gerencial_ampliada?: string;
  internet?: string | boolean;
  consultorios_habilitados?: number;
  num_consultorios?: number;
}

interface ApiResponse {
  existe: boolean;
  datos_unidad?: DatosUnidad;
  respuestas?: Record<string, unknown>;
}

interface ConsultorioData {
  num: number;
  turno: string | null;
  items: { etiqueta: string; valor: unknown }[];
  llenadas: number;
}

const BRAND = {
  forest: '#1E5B4F',
  forestDark: '#164739',
  forestLight: '#e8f3f1',
  burgundy: '#9B2247',
  burgundyLight: '#f5e8ed',
  gold: '#A57F2C',
  goldLight: '#f5efdf',
};

function normalizar(texto: string) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function labelToKey(label: string) { return label.toLowerCase().replace(/ /g, '_'); }

// ── Caché en sessionStorage (TTL 10 min) ──────────────────────────────────
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos
function cacheKey(clues: string) { return `cq_${clues}`; }
function getCache(clues: string): ApiResponse | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(clues));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(cacheKey(clues)); return null; }
    return data;
  } catch { return null; }
}
function setCache(clues: string, data: ApiResponse) {
  try { sessionStorage.setItem(cacheKey(clues), JSON.stringify({ ts: Date.now(), data })); } catch { /* storage full */ }
}

function parseConsultorios(respuestas: Record<string, unknown>): ConsultorioData[] {
  const mapa: Record<number, ConsultorioData> = {};
  for (const [key, value] of Object.entries(respuestas)) {
    const m = key.match(/_consultorio_(\d+)$/);
    if (!m) continue;
    const num = parseInt(m[1]);
    const pregKey = key.replace(/_consultorio_\d+$/, '');
    if (!mapa[num]) mapa[num] = { num, turno: null, items: [], llenadas: 0 };
    if (pregKey === 'turno') {
      mapa[num].turno = value as string;
    } else if (value !== null && value !== undefined && value !== '') {
      const eq = EQUIPMENT_QUESTIONS.find((q) => labelToKey(q.label) === pregKey);
      mapa[num].items.push({ etiqueta: eq ? eq.label : pregKey.replace(/_/g, ' '), valor: value });
      mapa[num].llenadas++;
    }
  }
  return Object.values(mapa).sort((a, b) => a.num - b.num);
}

function fetchDatos(
  clues: string,
  onData: (d: ApiResponse, fromCache: boolean) => void,
  onError: () => void,
  onDone: () => void
): () => void {
  // Sirve caché inmediatamente si existe
  const cached = getCache(clues);
  if (cached) {
    onData(cached, true);
    onDone();
    return () => {};
  }
  let cancelled = false;
  const controller = new AbortController();
  // Timeout de 45 s — Apps Script puede tardar en "calentarse"
  const timer = setTimeout(() => controller.abort(), 15000);
  fetch(
    SCRIPT_URL + '?accion=consultarDatosCompletos&clues_imb=' + encodeURIComponent(clues),
    { method: 'GET', mode: 'cors', signal: controller.signal }
  )
    .then((r) => r.json())
    .then((d: ApiResponse) => {
      if (!cancelled) {
        setCache(clues, d);
        onData(d, false);
      }
    })
    .catch(() => { if (!cancelled) onError(); })
    .finally(() => { clearTimeout(timer); if (!cancelled) onDone(); });
  return () => { cancelled = true; clearTimeout(timer); };
}

export function QuestionnairePage({ state, entityName, email, onBack }: Props) {
  const catalogo: UnidadCatalogo[] = CATALOGO_UNIDADES[state.id] ?? [];
  const hasCatalogo = catalogo.length > 0;

  // Búsqueda
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [locked, setLocked] = useState(false);
  const [selectedClues, setSelectedClues] = useState('');
  const [selectedNombre, setSelectedNombre] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const recalcDropPos = useCallback(() => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  // Formulario
  const [consultoriesCount, setConsultoriesCount] = useState(0);
  const [nonOperativeCount, setNonOperativeCount] = useState(0);

  // API
  const [loadingData, setLoadingData] = useState(false);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Guardado en nueva hoja
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  // Indica si los valores vienen de la nueva hoja (más reciente)
  const [fromNuevaHoja, setFromNuevaHoja] = useState(false);

  // Detección de conexión
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOff = () => setIsOffline(true);
    const goOn = () => setIsOffline(false);
    window.addEventListener('offline', goOff);
    window.addEventListener('online', goOn);
    return () => { window.removeEventListener('offline', goOff); window.removeEventListener('online', goOn); };
  }, []);

  // Sugerencias del catálogo
  const sugerencias = useMemo(() => {
    if (!hasCatalogo) return [];
    const q = normalizar(query);
    if (!q) return catalogo.slice(0, 10);
    return catalogo
      .filter((u) => normalizar(u.clues_imb).includes(q) || normalizar(u.nombre_de_la_unidad).includes(q))
      .slice(0, 12);
  }, [query, catalogo, hasCatalogo]);

  function buscarClues(clues: string) {
    const c = clues.trim().toUpperCase();
    if (!c) return;
    setLocked(true);
    setSelectedClues(c);
    setShowDropdown(false);
    setLoadingData(true);
    setApiData(null);
    setFetchError(null);
    setExpanded(null);
    setConsultoriesCount(0);
    setNonOperativeCount(0);
    setSaveStatus('idle');
    setFromNuevaHoja(false);

    // 1. Consultar nueva hoja primero (datos más recientes)
    const consultarNuevaHoja = SAVE_SCRIPT_URL
      ? fetch(
          SAVE_SCRIPT_URL + '?accion=consultarRegistro&clues_imb=' + encodeURIComponent(c),
          { method: 'GET', mode: 'cors' }
        )
          .then((r) => r.json())
          .catch(() => null)
      : Promise.resolve(null);

    // 2. Consultar base original (equipamiento + fallback)
    const consultarBaseOriginal = new Promise<void>((resolve) => {
      fetchDatos(
        c,
        (data, cached) => {
          setApiData(data);
          setFromCache(cached);
          if (data.existe && data.datos_unidad) {
            const hab = Number(data.datos_unidad.consultorios_habilitados);
            if (!isNaN(hab) && hab >= 0) setConsultoriesCount(hab);
            const noOp = Number(data.datos_unidad.num_consultorios);
            if (!isNaN(noOp) && noOp >= 0) setNonOperativeCount(noOp);
          }
          resolve();
        },
        () => {
          setFetchError('Sin respuesta del servidor (45 s). Presiona "Reintentar" — puede ser el primer acceso del día.');
          resolve();
        },
        () => {}
      );
    });

    // Ejecutar ambas en paralelo; nueva hoja sobreescribe si tiene datos más recientes
    Promise.all([consultarNuevaHoja, consultarBaseOriginal]).then(([nueva]) => {
      if (nueva?.existe) {
        // La nueva hoja tiene datos → usarlos (son los más recientes)
        if (nueva.consultorios_habilitados != null)
          setConsultoriesCount(Number(nueva.consultorios_habilitados));
        if (nueva.consultorios_no_operativos != null)
          setNonOperativeCount(Number(nueva.consultorios_no_operativos));
        setFromNuevaHoja(true);
      }
      setLoadingData(false);
    });
  }

  function seleccionarDeLista(u: UnidadCatalogo) {
    setQuery(u.clues_imb + ' — ' + u.nombre_de_la_unidad);
    setSelectedNombre(u.nombre_de_la_unidad);
    buscarClues(u.clues_imb);
  }

  function desbloquear() {
    setLocked(false);
    setSelectedClues('');
    setSelectedNombre('');
    setQuery('');
    setApiData(null);
    setFetchError(null);
    setConsultoriesCount(0);
    setNonOperativeCount(0);
    setSaveStatus('idle');
    setFromNuevaHoja(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function guardarRegistro() {
    if (!selectedClues) return;
    if (!SAVE_SCRIPT_URL) {
      alert('Configura SAVE_SCRIPT_URL en QuestionnairePage.tsx con la URL de tu Apps Script.');
      return;
    }
    setSaving(true);
    setSaveStatus('idle');
    const payload = {
      entidad:                  state.name.toUpperCase(),
      usuario_nombre:           entityName,
      usuario_email:            email,
      clues_imb:                selectedClues,
      nombre_de_la_unidad:      selectedNombre || datosUnidad?.nombre_de_la_unidad || '',
      categoria:                datosUnidad?.categoria_gerencial_ampliada || '',
      consultorios_habilitados:    consultoriesCount,
      consultorios_no_operativos:  nonOperativeCount,
    };
    fetch(SAVE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(() => setSaveStatus('ok'))
      .catch(() => setSaveStatus('error'))
      .finally(() => setSaving(false));
  }

  const datosUnidad = apiData?.datos_unidad;
  const consultorios = apiData?.respuestas ? parseConsultorios(apiData.respuestas) : [];

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-md"
        style={{ background: 'linear-gradient(135deg, #1E5B4F 0%, #164739 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-4">
          <img
            src="https://imssbienestar.gob.mx/assets/img/imb_b.svg"
            alt="IMSS Bienestar"
            className="h-8 object-contain brightness-0 invert flex-shrink-0"
          />
          <button onClick={onBack} aria-label="Volver"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-base leading-none">Cuestionario de Equipamiento</h1>
            <p className="text-white/60 text-xs mt-0.5 truncate">{state.name} · {entityName} · {email}</p>
          </div>
          {loadingData && (
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Consultando…
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* ===== BANNER SIN INTERNET ===== */}
        {isOffline && (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: '#fff3f3', border: `1px solid ${BRAND.burgundy}40`, color: BRAND.burgundy }}>
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Sin conexión a internet</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: '#b45369' }}>
                Tus respuestas <strong>no se guardarán</strong> hasta que se restablezca la conexión.
              </p>
            </div>
          </div>
        )}

        {/* ===== DROPDOWN FIJO (fuera del card para evitar overflow-hidden) ===== */}
        {showDropdown && !locked && hasCatalogo && dropPos && (
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-y-auto"
            style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width, maxHeight: 280 }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Header estado */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between"
              style={{ background: BRAND.forestLight }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: BRAND.forest }}>
                {state.name}
              </span>
              <span className="text-xs text-gray-400">
                {sugerencias.length} de {catalogo.length}
              </span>
            </div>
            {sugerencias.length === 0 ? (
              <div className="px-4 py-5 text-center text-sm text-gray-400">
                Sin coincidencias — presiona Buscar para consultar directamente
              </div>
            ) : sugerencias.map((u) => {
              const q = normalizar(query);
              const cluesMatch = q && normalizar(u.clues_imb).includes(q);
              const nombreMatch = q && normalizar(u.nombre_de_la_unidad).includes(q);
              return (
                <button key={u.clues_imb} onMouseDown={() => seleccionarDeLista(u)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm truncate ${nombreMatch ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {u.nombre_de_la_unidad}
                    </p>
                    <span className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 font-semibold"
                      style={cluesMatch
                        ? { background: BRAND.forest, color: '#fff' }
                        : { background: BRAND.forestLight, color: BRAND.forest }}>
                      {u.clues_imb}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ===== BUSCADOR ===== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Título */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: BRAND.forestLight }}>
                <Building2 className="w-5 h-5" style={{ color: BRAND.forest }} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Unidad médica</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {hasCatalogo
                    ? `${catalogo.length} unidades en ${state.name}`
                    : 'Escribe el CLUES y presiona Buscar'}
                </p>
              </div>
            </div>
            {locked && (
              <button onClick={desbloquear}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: BRAND.burgundyLight, color: BRAND.burgundy }}>
                <Unlock className="w-3.5 h-3.5" /> Cambiar
              </button>
            )}
          </div>

          {/* Input + botón buscar */}
          <div className="px-6 pb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); if (!locked) { recalcDropPos(); setShowDropdown(true); } }}
                  onFocus={() => { if (!locked) { recalcDropPos(); setShowDropdown(true); } }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowDropdown(false);
                    if (e.key === 'Enter' && !locked) {
                      if (sugerencias.length === 1) seleccionarDeLista(sugerencias[0]);
                      else buscarClues(query);
                    }
                  }}
                  disabled={locked}
                  placeholder={hasCatalogo ? 'Busca por CLUES o nombre de unidad…' : 'Ej. GRIMB010256…'}
                  className={`w-full pl-10 ${locked ? 'pr-10' : 'pr-4'} py-3 text-sm rounded-lg border transition ${
                    locked ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none'
                  }`}
                  onFocusCapture={(e) => { if (!locked) e.currentTarget.style.borderColor = BRAND.forest; }}
                  onBlurCapture={(e) => { if (!locked) e.currentTarget.style.borderColor = ''; }}
                />
                {locked && (
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                )}
                {!locked && query && (
                  <button onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}


              </div>

              {/* Botón buscar (siempre disponible) */}
              {!locked && (
                <button
                  onClick={() => { if (sugerencias.length === 1 && hasCatalogo) seleccionarDeLista(sugerencias[0]); else buscarClues(query); }}
                  disabled={loadingData || !query.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white transition disabled:opacity-40 flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${BRAND.forest}, ${BRAND.forestDark})` }}>
                  {loadingData
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Buscando…</>
                    : <><Search className="w-4 h-4" />Buscar</>}
                </button>
              )}
            </div>
          </div>

          {/* Lista estática — solo cuando NO hay dropdown activo ni texto escrito */}
          {!locked && hasCatalogo && !query && !showDropdown && (
            <div className="border-t border-gray-100">
              <div className="px-6 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Unidades disponibles en {state.name}
                </span>
                <span className="text-xs text-gray-400">{catalogo.length} unidades</span>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {catalogo.map((u) => (
                  <button key={u.clues_imb} onClick={() => seleccionarDeLista(u)}
                    className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-800 truncate">{u.nombre_de_la_unidad}</p>
                    <span className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 font-semibold"
                      style={{ background: BRAND.forestLight, color: BRAND.forest }}>
                      {u.clues_imb}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estado de la consulta */}
          {locked && (
            <div className="px-6 pb-5">
              {loadingData && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: BRAND.forest }} />
                  Consultando datos para <strong className="ml-1">{selectedClues}</strong>…
                </div>
              )}
              {!loadingData && fromNuevaHoja && (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valores precargados desde la última edición guardada
                </div>
              )}
              {!loadingData && !fromNuevaHoja && fromCache && apiData?.existe && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                  Datos desde caché local — presiona <strong className="mx-0.5">Actualizar</strong> para ver cambios recientes
                </div>
              )}
              {!loadingData && fetchError && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                  style={{ background: '#fff3f3', color: BRAND.burgundy, border: `1px solid ${BRAND.burgundy}30` }}>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {fetchError}
                </div>
              )}
              {!loadingData && apiData && !apiData.existe && !fromNuevaHoja && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                  style={{ background: '#fef9e7', color: '#7a6535', border: `1px solid ${BRAND.gold}40` }}>
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  Sin datos previos para <strong className="ml-1">{selectedClues}</strong> — comenzará desde cero.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== CONSULTORIOS GUARDADOS ===== */}
        {consultorios.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm px-1">
              Datos guardados por consultorio ({consultorios.length})
            </h3>
            {consultorios.map((c) => {
              const isOpen = expanded === c.num;
              const total = EQUIPMENT_QUESTIONS.length;
              const pct = Math.round((c.llenadas / total) * 100);
              return (
                <div key={c.num} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <button className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    onClick={() => setExpanded(isOpen ? null : c.num)}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: BRAND.forest }}>{c.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800">Consultorio {c.num}</span>
                        {c.turno && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase"
                            style={{ background: BRAND.goldLight, color: '#5a4a1a' }}>{c.turno}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: pct === 100 ? BRAND.forest : BRAND.gold }} />
                        </div>
                        <span className="text-xs text-gray-400 tabular-nums">{c.llenadas}/{total}</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                             : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-4">
                      {c.items.length === 0
                        ? <p className="text-sm text-gray-400">Sin equipamiento registrado.</p>
                        : <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {c.items.map((r) => (
                              <div key={r.etiqueta}
                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                                <span className="text-gray-600 truncate">{r.etiqueta}</span>
                                <span className="font-bold tabular-nums flex-shrink-0"
                                  style={{ color: Number(r.valor) > 0 ? BRAND.forest : '#2563eb' }}>
                                  {String(r.valor)}
                                </span>
                              </div>
                            ))}
                          </div>
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== CONSULTORIOS HABILITADOS ===== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-1">Consultorios generales habilitados</h3>
          <p className="text-sm text-gray-500 mb-4">Indique cuántos consultorios tiene la unidad.</p>
          <div className="flex items-center gap-4">
            <input type="number" min={0} max={50} value={consultoriesCount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || val === '-') return;
                setConsultoriesCount(Math.max(0, Math.min(50, parseInt(val) || 0)));
              }}
              className="w-28 px-3 py-3 text-xl font-bold text-center rounded-lg border border-gray-300 focus:outline-none tabular-nums"
              onFocus={(e) => { e.currentTarget.style.borderColor = BRAND.forest; e.currentTarget.select(); }}
              onBlur={(e) => e.currentTarget.style.borderColor = ''} />
            <span className="text-sm text-gray-500">
              {consultoriesCount === 0
                ? <span className="font-medium" style={{ color: BRAND.forest }}>Sin consultorios registrados</span>
                : <>{consultoriesCount} consultorio{consultoriesCount !== 1 ? 's' : ''}</>}
            </span>
          </div>
        </div>

        {/* ===== NO OPERATIVOS ===== */}
        <div className="rounded-xl p-6"
          style={{ background: 'linear-gradient(135deg, #f5efdf 0%, #ede0c4 100%)', border: `1px solid ${BRAND.gold}40` }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
              <div>
                <p className="text-sm font-semibold leading-tight" style={{ color: '#5a4a1a' }}>
                  Consultorios disponibles no operativos por turno debido a insuficiencia de personal
                </p>
                <p className="text-xs mt-1" style={{ color: '#7a6535' }}>
                  Configurados: <span className="font-bold">{consultoriesCount}</span>
                </p>
              </div>
            </div>
            <input type="number" min={0} max={50} value={nonOperativeCount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || val === '-') return;
                setNonOperativeCount(Math.max(0, Math.min(50, parseInt(val) || 0)));
              }}
              className="w-24 px-3 py-3 text-center text-xl font-bold rounded-lg border bg-white focus:outline-none tabular-nums"
              onFocus={(e) => e.currentTarget.select()}
              style={{ borderColor: `${BRAND.gold}60` }} />
          </div>
        </div>

        {/* ===== BOTÓN GUARDAR ===== */}
        {selectedClues && (
          <div className="space-y-4 pb-4">
            {/* Instrucciones */}
            <div className="rounded-xl p-4 border"
              style={{ background: '#f0f8f6', borderColor: `${BRAND.forest}25` }}>
              <p className="text-sm font-bold mb-2" style={{ color: BRAND.forest }}>
                Antes de guardar, verifica la información:
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: '#2d5f55' }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: BRAND.gold }}>①</span>
                  Revisa el número de <strong>consultorios habilitados</strong> — si no es correcto, cámbialo al valor real antes de continuar.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: BRAND.gold }}>②</span>
                  Revisa los <strong>consultorios no operativos</strong> — si el número es incorrecto, corrígelo.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: BRAND.forest }}>③</span>
                  Si toda la información es correcta, presiona <strong>{fromNuevaHoja ? 'Actualizar registro' : 'Guardar registro'}</strong>.
                </li>
              </ul>
            </div>

            {/* Estado y botón */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs min-h-[20px]">
                {saveStatus === 'ok' && (
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: BRAND.forest }}>
                    <CheckCircle2 className="w-4 h-4" /> Guardado correctamente
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: BRAND.burgundy }}>
                    <AlertTriangle className="w-4 h-4" /> Error al guardar — revisa la URL del script
                  </span>
                )}
              </div>
              <button
                onClick={guardarRegistro}
                disabled={saving || isOffline}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition hover:shadow-lg active:scale-95 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${BRAND.forest}, ${BRAND.forestDark})` }}
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando…</>
                  : fromNuevaHoja
                    ? <><RefreshCw className="w-4 h-4" />Actualizar registro</>
                    : <><Save className="w-4 h-4" />Guardar registro</>
                }
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function DataTile({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
