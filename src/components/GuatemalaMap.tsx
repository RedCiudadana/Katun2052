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

type Tooltip = {
  dept: DeptData;
  x: number;
  y: number;
};

// Approximate SVG paths for Guatemala's 22 departments
// Coordinates based on a simplified 600×540 viewBox
const DEPT_PATHS: { code: string; name: string; d: string }[] = [
  { code: 'GT-PE', name: 'Petén',           d: 'M60,20 L310,20 L310,180 L60,180 Z' },
  { code: 'GT-HU', name: 'Huehuetenango',   d: 'M60,180 L155,180 L155,280 L60,280 Z' },
  { code: 'GT-QC', name: 'Quiché',          d: 'M155,180 L240,180 L245,260 L155,270 Z' },
  { code: 'GT-IZ', name: 'Izabal',          d: 'M310,180 L420,160 L430,250 L310,260 Z' },
  { code: 'GT-AV', name: 'Alta Verapaz',    d: 'M240,180 L310,180 L310,260 L245,260 Z' },
  { code: 'GT-BV', name: 'Baja Verapaz',    d: 'M240,260 L310,260 L305,305 L235,305 Z' },
  { code: 'GT-ZA', name: 'Zacapa',          d: 'M310,260 L400,250 L395,310 L305,310 Z' },
  { code: 'GT-CH', name: 'Chiquimula',      d: 'M390,300 L440,290 L445,355 L385,355 Z' },
  { code: 'GT-TO', name: 'Totonicapán',     d: 'M130,265 L165,265 L165,295 L130,295 Z' },
  { code: 'GT-SO', name: 'Sololá',          d: 'M155,295 L195,295 L195,330 L155,335 Z' },
  { code: 'GT-QZ', name: 'Quetzaltenango',  d: 'M90,280 L140,278 L140,320 L85,325 Z' },
  { code: 'GT-SM', name: 'San Marcos',      d: 'M55,275 L100,275 L100,320 L55,320 Z' },
  { code: 'GT-RE', name: 'Retalhuleu',      d: 'M75,320 L120,318 L120,360 L70,360 Z' },
  { code: 'GT-SU', name: 'Suchitepéquez',   d: 'M118,315 L165,315 L165,355 L118,355 Z' },
  { code: 'GT-CM', name: 'Chimaltenango',   d: 'M193,295 L235,290 L240,330 L193,335 Z' },
  { code: 'GT-SA', name: 'Sacatepéquez',    d: 'M210,330 L240,328 L240,350 L210,352 Z' },
  { code: 'GT-GU', name: 'Guatemala',       d: 'M235,295 L285,295 L285,345 L235,345 Z' },
  { code: 'GT-PR', name: 'El Progreso',     d: 'M283,280 L320,278 L322,315 L283,318 Z' },
  { code: 'GT-JA', name: 'Jalapa',          d: 'M305,335 L355,330 L358,370 L305,375 Z' },
  { code: 'GT-ES', name: 'Escuintla',       d: 'M160,350 L255,348 L250,395 L155,395 Z' },
  { code: 'GT-SR', name: 'Santa Rosa',      d: 'M253,355 L320,350 L318,400 L248,405 Z' },
  { code: 'GT-JU', name: 'Jutiapa',         d: 'M318,358 L400,355 L398,410 L315,412 Z' },
];

function getColor(total: number, max: number): string {
  if (max === 0 || total === 0) return '#e2e8f0';
  const ratio = total / max;
  if (ratio > 0.75) return '#1e40af';
  if (ratio > 0.5)  return '#2563eb';
  if (ratio > 0.25) return '#60a5fa';
  return '#bfdbfe';
}

export default function GuatemalaMap() {
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
            viewBox="0 0 480 430"
            className="w-full h-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-soft"
            style={{ maxHeight: 420 }}
          >
            {DEPT_PATHS.map(({ code, name, d }) => {
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
                    strokeWidth={isSelected ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-150"
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px #3b82f680)' : undefined }}
                    onMouseEnter={e => {
                      const rect = (e.target as SVGPathElement).closest('svg')!.getBoundingClientRect();
                      setTooltip({
                        dept: dept ?? { department_code: code, department_name: name, total_participants: 0, survey_responses: 0, comments_count: 0 },
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelected(
                      dept ?? { department_code: code, department_name: name, total_participants: 0, survey_responses: 0, comments_count: 0 }
                    )}
                  />
                  <text
                    x={(() => {
                      const nums = d.match(/[\d.]+/g)!.map(Number);
                      const xs = nums.filter((_, i) => i % 2 === 0);
                      return (Math.min(...xs) + Math.max(...xs)) / 2;
                    })()}
                    y={(() => {
                      const nums = d.match(/[\d.]+/g)!.map(Number);
                      const ys = nums.filter((_, i) => i % 2 === 1);
                      return (Math.min(...ys) + Math.max(...ys)) / 2;
                    })()}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
                    fill={total > max * 0.5 ? '#fff' : '#475569'}
                    className="pointer-events-none select-none font-medium"
                  >
                    {name.length > 10 ? name.split(' ')[0] : name}
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
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
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
                      <span>Participación nacional</span>
                      <span>{max > 0 ? Math.round((selected.total_participants / max) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${max > 0 ? (selected.total_participants / max) * 100 : 0}%` }}
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

      {/* SVG tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-semibold">{tooltip.dept.department_name}</p>
          <p className="text-slate-300">{tooltip.dept.total_participants} participantes</p>
        </div>
      )}
    </div>
  );
}
