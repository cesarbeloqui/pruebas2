
import { flexRender } from '@tanstack/react-table';

export function TableHeader({ table }) {
    return (
        <thead className="border-b border-gray-800 bg-[#1a1a1a]">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th
                            key={header.id}
                            className="px-4 py-3 text-left text-sm font-semibold text-white bg-[#1a1a1a]"
                        >
                            {header.isPlaceholder ? null : (
                                <div
                                    className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                        }`}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </div>
                            )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
}
