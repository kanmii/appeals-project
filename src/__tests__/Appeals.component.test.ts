/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, wait } from "@testing-library/svelte";
import Appeals from "../Appeals/appeals.svelte";
import CombinedChart from "../Appeals/combined-distributions.svelte";
import { data, distributions } from "./test-utils";
import AgeChart from "../Appeals/age-distribution.svelte";
import GenderChart from "../Appeals/gender-distribution.svelte";
import ImprovedTechChart from "../Appeals/improved-tech-distribution.svelte";

const mockGetComputedTextLength = jest.fn();

beforeAll(() => {
  (window.SVGElement
    .prototype as any).getComputedTextLength = mockGetComputedTextLength;
});

afterAll(() => {
  delete (window.SVGElement.prototype as any).getComputedTextLength;
});

afterEach(() => {
  mockGetComputedTextLength.mockReset();
});

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

it("renders combined chart", async () => {
  const maxTextLen = 10 * 5; // font-size = 10px, 10 * 5 = 5em

  mockGetComputedTextLength
    .mockReturnValue(maxTextLen)
    .mockReturnValueOnce(maxTextLen + 2);

  render(CombinedChart, {
    dataDistributions: distributions
  });

  await wait(() => true);
});

it("renders age chart", async () => {
  render(AgeChart, {
    dataDistributions: distributions
  });

  await wait(() => true);
});

it("renders gender chart", async () => {
  render(GenderChart, {
    dataDistributions: distributions
  });

  await wait(() => true);
});

it("renders improved tech chart chart", async () => {
  render(ImprovedTechChart, {
    dataDistributions: distributions
  });

  await wait(() => true);
});
