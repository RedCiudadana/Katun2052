import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Users, MessageSquare, ClipboardList, X } from 'lucide-react';
import geojson from '../data/gt.json';

type DeptData = {
  department_code: string;
  department_name: string;
  total_participants: number;
  survey_responses: number;
  comments_count: number;
};

type Tooltip = { dept: DeptData; x: number; y: number };

// Map GeoJSON id (GT01–GT22) to ISO 3166-2 codes used in department_participation table
const GEOID_TO_ISO: Record<string, string> = {
  GT01: 'GT-GU',
  GT02: 'GT-PR',
  GT03: 'GT-SA',
  GT04: 'GT-CM',
  GT05: 'GT-ES',
  GT06: 'GT-SR',
  GT07: 'GT-SO',
  GT08: 'GT-TO',
  GT09: 'GT-QZ',
  GT10: 'GT-SU',
  GT11: 'GT-RE',
  GT12: 'GT-SM',
  GT13: 'GT-HU',
  GT14: 'GT-QC',
  GT15: 'GT-BV',
  GT16: 'GT-AV',
  GT17: 'GT-PE',
  GT18: 'GT-IZ',
  GT19: 'GT-ZA',
  GT20: 'GT-CH',
  GT21: 'GT-JA',
  GT22: 'GT-JU',
};

// SVG canvas size
const W = 500;
const H = 460;

// Guatemala bounding box (WGS84) with padding
// Extended eastward to include Belize
const MIN_LON = -92.246256;
const MAX_LON = -87.5;
const MIN_LAT = 13.731404;
const MAX_LAT = 17.816020;

// Simplified Belize boundary coordinates (WGS84) — clockwise outer ring
// Source: approximate official border / adjacency line with Guatemala
const BELIZE_COORDS: [number, number][] = [
  [-89.224, 17.816], // NW corner (meeting point with Mexico/Petén)
  [-88.867, 17.816], // NE corner
  [-88.220, 16.445], // E coast north
  [-88.105, 15.885], // SE coast
  [-88.220, 15.610], // S tip
  [-89.152, 15.888], // SW (Sarstún / Golfo Dulce area, border with Guatemala)
  [-89.224, 16.404], // W border midpoint (adjacency line)
  [-89.224, 17.816], // close
];

function lonToX(lon: number): number {
  return ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * W;
}

function latToY(lat: number): number {
  // Invert Y: higher latitude = smaller Y (top of SVG)
  return (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * H;
}

function ringToPath(ring: number[][]): string {
  return ring.map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'}${lonToX(lon).toFixed(1)},${latToY(lat).toFixed(1)}`).join(' ') + ' Z';
}

function featureToPath(geometry: { type: string; coordinates: number[][][] | number[][][][] }): string {
  if (geometry.type === 'Polygon') {
    return (geometry.coordinates as number[][][]).map(ringToPath).join(' ');
  }
  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates as number[][][][]).flatMap(poly => poly.map(ringToPath)).join(' ');
  }
  return '';
}

