// components/SearchComponent.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next"; // <-- Import the hook

function SearchComponent() {
  // Use the hook to get the 't' (translate) function
  // We'll assume the search text is in a 'common' namespace
  const { t } = useTranslation('common'); 

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const query = searchParams.get("searchterm");
    setSearchTerm(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    
    // The router hooks from `next/navigation` are locale-aware.
    // `pathname` already includes the locale prefix (e.g., /en/search).
    // So this logic correctly preserves the locale.
    const newParams = new URLSearchParams(searchParams.toString());

    if (trimmedSearchTerm) {
      newParams.set("searchterm", trimmedSearchTerm);
    } else {
      newParams.delete("searchterm");
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="search-wrapper" style={{ marginLeft: "5%", marginBottom: "5%", marginTop: "5%" }}>
      <form onSubmit={handleSearchSubmit}>
        {/* Use the 't' function for placeholder and button text */}
        <input 
          ref={searchInputRef} 
          type="search" 
          placeholder={t('search-placeholder')} 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
        <button type="submit">{t('search-button')}</button>
      </form>

      <style jsx>{`
        .search-wrapper {
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}

export default SearchComponent;