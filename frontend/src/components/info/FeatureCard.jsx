export const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="feat-card rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
    <div className="feat-icon w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-card-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
