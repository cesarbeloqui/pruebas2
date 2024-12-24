import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';
import { useColumns } from './useColumns';

export function UsuariosTable({ usuarios, onToggleEstado, onCambiarRol }) {
    const columns = useColumns({ onToggleEstado, onCambiarRol });

    const table = useReactTable({
        data: usuarios,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="rounded-lg border border-gray-800 bg-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <TableHeader table={table} />
                    <TableBody table={table} />
                </table>
            </div>
            <TablePagination table={table} />
        </div>
    );
}