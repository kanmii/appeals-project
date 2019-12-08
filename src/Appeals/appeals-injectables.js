import { csvParse } from "d3-dsv";

export const headerMapping = {
  NAME: "name",
  GENDER: "gender",
  AGE: "age",
  SEGMENT: "segment",
  "RECEIVED ASSETS": "receivedAssets",
  "IMPROVED TECH": "improvedTech",
  "RECEIVED TRAINING": "receivedTraining"
};

export async function getCSVData() {
  const rawBinaries = await fetch("/lagos-appeals.csv");
  const textData = await rawBinaries.text();
  return csvParse(textData, d => {
    const data = Object.entries(d).reduce((acc, [k, v]) => {
      acc[headerMapping[k]] = v;
      return acc;
    }, {});

    data.age = +data.age;
    return data;
  });
}
