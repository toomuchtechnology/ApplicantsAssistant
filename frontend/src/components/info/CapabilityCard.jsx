export const CapabilityCard = ({ icon: Icon, title, items }) => (
  <div className="cap-card rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
      <div className="cap-icon w-6 h-6 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-card-foreground">{title}</span>
    </div>
    <ul className="px-4 py-3 flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="cap-item flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
        >
          <span className="cap-dot mt-1.5 w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);
