// @ts-check
import { render, wait } from "@testing-library/svelte";
import Appeals from "../Appeals/appeals.svelte";
import CombinedChart from "../Appeals/combined-distributions";

const data = [
  {
    name: "Yetunde A",
    gender: "Female",
    age: 44,
    segment: "Marketing",
    receivedAssets: true,
    improvedTech: true,
    receivedTraining: false
  },
  {
    name: "Ademola K",
    gender: "Male",
    age: 23,
    segment: "Production",
    receivedAssets: true,
    improvedTech: true,
    receivedTraining: true
  },
  {
    name: "Chris O",
    gender: "Male",
    age: 26,
    segment: "Processing",
    receivedAssets: false,
    improvedTech: true,
    receivedTraining: false
  },
  {
    name: "Benjami Y",
    gender: "Male",
    age: 56,
    segment: "Production",
    receivedAssets: false,
    improvedTech: true,
    receivedTraining: true
  },
  {
    name: "Adamson  Nkechi",
    gender: "Female",
    age: 32,
    segment: "Marketing",
    receivedAssets: false,
    improvedTech: false,
    receivedTraining: true
  },
  {
    name: "Idowu Agbi",
    gender: "Male",
    age: 38,
    segment: "Production",
    receivedAssets: true,
    improvedTech: false,
    receivedTraining: false
  },
  {
    name: "Simbiat Alamu",
    gender: "Female",
    age: 35,
    segment: "Production",
    receivedAssets: true,
    improvedTech: false,
    receivedTraining: true
  },
  {
    name: "Nkem Owoh",
    gender: "Female",
    age: 45,
    segment: "Processing",
    receivedAssets: false,
    improvedTech: true,
    receivedTraining: true
  },
  {
    name: "Deji Adeyanju",
    gender: "Male",
    age: 26,
    segment: "Marketing",
    receivedAssets: false,
    improvedTech: false,
    receivedTraining: true
  },
  {
    name: "Bala Usman",
    gender: "Male",
    age: 41,
    segment: "Production",
    receivedAssets: true,
    improvedTech: true,
    receivedTraining: true
  },
  {
    name: "Gbenga Aliyu",
    gender: "Male",
    age: 24,
    segment: "Marketing",
    receivedAssets: false,
    improvedTech: true,
    receivedTraining: true
  },
  {
    name: "Umu Umar",
    gender: "Female",
    age: 36,
    segment: "Processing",
    receivedAssets: true,
    improvedTech: true,
    receivedTraining: false
  },
  {
    name: "Modinat Lar",
    gender: "Female",
    age: 42,
    segment: "Marketing",
    receivedAssets: true,
    improvedTech: true,
    receivedTraining: true
  }
];

const distributions = {
  maleCount: 7,
  femaleCount: 6,
  improvedTechMaleCount: 5,
  improvedTechFemaleCount: 4,
  youthCount: 8,
  adultCount: 5,
  childrenCount: 0,
  totalBeneficiaries: 13,
  dataReady: true,
  combinedDistributions: {
    Female: 6,
    Male: 7,
    "Improved Tech": 9,
    "Non Improved Tech": 4,
    Youth: 8,
    Adult: 5,
    "Received Assets": 7,
    "No Received Assets": 6,
    "Received Training": 9,
    "No Received Training": 4
  }
};

it("renders component without data", () => {
  render(Appeals, {
    fetchDataFn: () => []
  });
});

it("renders component with data", async () => {
  const mockFetchDataFn = jest.fn();
  mockFetchDataFn.mockResolvedValue(data);

  render(Appeals, {
    fetchDataFn: mockFetchDataFn
  });

  await wait(() => true);
});

it("renders combined chart", () => {
  render(CombinedChart, {
    dataDistributions: distributions
  });
});

// Note: This is as an async test as we are using `fireEvent`
// Using await when firing events is unique to the svelte testing library because
// we have to wait for the next `tick` so that Svelte flushes all pending state changes.
/**
test("changes button text on click", async () => {
  render(Comp, { name: "World" });
  const domButton = document.getElementById("button");

  await fireEvent.click(domButton);
  expect(domButton.textContent).toBe("Button Clicked");
});
*/
