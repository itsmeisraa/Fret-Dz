// src/components/UI.jsx — Shared presentational components

const STATUTS = {
  en_attente: 'En attente',
  confirme:   'Confirmé',
  en_transit: 'En transit',
  livre:      'Livré',
  annule:     'Annulé',
};
const STATUT_CLS = {
  en_attente: 'b-wait',
  confirme:   'b-ok',
  en_transit: 'b-go',
  livre:      'b-done',
  annule:     'b-cancel',
};

export { STATUTS, STATUT_CLS };

export function Badge({ statut }) {
  return (
    <span className={`badge ${STATUT_CLS[statut] || 'b-wait'}`}>
      {STATUTS[statut] || statut}
    </span>
  );
}

const STEPS = ['en_attente', 'confirme', 'en_transit', 'livre'];
const STEP_COLORS = {
  en_attente: 'var(--amber)',
  confirme:   'var(--blue)',
  en_transit: 'var(--purple)',
  livre:      'var(--green)',
};

export function ProgressBar({ statut }) {
  if (statut === 'annule') return null;
  const stepIdx = STEPS.indexOf(statut);
  return (
    <>
      <div className="prog">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className="prog-seg"
            style={{
              borderRadius: i === 0 ? '4px 0 0 4px' : i === STEPS.length - 1 ? '0 4px 4px 0' : '0',
              background:   i <= stepIdx ? STEP_COLORS[s] : 'var(--brd2)',
            }}
          />
        ))}
      </div>
      <div className="prog-lbl">
        {STEPS.map((s, i) => (
          <span key={s} style={{ color: i <= stepIdx ? STEP_COLORS[s] : 'var(--mut)' }}>
            {STATUTS[s]}
          </span>
        ))}
      </div>
    </>
  );
}

export function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--mut)' }}>
      Chargement…
    </div>
  );
}

export function ErrorMsg({ msg }) {
  return msg ? <div className="err">{msg}</div> : null;
}
