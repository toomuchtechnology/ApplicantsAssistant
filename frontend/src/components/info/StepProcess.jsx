export const StepProcess = ({ steps }) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
      {steps.map((step) => (
        <div key={step.num} className="step-cell px-5 py-5 text-center">
          <span className="step-pill inline-block text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-full px-2.5 py-0.5 mb-3">
            {step.num}
          </span>
          <p className="text-sm font-medium text-card-foreground mb-1">
            {step.title}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
);
