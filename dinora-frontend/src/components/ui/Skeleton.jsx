export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function MenuItemSkeleton() {
  return (
    <div className="menu-item">
      <Skeleton className="skeleton-thumb" />
      <div className="menu-item-body">
        <Skeleton style={{ width: "60%", height: 16 }} />
        <Skeleton style={{ width: "90%", height: 12, marginTop: 6 }} />
        <Skeleton style={{ width: "30%", height: 20, marginTop: 10 }} />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="order-card">
      <Skeleton style={{ width: "40%", height: 16 }} />
      <Skeleton style={{ width: "100%", height: 12, marginTop: 12 }} />
      <Skeleton style={{ width: "70%", height: 12, marginTop: 8 }} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton style={{ width: "80%", height: 14 }} />
        </td>
      ))}
    </tr>
  );
}
