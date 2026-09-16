import React, { useState } from "react";
import {
  Badge,
  Popover,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Button from "../Button";
import { filter } from "src/utils/common/constants";

import "./filter.scss";

interface AllAppFilterPopUpProps {
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  setIsRedIndicator: React.Dispatch<React.SetStateAction<boolean>>;
  isRedIndicator: boolean;
}

const AllAppFilterPopUp: React.FC<AllAppFilterPopUpProps> = ({
  selectedFilters,
  setSelectedFilters,
  setIsRedIndicator,
  isRedIndicator,
}) => {
  const defaultFilters = ["IOS", "ANDROID"];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [tempSelectedFilters, setTempSelectedFilters] =
    useState<string[]>(defaultFilters);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempSelectedFilters(
      selectedFilters.length === 0 ? defaultFilters : selectedFilters
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleApply = () => {
    const allSelected =
      tempSelectedFilters.includes("IOS") &&
      tempSelectedFilters.includes("ANDROID");

    setSelectedFilters(allSelected ? [] : tempSelectedFilters);
    setIsRedIndicator(!allSelected && tempSelectedFilters.length > 0);
    handleClose();
  };

  const handleFilterChange = (value: string) => {
    setTempSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div>
      <Badge
        className="filterBadge"
        color="primary"
        variant="dot"
        invisible={!isRedIndicator}
      >
        <Button
          label="Filters"
          variant="outlined"
          className="filterBtn"
          isIcon
          onClick={handleClick}
          icon={filter}
        />
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        className="filterPopoverWrapper"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: -10,
          horizontal: 255,
        }}
      >
        <div className="filterMainWrapper">
          <div className="topHead">
            <h2 className="title">Filters</h2>
          </div>
          <div className="innerWrapper">
            <h4 className="labelTitle">Operating System</h4>
            <div className="checkboxSection">
              <FormGroup className="filterCheckboxGroup">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        tempSelectedFilters.includes("IOS") &&
                        tempSelectedFilters.includes("ANDROID")
                      }
                      indeterminate={
                        tempSelectedFilters.includes("IOS") !==
                        tempSelectedFilters.includes("ANDROID")
                      }
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setTempSelectedFilters(
                          isChecked ? ["IOS", "ANDROID"] : []
                        );
                      }}
                    />
                  }
                  label="All"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempSelectedFilters.includes("IOS")}
                      onChange={() => handleFilterChange("IOS")}
                    />
                  }
                  label="iOS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempSelectedFilters.includes("ANDROID")}
                      onChange={() => handleFilterChange("ANDROID")}
                    />
                  }
                  label="Android"
                />
              </FormGroup>
            </div>
            <div className="bottomWrapper">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleCancel}
              />
              <Button
                label="Apply"
                variant="contained"
                onClick={handleApply}
                disabled={tempSelectedFilters.length === 0}
              />
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default AllAppFilterPopUp;
