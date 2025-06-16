import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRows } from "../store/slices/tableSlice";
import type { RootState } from "../store";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "../styles/DataViewer.css"

const csvFile = new URL("../data/dataset_small.csv", import.meta.url).href;

const parseCSV = (csvText: string): Record<string, string>[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    return headers.reduce((obj, header, idx) => {
      obj[header] = values[idx] ?? "";
      return obj;
    }, {} as Record<string, string>);
  });
};

const ITEMS_PER_PAGE = 20;

const DataViewer: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const fullData = useSelector((state: RootState) => state.dataTable.rows);
  const [filteredData, setFilteredData] = useState(fullData);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(csvFile);
        const csvText = await res.text();
        const parsedData = parseCSV(csvText);
        dispatch(setRows(parsedData));
      } catch (err) {
        console.error("Error loading CSV:", err);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (fullData.length > 0) {
      const keys = Object.keys(fullData[0]);
      setColumns(keys);
    }
  }, [fullData]);

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilteredData(fullData);
      return;
    }
    const filtered = fullData.filter((row) => {
      return Object.entries(filters).every(([col, val]) => row[col] === val);
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filters, fullData]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="data-viewer">
      <h2>CSV Data Table</h2>
      <Table className="responsive-table">
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((col) => (
                <Td key={`${rowIndex}-${col}`}>{row[col]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataViewer;
