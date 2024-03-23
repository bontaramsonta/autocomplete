"use client";
import React from "react";
import "./Autocomplete.css";

const Autocomplete = (props) => {
  // defaults
  const activeClass = props.activeClass ?? "active";
  const placeholder = props.placeholder ?? "Search";
  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  React.useEffect(() => {
    if (search.length > 3) {
      console.log(`Searching for ${search}`);
      const abortController = new AbortController();
      (async () => {
        const results = await props.fetchData(search, abortController);
        if (Array.isArray(results)) {
          setSearchResults(results);
        }
      })();
      setActiveIndex(-1);
      return () => {
        abortController.abort();
      };
    } else {
      setActiveIndex(-1);
      setSearchResults([]);
    }
  }, [search, props]);

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
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
          {searchResults.map((result, index) => (
            <li
              key={result.id}
              className={
                (activeIndex === index ? activeClass : "") +
                " " +
                (props.className ? props.className : "")
              }
            >
              {props.renderListItem
                ? props.renderListItem({ value: result, index })
                : result.city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
