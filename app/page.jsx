"use client";
import Autocomplete from "@components/Autocomplete";
import React from "react";

export default function Home() {
  const fetchData = async (search, controller) => {
    try {
      const searchCall = await fetch(`/api/search?q=${search}`, {
        signal: controller.signal,
      });
      const searchResults = await searchCall.json();

      return searchResults.results;
    } catch (e) {
      if (e instanceof Error && e?.name === "AbortError") {
        console.log("search aborted");
      } else {
        console.error(e);
      }
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Autocomplete
        fetchData={fetchData}
        placeholder={"eg. Tokyo or Delhi"}
        renderListItem={({ value }) => <div>{value?.city}</div>}
        listClassName={"bg-slate-100"}
        inputClassName={"p-2 border border-gray-300 rounded-md"}
        onSelect={(value) => {
          console.log(`Selected: ${value?.city}`);
        }}
      />
    </main>
  );
}
