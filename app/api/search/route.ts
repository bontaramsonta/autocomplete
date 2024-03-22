import cities from "@data/worldcities.json";
import type { City } from "@types";

const citiesResponse = cities as {
  data: City[];
};

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const query = search.get("q");
  const sort = search.get("sort");

  if (!query) {
    return Response.json({ error: "Missing search query" }, { status: 400 });
  }
  console.log(`Searching for ${query} with sort ${sort}`);
  const results = await getSearchResults(query, sort);

  // delay between 200ms and 1000ms
  await simulatedDelay(200, 800);

  return Response.json({ results });
}

async function simulatedDelay(min: number, max: number) {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  console.log(`Delaying response by ${delay}ms`);
  return await new Promise((resolve) => setTimeout(resolve, delay));
}

async function getSearchResults(query: string, sort: string | null) {
  const results = citiesResponse.data.filter((city: any) =>
    city.city.toLowerCase().includes(query.toLowerCase())
  );

  if (sort === "asc" || sort === null) {
    results.sort((a: any, b: any) => a.city.localeCompare(b.city));
  } else if (sort === "desc") {
    results.sort((a: any, b: any) => b.city.localeCompare(a.city));
  }

  return results.slice(0, 10);
}

export const dynamic = "force-dynamic";
