"use client";
import React from "react";
import "./Autocomplete.css";

const Autocomplete = (props) => {
  // defaults
  const activeClass = props.activeClass ?? "active";
  const placeholder = props.placeholder ?? "Search";

  const [input, setInput] = React.useState("");
  const [search, setSearch] = React.useState(null);
  const [searchResults, setInputResults] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  React.useEffect(() => {
    if (input.length > 3 && search === null) {
      console.log(`Searching for ${input}`);
      const abortController = new AbortController();
      (async () => {
        const results = await props.fetchData(input, abortController);
        if (Array.isArray(results)) {
          setInputResults(results);
        }
      })();
      setActiveIndex(-1);
      return () => {
        abortController.abort();
      };
    } else {
      setActiveIndex(-1);
      setInputResults([]);
    }
  }, [input, props]);

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onClick={() => setSearch(null)}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setInput("");
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
              setInput(searchResults[activeIndex]?.city);
              setSearch(searchResults[activeIndex]);
              props.onSelect(searchResults[activeIndex]);
            }
          } else {
            setActiveIndex(-1);
            setSearch(null);
          }
        }}
      />
      {!search && searchResults.length > 0 && (
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={result.id}
              onClick={() => {
                setInput(result.city);
                setSearch(result);
                props.onSelect(result);
              }}
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
