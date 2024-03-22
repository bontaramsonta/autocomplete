"use client";
import React from "react";
import type { City } from "@types";

function Autocomplete() {
  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([] as City[]);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const callSearchApi = React.useCallback(
    async (search: string, controller: AbortController) => {
      try {
        const searchCall = await fetch(`/api/search?q=${search}`, {
          signal: controller.signal,
        });
        const searchResults = await searchCall.json();
        setSearchResults(searchResults.results);
      } catch (e) {
        if (e instanceof Error && e?.name === "AbortError") {
          console.log("search aborted");
        } else {
          console.error(e);
        }
      }
    },
    []
  );

  React.useEffect(() => {
    if (search.length > 3) {
      console.log(`Searching for ${search}`);
      const abortController = new AbortController();
      callSearchApi(search, abortController);
      setActiveIndex(-1);
      return () => {
        abortController.abort();
      };
    } else {
      setActiveIndex(-1);
      setSearchResults([]);
    }
  }, [search, callSearchApi]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setSearch("");
          } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
            e.preventDefault();
            setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          } else if (e.key === "ArrowDown" || e.key === "Tab") {
            e.preventDefault();
            setActiveIndex((prevIndex) =>
              Math.min(prevIndex + 1, searchResults.length - 1)
            );
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (searchResults[activeIndex]?.city) {
              setSearch(searchResults[activeIndex]?.city);
              setSearchResults([]);
            }
          }
        }}
      />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result: any, index: number) => (
            <li
              key={result.id}
              className={activeIndex === index ? "bg-gray-200" : ""}
            >
              {result.city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
