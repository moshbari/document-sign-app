'use client';

/**
 * Renders the structured contract shape produced by /risk-check/contract as a
 * readable, human-friendly agreement. Used on both the owner-facing dashboard
 * and the signer-facing /sign/<token> page so both sides see the same document.
 */

export interface RiskCheckContract {
  kind: 'risk-check-contract';
  version: number;
  freelancer?: { name?: string; email?: string; business?: string };
  client?: { name?: string; email?: string; business?: string };
  project?: { title?: string; scope?: string };
  fees?: {
    totalFee?: string | number;
    currency?: string;
    depositPercent?: string | number;
    paymentTerms?: string;
  };
  dates?: { startDate?: string; deliveryDate?: string };
  clauses?: { title: string; body: string }[];
  sourceAnswers?: string | null;
}

export function isRiskCheckContract(content: unknown): content is RiskCheckContract {
  return (
    typeof content === 'object' &&
    content !== null &&
    (content as any).kind === 'risk-check-contract'
  );
}

function formatDate(d?: string) {
  if (!d) return '';
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Party({
  role,
  party,
}: {
  role: string;
  party: { name?: string; email?: string; business?: string };
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {role}
      </p>
      <p className="mt-1 text-base font-semibold text-gray-900">
        {party.name || <span className="italic text-gray-400">Name TBD</span>}
      </p>
      {party.business ? (
        <p className="text-sm text-gray-600">{party.business}</p>
      ) : null}
      {party.email ? (
        <p className="text-sm text-gray-600">{party.email}</p>
      ) : null}
    </div>
  );
}

export default function RiskCheckContractView({
  content,
}: {
  content: RiskCheckContract;
}) {
  const {
    freelancer = {},
    client = {},
    project = {},
    fees = {},
    dates = {},
    clauses = [],
  } = content || {};

  const currency = fees.currency || 'USD';
  const totalFeeText =
    fees.totalFee !== undefined && fees.totalFee !== ''
      ? `${currency} ${fees.totalFee}`
      : '';
  const depositText =
    fees.depositPercent !== undefined && fees.depositPercent !== ''
      ? `${fees.depositPercent}%`
      : '';

  return (
    <article className="mx-auto max-w-3xl space-y-8 font-serif text-gray-800">
      {/* Header */}
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          Services Agreement
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {project.title || 'Freelance Services Agreement'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          This agreement is entered into between the parties listed below.
        </p>
      </header>

      {/* Parties */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Parties</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Party role="Freelancer / Service Provider" party={freelancer} />
          <Party role="Client" party={client} />
        </div>
      </section>

      {/* Scope */}
      {project.scope ? (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            1. Scope of Work
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
            {project.scope}
          </p>
        </section>
      ) : null}

      {/* Fees & Payment */}
      {(totalFeeText || depositText || fees.paymentTerms) && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            2. Fees &amp; Payment
          </h2>
          <ul className="space-y-1 leading-relaxed text-gray-700">
            {totalFeeText ? (
              <li>
                <span className="font-semibold">Total Fee:</span> {totalFeeText}
              </li>
            ) : null}
            {depositText ? (
              <li>
                <span className="font-semibold">Deposit:</span> {depositText} due
                on signing, non-refundable.
              </li>
            ) : null}
            {fees.paymentTerms ? (
              <li>
                <span className="font-semibold">Payment Terms:</span>{' '}
                {fees.paymentTerms}
              </li>
            ) : null}
          </ul>
        </section>
      )}

      {/* Timeline */}
      {(dates.startDate || dates.deliveryDate) && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            3. Timeline
          </h2>
          <ul className="space-y-1 leading-relaxed text-gray-700">
            {dates.startDate ? (
              <li>
                <span className="font-semibold">Start Date:</span>{' '}
                {formatDate(dates.startDate)}
              </li>
            ) : null}
            {dates.deliveryDate ? (
              <li>
                <span className="font-semibold">Delivery Date:</span>{' '}
                {formatDate(dates.deliveryDate)}
              </li>
            ) : null}
          </ul>
        </section>
      )}

      {/* Protective Clauses */}
      {clauses.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            4. Terms &amp; Protective Clauses
          </h2>
          <ol className="space-y-4">
            {clauses.map((clause, idx) => (
              <li key={idx} className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">
                  4.{idx + 1}. {clause.title}
                </p>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-700">
                  {clause.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Signature Block */}
      <section className="border-t border-gray-200 pt-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          5. Signatures
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          By signing below, each party agrees to the terms of this agreement.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="h-10 border-b border-gray-400" />
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {freelancer.name || 'Freelancer'}
            </p>
            <p className="text-xs text-gray-500">Freelancer / Service Provider</p>
          </div>
          <div>
            <div className="h-10 border-b border-gray-400" />
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {client.name || 'Client'}
            </p>
            <p className="text-xs text-gray-500">Client</p>
          </div>
        </div>
      </section>
    </article>
  );
}
