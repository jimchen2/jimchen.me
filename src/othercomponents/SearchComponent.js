"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGlobalColorScheme } from "../config/global";

function SearchComponent() {
  const { colors } = useGlobalColorScheme();
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
        <input ref={searchInputRef} type="search" placeholder="Search articles..." value={searchTerm} onChange={handleSearchChange} />
        <button type="submit">Search</button>
      </form>

      <style jsx>{`
        .search-wrapper {
          max-width: 300px;
        }
        input {
          background: ${colors.color_white};
          color: ${colors.color_black};
        }
        button {
          background: ${colors.color_white};
          color: ${colors.color_black};
        }
      `}</style>
    </div>
  );
}

export default SearchComponent;
