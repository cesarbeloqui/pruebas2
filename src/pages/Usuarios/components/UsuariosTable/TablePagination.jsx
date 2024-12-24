
import { Button } from '../../../../components/ui/button';

export function TablePagination({ table }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-gray-700 text-gray-400 hover:bg-gray-700"
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-gray-700 text-gray-400 hover:bg-gray-700"
                >
                    Siguiente
                </Button>
            </div>
            <span className="text-sm text-gray-400">
                Página {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
            </span>
        </div>
    );
}
