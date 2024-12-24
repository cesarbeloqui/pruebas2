
import { flexRender } from '@tanstack/react-table';

export function TableBody({ table }) {
    return (
        <tbody>
            {table.getRowModel().rows.map(row => (
                <tr
                    key={row.id}
                    className="border-b border-gray-800 last:border-0 hover:bg-[#242424]"
                >
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-300">
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}
