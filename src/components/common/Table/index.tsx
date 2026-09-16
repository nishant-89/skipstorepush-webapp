/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import React, { useState, ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import PaginationComponent from "./pagination";
import SortIcon from "./SortIcon";
import { Column } from "src/utils/types";

interface TableComponentProps<T> {
  tableData: T[];
  columns: Column<T>[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  count: number;
  selectedRows?: T[];
  onCheckboxChange?: (selected: Array<T>) => void;
  checkedLimit?: number;
  handleActionCellClick?: (id: string, actionStatus: string, row?: any) => void;
  pageRangeDisplayedPos?: number;
  marginPagesDisplayedByPos?: number;
  className?: string;
}

const TableComponent = <
  T extends {
    id?: string | number;
    group_id?: string | number;
    customer_id?: string | number;
    campaign_id?: string | number;
  },
>({
  tableData,
  columns,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  count,
  onCheckboxChange = (_selected: Array<T>) => {},
  selectedRows = [],
  checkedLimit,
  handleActionCellClick,
  pageRangeDisplayedPos,
  marginPagesDisplayedByPos,
  className,
}: TableComponentProps<T>): ReactElement => {
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const pageCount = Math.ceil(count / rowsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected);
  };

  const handleCheckboxChange = (row: T) => {
    const rowId = row.id;
    let updatedSelectedRows: T[];
    if (selectedRows.some((selectedRow) => selectedRow.id === rowId)) {
      updatedSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow.id !== rowId
      );
    } else {
      updatedSelectedRows = [...selectedRows, row];
    }
    if (checkedLimit && updatedSelectedRows.length > checkedLimit) {
      return;
    }
    onCheckboxChange(updatedSelectedRows);
  };
  const handleSort = (column: Column<T>) => {
    const isAsc = orderBy === column.field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column.field as keyof T);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return tableData;

    return [...tableData].sort((a, b) => {
      // Check if the field is container_size and handle it accordingly
      const getSortValue = (value: any) => {
        if (
          orderBy === "container_size" ||
          orderBy === "chemical_cost" ||
          orderBy === "container_stock" ||
          orderBy === "inStock"
        ) {
          // Extract number if it's container_size, otherwise return string
          const match = value?.match(/[\d.]+/); // This handles both integers and decimals
          return match ? parseFloat(match[0]) : 0; // Parse as number
        }
        return value?.toString()?.toLowerCase(); // For other fields, fall back to string comparison
      };

      const valA = getSortValue(a[orderBy] ?? "");
      const valB = getSortValue(b[orderBy] ?? "");

      if (valA < valB) {
        return order === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [tableData, order, orderBy]);

  const isPaginationHide = sortedData.length < 6 && page === 0 && count < 6;

  return (
    <Paper style={{ width: "100%" }} className={className}>
      <TableContainer
        data-testid="table-component"
        className="campaignListingTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (column.field === "actions") {
                  // Handle the "actions" header separately
                  return (
                    <TableCell
                      key={column.field.toString() + uuid()}
                      style={{ width: column.width }}
                      className="textCenter"
                    >
                      {/* Custom rendering or event handling for actions header */}
                      {column.headerName}
                    </TableCell>
                  );
                } else {
                  // For other columns
                  return (
                    <TableCell
                      key={column.field.toString() + uuid()}
                      style={{ width: column.width }}
                    >
                      <div
                        className={
                          column.field === "actions"
                            ? "textCenter"
                            : column.isNumeric
                              ? "textRight"
                              : ""
                        }
                      >
                        {column?.isCheckbox && (
                          <FormGroup className="CheckboxGroup tableCheckbox">
                            <Checkbox
                              indeterminate={
                                selectedRows.length > 0 &&
                                selectedRows.length < tableData.length
                              }
                              checked={
                                !!selectedRows.length &&
                                tableData.every((selectedItem) =>
                                  selectedRows.some(
                                    (tableItem) =>
                                      tableItem.id === selectedItem.id
                                  )
                                )
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const uniqueRows = [
                                    ...selectedRows,
                                    ...tableData,
                                  ].filter(
                                    (item, index, self) =>
                                      index ===
                                      self.findIndex((t) => t.id === item.id)
                                  );
                                  if (
                                    checkedLimit &&
                                    uniqueRows.length > checkedLimit
                                  ) {
                                    const newArray = uniqueRows.slice(0, 20);
                                    onCheckboxChange(newArray);
                                    return;
                                  }
                                  onCheckboxChange(uniqueRows);
                                } else {
                                  const updatedSelectedRows =
                                    selectedRows.filter(
                                      (selectedItem) =>
                                        !tableData.some(
                                          (tableItem) =>
                                            tableItem.id === selectedItem.id
                                        )
                                    );
                                  onCheckboxChange(updatedSelectedRows);
                                }
                              }}
                            />
                          </FormGroup>
                        )}

                        {column.sorting ? (
                          <TableSortLabel
                            active={orderBy === column.field}
                            direction={orderBy === column.field ? order : "asc"}
                            onClick={() => handleSort(column)}
                            IconComponent={() => (
                              <SortIcon
                                sortOrder={
                                  orderBy === column.field && order === "desc"
                                    ? "desc"
                                    : "asc"
                                }
                              ></SortIcon>
                            )}
                          >
                            <span className="sortingTxt">
                              {column.headerName}
                            </span>
                          </TableSortLabel>
                        ) : (
                          column.headerName
                        )}
                      </div>
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow hover key={row.id + uuid()}>
                {columns.map((column) => {
                  if (column.field === "actions") {
                    // Handle the "actions" cell separately
                    return (
                      <TableCell
                        key={column.field.toString() + uuid()}
                        className="textCenter"
                      >
                        {/* Custom rendering or event handling for actions cell */}
                        {column.renderCell
                          ? column.renderCell(row, handleActionCellClick)
                          : null}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell
                        key={`${column.field.toString() + uuid()}`}
                        className={
                          column.field === "actions"
                            ? "textCenter"
                            : column.isNumeric
                              ? "textRight"
                              : (column?.className ?? "")
                        }
                      >
                        <div
                          className={`withChecks ${
                            column.isNumeric ? "numericAlign" : ""
                          }`}
                        >
                          {column?.isCheckbox && (
                            <Checkbox
                              checked={selectedRows.some(
                                (selectedRow) => selectedRow.id === row.id
                              )}
                              onChange={() => handleCheckboxChange(row)}
                            />
                          )}
                          {column &&
                          column.renderCell &&
                          column?.renderCell(row)
                            ? column?.renderCell(row)
                            : String(row[column.field as keyof T])}
                        </div>
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPaginationHide ? (
        <></>
      ) : (
        <PaginationComponent
          pageCount={pageCount}
          currentPage={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          pageRangeDisplayedPos={pageRangeDisplayedPos}
          marginPagesDisplayedByPos={marginPagesDisplayedByPos}
        />
      )}
    </Paper>
  );
};

export default TableComponent;
