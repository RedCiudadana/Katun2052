import fm from 'front-matter';

export interface Law {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: 'shield' | 'fingerprint' | 'network';
  color: 'blue' | 'green' | 'purple';
  pdfUrl: string;
  articles: Article[];
}

export interface Article {
  id: string;
  number: string;
  title: string;
  content: string;
}

const lawFiles = import.meta.glob('../content/leyes/*.md', { as: 'raw', eager: true });

export const laws: Law[] = Object.entries(lawFiles).map(([path, raw]) => {
  const id = path.split('/').pop()!.replace('.md', '');
  const { attributes } = fm(raw as string);
  const attrs = typeof attributes === 'object' && attributes !== null ? attributes : {};
  return { id, ...attrs } as Law;
}).filter(law => law.id === 'contrataciones-estado');

export function getLawById(id: string): Law | undefined {
  return laws.find(law => law.id === id);
}
