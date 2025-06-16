import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Multiselect from "multiselect-react-dropdown";
import { updateFilter, resetFilter } from "../store/slices/filterSlice";
import { updateOptions } from "../store/slices/optionsSlice";
import type { RootState } from "../store";
import _ from "lodash";
import "../styles/Filter.css";

interface CSVDataRow {
  [key: string]: string;
}

// ⬇️ generateOptions extracted just like in the original file
const generateOptions = (filteredData: CSVDataRow[], columns: string[]) => {
  const uniqueOptions = _.map(columns, (column: string) => {
    const uniqueValues = _.uniq(_.map(filteredData, column));
    return { [column]: uniqueValues };
  });
  return uniqueOptions;
};

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch();
  const options = useSelector((state: RootState) => state.options);
  const data = useSelector((state: RootState) => state.dataTable.rows);

  useEffect(() => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]);
      const generated = generateOptions(data, columns);

      _.forEach(generated, (option, index) => {
        const col = columns[index];
        dispatch(updateOptions({ column: col, values: option[col] }));
      });
    }
  }, [data, dispatch]);

  const handleSelect = (selectedList: { value: string }[], column: string) => {
    if (selectedList.length > 0) {
      dispatch(updateFilter({ column, value: selectedList[0].value }));
    }
  };

  const handleDeselect = (column: string) => {
    dispatch(resetFilter(column));
  };

  return (
    <div className="filter-panel">
      {Object.entries(options).map(([col, vals]) => (
        <div key={col} className="filter-item">
          <Multiselect
            options={vals.map((v) => ({ label: v, value: v }))}
            displayValue="label"
            placeholder={col}
            closeOnSelect
            showCheckbox
            onSelect={(selected) => handleSelect(selected, col)}
            onRemove={() => handleDeselect(col)}
          />
        </div>
      ))}
    </div>
  );
};

export default FilterPanel;
