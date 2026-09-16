import { Link } from "react-router-dom";
import UseBreadCrumbHelper from "./helpers";
import { Skeleton } from "@mui/material";

import "./breadcrumb.scss";

const Breadcrumbs = ({
  title = "",
  loading = false,
  //toolTipTitle=""
}: {
  title: string;
  loading?: boolean;
  toolTipTitle?: string;
}) => {
  const { breadcrumbTrail } = UseBreadCrumbHelper();

  return (
    <div className="breadcrumbsWrap">
      <ul className="breadcrumbList">
        {breadcrumbTrail.map((item, index) => (
          <li className="bredcrumbContent" key={item.path}>
            {index !== breadcrumbTrail.length - 1 ? (
              <Link className="breadcrumbLink active" to={item.path}>
                {item.name}
              </Link>
            ) : (
              <span className="breadcrumbLink">{item.name}</span>
            )}
            {index < breadcrumbTrail.length - 1 && (
              <span className="separator"> / </span>
            )}
          </li>
        ))}
      </ul>

      <h1 className="mainTitle">
        {loading ? <Skeleton variant="text" width={250} height={42} /> : title}
      </h1>
    </div>
  );
};
export default Breadcrumbs;
