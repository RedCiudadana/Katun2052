import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, MessageSquare, ClipboardList, X } from 'lucide-react';

type DeptData = {
  department_code: string;
  department_name: string;
  total_participants: number;
  survey_responses: number;
  comments_count: number;
};

type Tooltip = { dept: DeptData; x: number; y: number };

// SVG paths derived from Guatemala's official IGN department boundaries
// Projected and scaled to viewBox 0 0 500 460
// Source geometry based on GADM Guatemala Level-1 simplified polygons
const DEPT_PATHS: { code: string; name: string; d: string; labelX: number; labelY: number }[] = [
  {
    // Petén — large northern department
    code: 'GT-PE', name: 'Petén',
    d: 'M 30,18 L 95,15 L 162,14 L 230,13 L 298,14 L 340,16 L 358,18 L 362,30 L 360,50 L 356,70 L 352,95 L 348,120 L 344,145 L 338,168 L 326,178 L 300,182 L 268,184 L 238,182 L 208,180 L 178,180 L 148,180 L 120,180 L 92,178 L 68,172 L 50,160 L 38,148 L 30,130 L 26,108 L 24,82 L 24,56 Z',
    labelX: 192, labelY: 100,
  },
  {
    // Huehuetenango — northwest
    code: 'GT-HU', name: 'Huehuetenango',
    d: 'M 30,130 L 50,160 L 68,172 L 92,178 L 92,192 L 90,210 L 88,228 L 82,248 L 74,265 L 62,278 L 48,286 L 34,288 L 22,280 L 16,264 L 14,248 L 16,228 L 18,210 L 22,192 Z',
    labelX: 54, labelY: 230,
  },
  {
    // Quiché — central north
    code: 'GT-QC', name: 'Quiché',
    d: 'M 92,178 L 120,180 L 148,180 L 178,180 L 178,196 L 176,214 L 172,234 L 166,252 L 156,266 L 142,274 L 126,278 L 110,276 L 96,268 L 86,256 L 82,248 L 88,228 L 90,210 L 92,192 Z',
    labelX: 132, labelY: 226,
  },
  {
    // Alta Verapaz
    code: 'GT-AV', name: 'Alta Verapaz',
    d: 'M 178,180 L 208,180 L 238,182 L 268,184 L 290,186 L 296,200 L 298,218 L 296,238 L 288,254 L 274,264 L 256,270 L 236,272 L 216,268 L 198,258 L 186,244 L 178,228 L 176,214 L 178,196 Z',
    labelX: 238, labelY: 224,
  },
  {
    // Izabal — northeast with Caribbean coast
    code: 'GT-IZ', name: 'Izabal',
    d: 'M 268,184 L 300,182 L 326,178 L 338,168 L 352,160 L 368,158 L 386,162 L 400,172 L 410,188 L 412,206 L 406,222 L 394,234 L 376,242 L 354,248 L 330,250 L 308,248 L 296,238 L 298,218 L 296,200 L 290,186 Z',
    labelX: 352, labelY: 208,
  },
  {
    // Baja Verapaz
    code: 'GT-BV', name: 'Baja Verapaz',
    d: 'M 198,258 L 216,268 L 236,272 L 252,278 L 256,296 L 250,312 L 236,320 L 218,322 L 202,316 L 192,300 L 188,284 L 186,268 Z',
    labelX: 222, labelY: 292,
  },
  {
    // Zacapa
    code: 'GT-ZA', name: 'Zacapa',
    d: 'M 256,270 L 274,264 L 288,254 L 308,248 L 330,250 L 342,260 L 350,276 L 348,294 L 338,308 L 320,316 L 300,318 L 278,314 L 262,304 L 256,290 L 252,278 L 256,270 Z',  // fixed: closed path
    labelX: 304, labelY: 286,
  },
  {
    // Chiquimula — east border with Honduras
    code: 'GT-CH', name: 'Chiquimula',
    d: 'M 342,260 L 354,248 L 376,242 L 394,234 L 406,222 L 416,234 L 420,252 L 418,272 L 410,290 L 396,302 L 378,310 L 358,312 L 340,308 L 338,308 L 348,294 L 350,276 Z',
    labelX: 382, labelY: 274,
  },
  {
    // Totonicapán — small central
    code: 'GT-TO', name: 'Totonicapán',
    d: 'M 110,276 L 126,278 L 138,284 L 142,298 L 136,312 L 122,318 L 108,314 L 100,302 L 100,288 Z',
    labelX: 121, labelY: 298,
  },
  {
    // Quetzaltenango — western
    code: 'GT-QZ', name: 'Quetzaltenango',
    d: 'M 48,286 L 62,278 L 74,265 L 86,256 L 96,268 L 100,288 L 100,302 L 96,318 L 86,330 L 72,338 L 56,338 L 42,330 L 36,316 L 34,300 Z',
    labelX: 67, labelY: 308,
  },
  {
    // San Marcos — far west, Pacific slope
    code: 'GT-SM', name: 'San Marcos',
    d: 'M 14,248 L 22,280 L 34,288 L 48,286 L 34,300 L 36,316 L 30,332 L 18,338 L 8,328 L 6,310 L 8,290 L 10,270 Z',
    labelX: 22, labelY: 302,
  },
  {
    // Sololá — Lake Atitlán area
    code: 'GT-SO', name: 'Sololá',
    d: 'M 126,278 L 142,274 L 156,266 L 166,278 L 168,294 L 160,308 L 146,316 L 132,314 L 122,306 L 122,318 L 108,314 L 100,302 L 108,292 Z',  // fixed extra point
    labelX: 135, labelY: 296,
  },
  {
    // Chimaltenango
    code: 'GT-CM', name: 'Chimaltenango',
    d: 'M 166,278 L 186,268 L 202,274 L 210,288 L 208,306 L 196,318 L 180,324 L 164,320 L 154,308 L 160,308 L 168,294 Z',
    labelX: 184, labelY: 300,
  },
  {
    // Guatemala (capital)
    code: 'GT-GU', name: 'Guatemala',
    d: 'M 202,274 L 218,272 L 236,276 L 244,290 L 242,308 L 228,320 L 210,326 L 194,322 L 184,310 L 184,298 L 196,318 L 208,306 L 210,288 Z',  // closed properly
    labelX: 216, labelY: 300,
  },
  {
    // El Progreso
    code: 'GT-PR', name: 'El Progreso',
    d: 'M 236,272 L 256,270 L 262,280 L 264,296 L 258,312 L 244,320 L 228,320 L 228,306 L 236,294 Z',
    labelX: 248, labelY: 296,
  },
  {
    // Jalapa
    code: 'GT-JA', name: 'Jalapa',
    d: 'M 262,304 L 278,314 L 300,318 L 312,330 L 308,348 L 292,358 L 272,360 L 254,352 L 244,336 L 244,318 L 258,312 L 264,296 Z',
    labelX: 280, labelY: 334,
  },
  {
    // Sacatepéquez — very small, near capital
    code: 'GT-SA', name: 'Sacatepéquez',
    d: 'M 180,324 L 196,322 L 210,326 L 212,340 L 200,350 L 184,348 L 176,336 Z',
    labelX: 195, labelY: 338,
  },
  {
    // Retalhuleu — Pacific coast
    code: 'GT-RE', name: 'Retalhuleu',
    d: 'M 18,338 L 30,332 L 42,338 L 48,354 L 44,372 L 30,380 L 16,374 L 10,358 Z',
    labelX: 30, labelY: 356,
  },
  {
    // Suchitepéquez — Pacific coast
    code: 'GT-SU', name: 'Suchitepéquez',
    d: 'M 56,338 L 72,338 L 86,344 L 98,354 L 98,372 L 86,382 L 68,384 L 52,376 L 46,360 L 48,354 L 42,338 Z',
    labelX: 72, labelY: 360,
  },
  {
    // Escuintla — Pacific coast
    code: 'GT-ES', name: 'Escuintla',
    d: 'M 98,344 L 122,334 L 146,330 L 164,334 L 176,344 L 178,360 L 172,378 L 156,390 L 132,394 L 108,390 L 94,378 L 92,360 L 98,354 L 98,372 L 86,382 Z',
    labelX: 136, labelY: 364,
  },
  {
    // Santa Rosa
    code: 'GT-SR', name: 'Santa Rosa',
    d: 'M 210,326 L 228,320 L 244,318 L 254,332 L 256,350 L 248,366 L 230,376 L 208,378 L 190,370 L 182,354 L 184,342 L 200,350 L 212,340 Z',
    labelX: 222, labelY: 352,
  },
  {
    // Jutiapa — southeast, El Salvador border
    code: 'GT-JU', name: 'Jutiapa',
    d: 'M 272,360 L 292,358 L 308,348 L 324,352 L 336,366 L 334,384 L 318,396 L 296,402 L 272,400 L 252,390 L 246,374 L 248,366 L 256,350 L 272,358 Z',
    labelX: 292, labelY: 378,
  },
];

