import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Column } from "src/utils/types";
import { v4 as uuid } from "uuid";

import "./tableDataLoader.scss";
interface TableDataLoaderProps<T> {
  columns: Column<T>[];
  rowCount?: number;
}

const TableDataLoader = <T,>({
  columns,
  rowCount = 5,
}: TableDataLoaderProps<T>) => {
  return (
    <Paper style={{ width: "100%" }}>
      <TableContainer data-testid="table-data-loader">
        <Table stickyHeader aria-label="loading table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={uuid()} style={{ width: column.width }}>
                  <div
                    className={`withChecks ${column.isNumeric ? "numericAlign" : ""}`}
                  >
                    {column.headerName}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rowCount }).map((_) => (
              <TableRow key={uuid()} hover>
                {columns.map((_column) => (
                  <TableCell key={uuid()}>
                    <div className="skeleton-loader"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableDataLoader;
