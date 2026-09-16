import React from "react";
import ReactPaginate from "react-paginate";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import PrevIcon from "src/assets/images/leftarrow.svg";
import NextIcon from "src/assets/images/rightarrow.svg";

interface PaginationComponentProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: { selected: number }) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  marginPagesDisplayedByPos?: number;
  pageRangeDisplayedPos?: number;
}

const buttonstyle = {
  marginLeft: 10,
};

const PreviousButton = ({ disabled }: { disabled: boolean }) => {
  return (
    <>
      <img
        src={PrevIcon}
        alt="Previous"
        style={{ opacity: disabled ? 0.5 : 1 }}
      />
      <span style={{ ...buttonstyle, opacity: disabled ? 0.5 : 1 }}>
        Previous
      </span>
    </>
  );
};

const NextButton = ({ disabled }: { disabled: boolean }) => {
  return (
    <>
      <span style={{ opacity: disabled ? 0.5 : 1 }}>Next</span>
      <img
        style={{ ...buttonstyle, opacity: disabled ? 0.5 : 1 }}
        src={NextIcon}
        alt="Next"
      />
    </>
  );
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  pageCount,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  pageRangeDisplayedPos,
  marginPagesDisplayedByPos,
}) => {
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newRowsPerPage = event.target.value as number;
    onRowsPerPageChange(newRowsPerPage);
  };

  const marginPagesDisplayed = marginPagesDisplayedByPos ?? 2;
  const pageRangeDisplayed = pageRangeDisplayedPos ?? 3;

  return (
    <div className="paginationContainer">
      <div className="rowsPerPageWrapper">
        <div className="customSelect">
          <Select
            MenuProps={{
              classes: { paper: "select-backdrop" },
            }}
            labelId="rows-per-page-select-label"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label={` Rows per page: ${rowsPerPage}`}
          >
            {[5, 10, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {` Rows per page: ${option}`}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <ReactPaginate
        previousLabel={<PreviousButton disabled={currentPage === 0} />}
        nextLabel={<NextButton disabled={currentPage === pageCount - 1} />}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        forcePage={currentPage}
        previousLinkClassName={currentPage === 0 ? "disabled" : ""}
        nextLinkClassName={currentPage === pageCount - 1 ? "disabled" : ""}
      />
    </div>
  );
};

export default PaginationComponent;
