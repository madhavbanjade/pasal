import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

export default function Pagination({ basePath, currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    if (page > 1) params.set("page", String(page));
    else params.delete("page");

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className="pagination__btn">
          Prev
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">Prev</span>
      )}

      <div className="pagination__pages">
        {pages.map((page) => (
          <Link
            key={page}
            href={hrefFor(page)}
            className={`pagination__page ${page === currentPage ? "pagination__page--active" : ""}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link href={hrefFor(currentPage + 1)} className="pagination__btn">
          Next
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">Next</span>
      )}
    </nav>
  );
}
