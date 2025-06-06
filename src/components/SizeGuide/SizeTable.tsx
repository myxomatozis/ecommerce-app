// src/components/SizeGuide/SizeTable.tsx
import React from "react";
import { SizeTableData } from "./types";

interface SizeTableProps {
  data: SizeTableData;
  title?: string;
  className?: string;
  compact?: boolean;
}

const SizeTable: React.FC<SizeTableProps> = ({
  data,
  title,
  className = "",
  compact = false,
}) => {
  const { headers, measurements, data: tableData } = data;

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`text-left font-medium text-neutral-900 ${
                    compact ? "py-2 px-3 text-sm" : "py-3 px-4 text-sm"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors"
              >
                {measurements.map((measurement, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`text-neutral-700 ${
                      compact ? "py-2 px-3 text-sm" : "py-3 px-4 text-sm"
                    }`}
                  >
                    {row[measurement]}
                    {/* Add units for measurements */}
                    {(measurement.includes("bust") ||
                      measurement.includes("chest") ||
                      measurement.includes("waist") ||
                      measurement.includes("hips")) && (
                      <span className="text-neutral-400 ml-1">"</span>
                    )}
                    {measurement.includes("length") && (
                      <span className="text-neutral-400 ml-1">cm</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeTable;
