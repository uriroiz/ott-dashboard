import React from 'react';

function CollapsibleSection({ title, defaultOpen = false, children }) {
  return (
    <details className="collapsible-section" open={defaultOpen}>
      <summary className="collapsible-summary">
        <span>{title}</span>
        <span className="collapsible-toggle" aria-hidden="true" />
      </summary>
      <div className="collapsible-content">
        {children}
      </div>
    </details>
  );
}

export default CollapsibleSection;