function getCentroid(geometry: { type: string; coordinates: number[][][] | number[][][][] }): [number, number] {
  const rings: number[][][] =
    geometry.type === 'Polygon'
      ? [(geometry.coordinates as number[][][])[0]]
      : (geometry.coordinates as number[][][][]).map(p => p[0]);

  let sumX = 0, sumY = 0, count = 0;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      sumX += lonToX(lon);
      sumY += latToY(lat);
      count++;
    }
  }
  return [sumX / count, sumY / count];
}

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

  const byCode = useMemo(() => Object.fromEntries(data.map(d => [d.department_code, d])), [data]);
  const max = useMemo(() => Math.max(...data.map(d => d.total_participants), 1), [data]);

  const emptyDept = (isoCode: string, name: string): DeptData => ({
    department_code: isoCode,
    department_name: name,
    total_participants: 0,
    survey_responses: 0,
    comments_count: 0,
  });

  type GeoFeature = { properties: { id: string; name: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } };

  const features = useMemo(() =>
    ((geojson as unknown as { features: GeoFeature[] }).features).map(f => {
      const isoCode = GEOID_TO_ISO[f.properties.id] ?? f.properties.id;
      const pathD = featureToPath(f.geometry);
      const [cx, cy] = getCentroid(f.geometry);
      return { isoCode, name: f.properties.name, pathD, cx, cy };
    }), []);

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
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-soft"
            style={{ maxHeight: 520 }}
            onMouseLeave={() => setTooltip(null)}
          >
            {features.map(({ isoCode, name, pathD, cx, cy }) => {
              const dept = byCode[isoCode];
              const total = dept?.total_participants ?? 0;
              const fill = getColor(total, max);
              const isSelected = selected?.department_code === isoCode;
              return (
                <g key={isoCode}>
                  <path
                    d={pathD}
                    fill={fill}
                    stroke={isSelected ? '#1e3a8a' : '#94a3b8'}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150 hover:opacity-80"
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px #3b82f680)' : undefined }}
                    onMouseEnter={e => {
                      const rect = (e.currentTarget as SVGPathElement).closest('svg')!.getBoundingClientRect();
                      setTooltip({
                        dept: dept ?? emptyDept(isoCode, name),
                        x: (e.clientX - rect.left) / rect.width * W,
                        y: (e.clientY - rect.top) / rect.height * H,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelected(dept ?? emptyDept(isoCode, name))}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="5.5"
                    fill={total > max * 0.5 ? '#fff' : '#334155'}
                    className="pointer-events-none select-none"
                    fontWeight="600"
                  >
                    {name.length > 12 ? name.split(' ')[0] : name}
                  </text>
                </g>
              );
            })}

            {/* ── Belize — differendum territorial ── */}
            {(() => {
              const belizePath = BELIZE_COORDS.map(([lon, lat], i) =>
                `${i === 0 ? 'M' : 'L'}${lonToX(lon).toFixed(1)},${latToY(lat).toFixed(1)}`
              ).join(' ') + ' Z';

              // Adjacency line (western border with Guatemala): same coords, just the W segment
              const adjLine = [
                BELIZE_COORDS[7], // NW
                BELIZE_COORDS[6], // W midpoint
                BELIZE_COORDS[5], // SW
              ].map(([lon, lat], i) =>
                `${i === 0 ? 'M' : 'L'}${lonToX(lon).toFixed(1)},${latToY(lat).toFixed(1)}`
              ).join(' ');

              // Centroid of Belize polygon for label placement
              const bx = BELIZE_COORDS.reduce((s, [lon]) => s + lonToX(lon), 0) / BELIZE_COORDS.length;
              const by = BELIZE_COORDS.reduce((s, [, lat]) => s + latToY(lat), 0) / BELIZE_COORDS.length;

              return (
                <g className="pointer-events-none">
                  {/* Filled area */}
                  <path
                    d={belizePath}
                    fill="#fef9c3"
                    fillOpacity={0.55}
                    stroke="#d97706"
                    strokeWidth={0.6}
                    strokeLinejoin="round"
                  />
                  {/* Dashed adjacency / differendum line over the western border */}
                  <path
                    d={adjLine}
                    fill="none"
                    stroke="#b45309"
                    strokeWidth={1.4}
                    strokeDasharray="4 2.5"
                    strokeLinecap="round"
                  />
                  {/* Country label */}
                  <text
                    x={bx}
                    y={by - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6.5"
                    fontWeight="700"
                    fill="#92400e"
                    className="select-none"
                  >
                    Belice
                  </text>
                  {/* Differendum note — two lines */}
                  <text
                    x={bx}
                    y={by + 2}
                    textAnchor="middle"
                    fontSize="4.2"
                    fill="#78350f"
                    className="select-none"
                    fontStyle="italic"
                  >
                    <tspan x={bx} dy="0">Diferendo territorial,</tspan>
                    <tspan x={bx} dy="5.5">insular y marítimo</tspan>
                    <tspan x={bx} dy="5.5">pendiente de resolver</tspan>
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Menos participación</span>
              <div className="flex gap-1">
                {['#e2e8f0', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'].map(c => (
                  <div key={c} className="w-6 h-3 rounded" style={{ background: c }} />
                ))}
              </div>
              <span>Más participación</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="28" height="10" className="shrink-0">
                <line x1="0" y1="5" x2="28" y2="5" stroke="#b45309" strokeWidth="1.8" strokeDasharray="5 3" strokeLinecap="round" />
              </svg>
              <span className="text-amber-800 italic">Línea de adyacencia — diferendo territorial pendiente de resolver</span>
            </div>
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