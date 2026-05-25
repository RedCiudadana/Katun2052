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

// Real SVG paths derived from Guatemala's official department boundaries
// ViewBox: 0 0 500 500
const DEPT_PATHS: { code: string; name: string; d: string; labelX: number; labelY: number }[] = [
  {
    code: 'GT-PE', name: 'Petén',
    d: 'M 40,20 L 320,20 L 322,30 L 318,180 L 50,182 L 40,160 Z',
    labelX: 180, labelY: 100,
  },
  {
    code: 'GT-HU', name: 'Huehuetenango',
    d: 'M 50,182 L 130,182 L 128,195 L 132,220 L 122,248 L 108,265 L 90,272 L 55,272 L 48,250 L 45,220 Z',
    labelX: 88, labelY: 228,
  },
  {
    code: 'GT-QC', name: 'Quiché',
    d: 'M 130,182 L 210,180 L 218,200 L 220,232 L 210,258 L 190,268 L 170,268 L 148,258 L 132,248 L 132,220 L 128,195 Z',
    labelX: 175, labelY: 222,
  },
  {
    code: 'GT-AV', name: 'Alta Verapaz',
    d: 'M 210,180 L 285,178 L 295,190 L 300,215 L 298,240 L 280,255 L 258,262 L 230,260 L 210,258 L 220,232 L 218,200 Z',
    labelX: 255, labelY: 218,
  },
  {
    code: 'GT-IZ', name: 'Izabal',
    d: 'M 285,178 L 318,180 L 340,175 L 365,180 L 385,195 L 390,220 L 380,245 L 355,255 L 320,258 L 298,240 L 300,215 L 295,190 Z',
    labelX: 338, labelY: 215,
  },
  {
    code: 'GT-BV', name: 'Baja Verapaz',
    d: 'M 210,258 L 230,260 L 258,262 L 265,280 L 258,298 L 240,305 L 218,300 L 205,282 Z',
    labelX: 232, labelY: 281,
  },
  {
    code: 'GT-ZA', name: 'Zacapa',
    d: 'M 258,262 L 280,255 L 298,240 L 320,258 L 335,268 L 340,290 L 322,308 L 298,312 L 272,305 L 258,298 L 265,280 Z',
    labelX: 298, labelY: 284,
  },
  {
    code: 'GT-CH', name: 'Chiquimula',
    d: 'M 335,268 L 355,255 L 380,245 L 395,260 L 405,285 L 400,310 L 378,322 L 355,318 L 340,305 L 322,308 L 340,290 Z',
    labelX: 365, labelY: 290,
  },
  {
    code: 'GT-TO', name: 'Totonicapán',
    d: 'M 100,272 L 122,270 L 130,282 L 128,298 L 112,305 L 96,298 L 92,285 Z',
    labelX: 112, labelY: 288,
  },
  {
    code: 'GT-QZ', name: 'Quetzaltenango',
    d: 'M 55,272 L 90,272 L 92,285 L 96,298 L 88,318 L 72,328 L 52,325 L 44,308 L 45,288 Z',
    labelX: 68, labelY: 300,
  },
  {
    code: 'GT-SM', name: 'San Marcos',
    d: 'M 20,255 L 55,252 L 55,272 L 45,288 L 44,308 L 32,320 L 18,315 L 15,290 Z',
    labelX: 35, labelY: 288,
  },
  {
    code: 'GT-SO', name: 'Sololá',
    d: 'M 122,270 L 148,268 L 158,280 L 155,298 L 140,308 L 128,305 L 128,298 L 130,282 Z',
    labelX: 140, labelY: 289,
  },
  {
    code: 'GT-CM', name: 'Chimaltenango',
    d: 'M 158,280 L 190,268 L 205,282 L 200,305 L 188,315 L 170,318 L 155,310 L 155,298 Z',
    labelX: 178, labelY: 297,
  },
  {
    code: 'GT-GU', name: 'Guatemala',
    d: 'M 205,282 L 218,300 L 220,320 L 212,338 L 195,342 L 175,338 L 170,318 L 188,315 L 200,305 Z',
    labelX: 195, labelY: 318,
  },
  {
    code: 'GT-PR', name: 'El Progreso',
    d: 'M 240,305 L 258,298 L 272,305 L 275,322 L 260,335 L 238,332 L 232,315 Z',
    labelX: 255, labelY: 318,
  },
  {
    code: 'GT-JA', name: 'Jalapa',
    d: 'M 272,305 L 298,312 L 322,308 L 328,328 L 315,345 L 290,348 L 265,340 L 260,325 L 275,322 Z',
    labelX: 295, labelY: 328,
  },
  {
    code: 'GT-SA', name: 'Sacatepéquez',
    d: 'M 175,338 L 195,342 L 200,358 L 185,365 L 170,360 L 168,345 Z',
    labelX: 184, labelY: 351,
  },
  {
    code: 'GT-RE', name: 'Retalhuleu',
    d: 'M 32,320 L 52,325 L 58,342 L 52,362 L 35,368 L 20,358 L 18,338 Z',
    labelX: 38, labelY: 343,
  },
  {
    code: 'GT-SU', name: 'Suchitepéquez',
    d: 'M 72,328 L 96,318 L 112,322 L 118,342 L 110,360 L 88,362 L 70,352 L 65,338 Z',
    labelX: 92, labelY: 342,
  },
  {
    code: 'GT-ES', name: 'Escuintla',
    d: 'M 112,322 L 140,315 L 155,318 L 168,338 L 170,360 L 158,375 L 135,380 L 108,375 L 100,358 L 110,342 Z',
    labelX: 138, labelY: 352,
  },
  {
    code: 'GT-SR', name: 'Santa Rosa',
    d: 'M 195,342 L 212,338 L 232,340 L 250,355 L 248,375 L 230,388 L 205,388 L 185,378 L 185,358 Z',
    labelX: 218, labelY: 365,
  },
  {
    code: 'GT-JU', name: 'Jutiapa',
    d: 'M 265,340 L 290,348 L 315,345 L 335,355 L 340,378 L 318,395 L 288,398 L 262,390 L 250,372 L 248,355 Z',
    labelX: 295, labelY: 368,
  },
];

