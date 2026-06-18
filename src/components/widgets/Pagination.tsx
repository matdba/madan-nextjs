import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";

type PaginationProps = {
    pageCount: number;
    currentPage: number;
    currentItemCount: number;
    handlePageChange: (newPage: number) => void;
};

type PageItem = number | "ellipsis-left" | "ellipsis-right";

const getPaginationItems = (pageCount: number, currentPage: number): PageItem[] => {
    if (pageCount <= 10) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    // Start window: 1..9 ... last
    if (currentPage <= 5) {
        return [...Array.from({ length: 9 }, (_, i) => i + 1), "ellipsis-right", pageCount];
    }

    // End window: 1 ... last-8..last
    if (currentPage >= pageCount - 4) {
        return [1, "ellipsis-left", ...Array.from({ length: 9 }, (_, i) => pageCount - 8 + i)];
    }

    // Middle window: 1 ... current-4..current+4 ... last
    return [
        1,
        "ellipsis-left",
        ...Array.from({ length: 9 }, (_, i) => currentPage - 4 + i),
        "ellipsis-right",
        pageCount,
    ];
};

export default function Pagination({
    pageCount,
    currentPage,
    currentItemCount,
    handlePageChange,
}: PaginationProps) {
    const paginationItems = getPaginationItems(pageCount, currentPage);

    return <>
        {pageCount > 1 && (
            <div className="px-6 py-4 border-t border-gray-light dark:border-gray-dark">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                        نمایش
                        <span className="font-semibold"> {((currentPage - 1) * 20) + 1} </span>
                        تا
                        <span className="font-semibold"> {((currentPage - 1) * 20) + Math.min(currentItemCount, 20)} </span>
                        {/* از{" "} */}
                        {/* <span className="font-semibold">{pagination.totalCount}</span> نتیجه */}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className={`
                                w-10 h-10 rounded-full border flex items-center justify-center transition-colors
                                bg-card-light dark:bg-card-dark enabled:hover:bg-secondary/10
                                enabled:hover:border-secondary border-gray-light dark:border-gray-dark
								${currentPage === 1 ?
                                    "dark:bg-gray-700 bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                                `}
                        >
                            <AltArrowRight className="w-5 h-5" />
                        </button>

                        {paginationItems.map((item) => (
                            item === "ellipsis-left" || item === "ellipsis-right" ? (
                                <span key={item} className="text-gray-400 text-sm px-1">...</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => handlePageChange(item)}
                                    className={`
                                        w-10 h-10 rounded-full border flex items-center justify-center text-sm
                                        font-medium transition-colors border-gray-light dark:border-gray-dark
                                        bg-card-light dark:bg-card-dark hover:bg-secondary/10 hover:border-secondary
                                        ${currentPage === item ? "border-primary bg-primary text-white" : ""}
                                        `}
                                >
                                    {item}
                                </button>
                            )
                        ))}

                        <button
                            onClick={() => handlePageChange(Math.min(currentPage + 1, pageCount))}
                            disabled={currentPage === pageCount}
                            className={`
                                w-10 h-10 rounded-full border flex items-center justify-center transition-colors
                                bg-card-light dark:bg-card-dark enabled:hover:bg-secondary/10
                                enabled:hover:border-secondary border-gray-light dark:border-gray-dark
								${currentPage === pageCount ?
                                    " dark:bg-gray-700 bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                                `}
                        >
                            <AltArrowLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
}