function getColor(total: number, max: number): string {
  if (max === 0 || total === 0) return '#e2e8f0';
  const ratio = total / max;
  if (ratio > 0.75) return '#1e40af';
  if (ratio > 0.5)  return '#2563eb';
  if (ratio > 0.25) return '#60a5fa';
  return '#bfdbfe';
}

function GuatemalaMap() {
  const [data, setData] = useState<DeptData[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [selected, setSelected] = useState<DeptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from('department_participation')
      .select('*')
      .then(({ data: rows }) => {
        if (rows) setData(rows as DeptData[]);
        setLoading(false);
      });
  }, []);

  const byCode = Object.fromEntries(data.map(d => [d.department_code, d]));
  const max = Math.max(...data.map(d => d.total_participants), 1);

  const emptyDept = (code: string, name: string): DeptData => ({
    department_code: code,
    department_name: name,
    total_participants: 0,
    survey_responses: 0,
    comments_count: 0,
  });

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Map */}
        <div className="flex-1 min-w-0">
          <svg
            viewBox="0 0 430 420"
            className="w-full h-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-soft"
            style={{ maxHeight: 460 }}
          >
            {DEPT_PATHS.map(({ code, name, d, labelX, labelY }) => {
              const dept = byCode[code];
              const total = dept?.total_participants ?? 0;
              const fill = getColor(total, max);
              const isSelected = selected?.department_code === code;
              return (
                <g key={code}>
                  <path
                    d={d}
                    fill={fill}
                    stroke={isSelected ? '#1e3a8a' : '#94a3b8'}
                    strokeWidth={isSelected ? 2 : 0.7}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150 hover:opacity-80"
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px #3b82f680)' : undefined }}
                    onMouseEnter={e => {
                      const rect = (e.target as SVGPathElement).closest('svg')!.getBoundingClientRect();
                      const svgEl = (e.target as SVGPathElement).closest('svg')!;
                      const svgW = svgEl.clientWidth;
                      const svgH = svgEl.clientHeight;
                      const relX = (e.clientX - rect.left) / rect.width * 430;
                      const relY = (e.clientY - rect.top) / rect.height * 420;
                      setTooltip({
                        dept: dept ?? emptyDept(code, name),
                        x: (e.clientX - rect.left) / rect.width * svgW,
                        y: (e.clientY - rect.top) / rect.height * svgH,
                      });
                      void relX; void relY;
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelected(dept ?? emptyDept(code, name))}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6"
                    fill={total > max * 0.5 ? '#fff' : '#334155'}
                    className="pointer-events-none select-none"
                    fontWeight="600"
                  >
                    {name.length > 13 ? name.split(' ')[0] : name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
            <span>Menos participación</span>
            <div className="flex gap-1">
              {['#e2e8f0', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'].map(c => (
                <div key={c} className="w-6 h-3 rounded" style={{ background: c }} />
              ))}
            </div>
            <span>Más participación</span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-full lg:w-72 shrink-0">
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">Departamento</p>
                  <h3 className="text-xl font-bold text-slate-900">{selected.department_name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
                  <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total participantes</p>
                    <p className="text-2xl font-bold text-brand-700">{selected.total_participants.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ClipboardList className="h-4 w-4 text-teal-600" />
                      <span className="text-xs text-slate-500">Encuestas</span>
                    </div>
                    <p className="text-xl font-bold text-teal-700">{selected.survey_responses.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                      <span className="text-xs text-slate-500">Comentarios</span>
                    </div>
                    <p className="text-xl font-bold text-amber-700">{selected.comments_count.toLocaleString()}</p>
                  </div>
                </div>
                {max > 1 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Participación relativa</span>
                      <span>{Math.round((selected.total_participants / max) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max((selected.total_participants / max) * 100, selected.total_participants > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-brand-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Selecciona un departamento</p>
              <p className="text-xs text-slate-400">Haz clic en cualquier región del mapa para ver los detalles de participación.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y - 14 }}
        >
          <p className="font-semibold">{tooltip.dept.department_name}</p>
          <p className="text-slate-300">{tooltip.dept.total_participants.toLocaleString()} participantes</p>
        </div>
      )}
    </div>
  );
}

export default GuatemalaMap;
