import { ReactNode } from "react";

const AdminTableCard = ({
  title,
  count,
  toolbar,
  busy = false,
  children,
}: {
  title: string;
  count?: number;
  toolbar?: ReactNode;
  busy?: boolean;
  children: ReactNode;
}) => (
  <section className="cardBgWrapper adminTableCard" aria-busy={busy}>
    <div className="adminTableHead">
      <h2>
        {title}
        {count != null ? <span className="adminCardCount">{count}</span> : null}
      </h2>
    </div>
    {toolbar ? <div className="adminFilterBar">{toolbar}</div> : null}
    <div className="tableSection appTable">
      <div className="adminAccessTableWrapper tableWrapper bgWhite adminInsetTable">
        {children}
      </div>
    </div>
  </section>
);

export default AdminTableCard;
