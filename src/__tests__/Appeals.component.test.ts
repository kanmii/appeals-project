/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, wait } from "@testing-library/svelte";
import Appeals from "../Appeals/appeals.svelte";
import CombinedChart from "../Appeals/combined-distributions.svelte";
import { data, distributions } from "./test-utils";

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

it("renders combined chart", () => {
  const maxTextLen = 10 * 5; // font-size = 10px, 10 * 5 = 5em

  mockGetComputedTextLength
    .mockReturnValue(maxTextLen)
    .mockReturnValueOnce(maxTextLen + 2)

  render(CombinedChart, {
    dataDistributions: distributions
  });
});
