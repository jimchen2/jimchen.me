import React from 'react';
import Link from 'next/link';

const Pagination = ({ currentPage, totalPages, basePath = '/blog/page' }) => {
  const pageNumbers = [];
  
  // Always show first page
  pageNumbers.push(1);
  
  // Calculate range of pages to show
  let startPage = Math.max(2, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);
  
  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pageNumbers.push('...');
  }
  
  // Add pages in the middle
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1 && totalPages > 1) {
    pageNumbers.push('...');
  }
  
  // Always show last page if it exists
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }
  
  return (
    <div className="pagination" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      margin: '2rem 0',
      gap: '0.5rem' 
    }}>
      {currentPage > 1 && (
        <Link href={currentPage === 2 ? '/blog' : `${basePath}/${currentPage - 1}`}>
          <a style={pageStyle}>← Prev</a>
        </Link>
      )}
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} style={{margin: '0 0.5rem'}}>...</span>;
        }
        
        return (
          <Link 
            key={page} 
            href={page === 1 ? '/blog' : `${basePath}/${page}`}
          >
            <a style={{
              ...pageStyle,
              ...(page === currentPage ? activePageStyle : {})
            }}>
              {page}
            </a>
          </Link>
        );
      })}
      
      {currentPage < totalPages && (
        <Link href={`${basePath}/${currentPage + 1}`}>
          <a style={pageStyle}>Next →</a>
        </Link>
      )}
    </div>
  );
};

const pageStyle = {
  padding: '0.5rem 0.8rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  textDecoration: 'none',
  color: '#333',
};

const activePageStyle = {
  backgroundColor: '#333',
  color: 'white',
  borderColor: '#333',
};

export default Pagination;
