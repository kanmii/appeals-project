/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, wait } from "@testing-library/svelte";
import Appeals from "../Appeals/appeals.svelte";
import CombinedChart from "../Appeals/combined-distributions.svelte";
import { data, distributions } from "./test-utils";

beforeEach(() => {
  (window.SVGElement.prototype as any).getComputedTextLength = () => 200;
});

afterEach(() => {
  delete (window.SVGElement.prototype as any).getComputedTextLength;
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

it("renders combined chart", () => {
  render(CombinedChart, {
    dataDistributions: distributions
  });
});
