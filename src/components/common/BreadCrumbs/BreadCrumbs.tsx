import { Link } from "react-router-dom";
import UseBreadCrumbHelper from "./helpers";
import { Skeleton } from "@mui/material";

import "./breadcrumb.scss";

const Breadcrumbs = ({
  contextName = "",
  loading = false,
  currentLabel,
}: {
  title?: string;
  contextName?: string;
  loading?: boolean;
  toolTipTitle?: string;
  currentLabel?: string;
}) => {
  const { breadcrumbTrail } = UseBreadCrumbHelper();

  return (
    <div className="breadcrumbsWrap">
      <ul className="breadcrumbList">
        {breadcrumbTrail.map((item, index) => {
          const isLast = index === breadcrumbTrail.length - 1;
          const label = isLast && currentLabel ? currentLabel : item.name;

          return (
          <li className="bredcrumbContent" key={item.path}>
            {!isLast ? (
              <Link className="breadcrumbLink active" to={item.path}>
                {label}
              </Link>
            ) : (
              <span className="breadcrumbLink">{label}</span>
            )}
            {!isLast && (
              <span className="separator"> / </span>
            )}
          </li>
          );
        })}
        {loading ? (
          <li className="bredcrumbContent contextName">
            <Skeleton variant="text" width={120} height={24} />
          </li>
        ) : contextName ? (
          <li className="bredcrumbContent contextName">
            <span className="breadcrumbContext">{`{ ${contextName} }`}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
};
export default Breadcrumbs;
