import "./Pagination.css";

const Pagination = ({ pages, currentPage, setCurrentPage }) => {
  const generatedPages = [];
  for (let i = 1; i <= pages; i++) generatedPages.push(i);

  return (
    <div className="pagination justify-content-center align items-center gap-2">
      <button
        disabled={currentPage === 1}
        className="page prev"
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Prev
      </button>
      {generatedPages?.map((page) => (
        <div
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? "page active" : "page"}
          key={page}
        >
          {page}
        </div>
      ))}
      <button
        disabled={currentPage === pages}
        className="page next"
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