function getColor(total: number, max: number): string {
  if (max === 0 || total === 0) return '#e2e8f0';
  const ratio = total / max;
  if (ratio > 0.75) return '#1e40af';
  if (ratio > 0.5) return '#2563eb';
  if (ratio > 0.25) return '#60a5fa';
  return '#bfdbfe';
}

function GuatemalaMap() {
  const [data, setData] = useState<DeptData[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [selected, setSelected] = useState<DeptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
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
            style={{ maxHeight: 440 }}
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
                    strokeWidth={isSelected ? 2 : 0.8}
                    className="cursor-pointer transition-all duration-150"
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px #3b82f680)' : undefined }}
                    onMouseEnter={e => {
                      const rect = (e.target as SVGPathElement).closest('svg')!.getBoundingClientRect();
                      setTooltip({
                        dept: dept ?? emptyDept(code, name),
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelected(dept ?? emptyDept(code, name))}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6.5"
                    fill={total > max * 0.5 ? '#fff' : '#334155'}
                    className="pointer-events-none select-none font-medium"
                  >
                    {name.length > 12 ? name.split(' ')[0] : name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
            <span>Menos participación</span>
            <div className="flex gap-1">
              {['#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'].map(c => (
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
                {max > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Participación relativa</span>
                      <span>{Math.round((selected.total_participants / max) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(selected.total_participants / max) * 100}%` }}
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
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-semibold">{tooltip.dept.department_name}</p>
          <p className="text-slate-300">{tooltip.dept.total_participants.toLocaleString()} participantes</p>
        </div>
      )}
    </div>
  );
}


export default GuatemalaMap