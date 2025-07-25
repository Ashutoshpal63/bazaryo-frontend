import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './Spinner';

/**
 * A reusable, styled table component for displaying data.
 * @param {Array<object>} columns - Array of column definitions, e.g., [{ header: 'Name', accessor: 'name' }]
 * @param {Array<object>} data - The array of data to display.
 * @param {boolean} isLoading - A flag to show a loading state.
 */
export const Table = ({ columns, data, isLoading }) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-lg">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                <div className="flex justify-center items-center">
                  <Spinner />
                  <span className="ml-2 text-slate-500">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <motion.tr
                key={row._id || rowIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                custom={rowIndex}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4 whitespace-nowrap">
                    {/* Use a custom cell renderer if provided, otherwise access data directly */}
                    {col.Cell ? (
                      <div className="text-sm text-slate-900">{col.Cell({ row })}</div>
                    ) : (
                      <div className="text-sm text-slate-600">{row[col.accessor]}</div>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-slate-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};