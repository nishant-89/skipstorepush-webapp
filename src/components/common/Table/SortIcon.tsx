import React from "react";
import { SortUpIcon, SortDownIcon } from "src/utils/common/constants";
import "src/scss/table.scss";
interface SortIconProps {
  sortOrder: string;
}

const SortIcon: React.FC<SortIconProps> = ({ sortOrder }) => {
  return (
    <div className="sortWrapper">
      <img
        className={`${sortOrder === "asc" && "ascOrder"} upArrow`}
        src={SortUpIcon}
        alt="Sort up"
      />
      <img
        className={`${sortOrder === "desc" ? "descOrder" : ""} downArrow`}
        src={SortDownIcon}
        alt="Sort down"
      />
    </div>
  );
};

export default SortIcon;
