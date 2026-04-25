export const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground truncate text-right">
        {value || "—"}
      </span>
    </div>
  </div>
);
