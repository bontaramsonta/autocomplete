import parse from "csv-simple-parser";
import { readFileSync, writeFileSync } from "fs";
const file = readFileSync("./_data/worldcities.csv");

let data = parse(file.toString(), { header: true });

data = data.map((city: any) => ({
  id: city.id,
  city: city.city_ascii,
  capital: city.capital,
  country: city.country,
  population: city.population,
  countrySlug: city.iso3,
}));

writeFileSync("./_data/worldcities.json", JSON.stringify({ data }, null, 2));
