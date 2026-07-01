import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: HomePage });

function HomePage() {
  return (
    <main className="template-page">
      <section className="template-hero" aria-labelledby="template-title">
        <p className="template-eyebrow">Application template</p>
        <h1 id="template-title" className="template-title">
          Universal TanStack starting point.
        </h1>
        <p className="template-copy">
          A neutral React shell with routing, styling, verification, and agent conventions ready for
          the first product decision.
        </p>
      </section>

      <section className="template-grid" aria-label="Template foundations">
        {[
          ['Plan', 'Keep product context in docs/product.md and reusable rules in repo guides.'],
          [
            'Design',
            'Start with accessible primitives and promote shared UI only when it repeats.',
          ],
          [
            'Build',
            'Add routes, features, and API domains through the documented layer boundaries.',
          ],
        ].map(([title, body]) => (
          <article key={title} className="template-panel">
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
