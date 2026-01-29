function Pagination({ pagination, onChangePage }) {
  const handleClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={pagination.has_pre ? "page-item" : "disabled"}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            Previous
          </a>
        </li>
        {Array.from({ length: pagination.total_pages }, (_, index) => (
          <li
            className={`page-item ${pagination.current_page === index + 1 ? "active" : ""}`}
            key={`${index}_page`}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className={pagination.has_next ? "page-item" : "disabled"}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
