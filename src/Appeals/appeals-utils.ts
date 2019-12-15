import {
  axisTop as d3AxisTop,
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft,
  Axis
} from "d3-axis";
import {
  scaleBand as d3ScaleBand,
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal,
  ScaleLinear,
  ScaleBand,
  ScaleOrdinal
} from "d3-scale";
import { stack as d3Stack } from "d3-shape";
import { GENDER_FEMALE_DATA, MappedData } from "./appeals-injectables";
import { max as d3Max } from "d3-array";
import { Selection, BaseType } from "d3-selection";

export const BAR_HEIGHT = 400;
export const BAR_WIDTH = 400;
export const BAR_MARGINS = {
  top: 20,
  left: 50,
  right: 30,
  bottom: 20
};

export const BAR_SVG_WIDTH = BAR_WIDTH + BAR_MARGINS.top + BAR_MARGINS.bottom;
export const BAR_SVG_HEIGHT = BAR_HEIGHT + BAR_MARGINS.left + BAR_MARGINS.right;

const FEMALE_LABEL = "Female";
const MALE_LABEL = "Male";
const YOUTH_LABEL = "Youth";
const ADULT_LABEL = "Adult";
const CHILDREN_LABEL = "Children";
const RECEIVED_ASSETS_LABEL = "Received Assets";
const NO_RECEIVED_ASSETS_LABEL = "No Received Assets";
const RECEIVED_TRAINING_LABEL = "Received Training";
const NO_RECEIVED_TRAINING_LABEL = "No Received Training";
const IMPROVED_TECH_LABEL = "Improved Tech";
const NO_IMPROVED_TECH_LABEL = "Non Improved Tech";

export const COMBINED_DISTRIBUTION_LABELS_LIST: (keyof CombinedDistribution)[] = [
  FEMALE_LABEL,
  MALE_LABEL,
  YOUTH_LABEL,
  ADULT_LABEL,
  RECEIVED_TRAINING_LABEL,
  NO_RECEIVED_TRAINING_LABEL,
  RECEIVED_ASSETS_LABEL,
  NO_RECEIVED_ASSETS_LABEL,
  IMPROVED_TECH_LABEL,
  NO_IMPROVED_TECH_LABEL
];

export const PIE_TRANSLATE = 250;
export const PIE_LABEL_OFFSET = 50;

export const initialGenderDistributionData = [FEMALE_LABEL, MALE_LABEL].reduce(
  (acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }),
  {}
);

export const initialAgeDistributionData = [
  YOUTH_LABEL,
  ADULT_LABEL,
  CHILDREN_LABEL
].reduce((acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }), {});

type AgeDistributionMap = {
  [YOUTH_LABEL]: MappedData[];
  [ADULT_LABEL]: MappedData[];
  [CHILDREN_LABEL]: MappedData[];
};

interface ComputedDistribution {
  maleCount: number;
  femaleCount: number;
  improvedTechMaleCount: number;
  improvedTechFemaleCount: number;
  youthCount: number;
  adultCount: number;
  childrenCount: number;
  totalBeneficiaries: number;
  dataReady: boolean;
  combinedDistributions: CombinedDistribution;
}

interface CombinedDistribution {
  [FEMALE_LABEL]: number;
  [MALE_LABEL]: number;
  [IMPROVED_TECH_LABEL]: number;
  [NO_IMPROVED_TECH_LABEL]: number;
  [YOUTH_LABEL]: number;
  [ADULT_LABEL]: number;
  [RECEIVED_ASSETS_LABEL]: number;
  [NO_RECEIVED_ASSETS_LABEL]: number;
  [RECEIVED_TRAINING_LABEL]: number;
  [NO_RECEIVED_TRAINING_LABEL]: number;
}

export function computeDistributions(data: MappedData[]) {
  let improvedTechFemaleCount = 0;
  let improvedTechMaleCount = 0;
  let totalBeneficiaries = 0;
  let totalImprovedTech = 0;

  // gender distribution
  let femaleCount = 0;

  /* age distribution */
  let youthCount = 0;
  let adultCount = 0;
  let childrenCount = 0;
  let receivedAssetsCount = 0;
  let receivedTrainingCount = 0;

  // ageDistributionMap
  data.reduce(
    (acc, d) => {
      const { age, gender, improvedTech, receivedAssets, receivedTraining } = d;

      ++totalBeneficiaries;

      if (receivedAssets) {
        ++receivedAssetsCount;
      }

      if (receivedTraining) {
        ++receivedTrainingCount;
      }

      if (improvedTech) {
        ++totalImprovedTech;
      }

      if (age < 18) {
        ++childrenCount;
        acc[CHILDREN_LABEL].push(d);
      } else if (age < 41) {
        ++youthCount;
        acc[YOUTH_LABEL].push(d);
      } else {
        ++adultCount;
        acc[ADULT_LABEL].push(d);
      }

      if (gender === GENDER_FEMALE_DATA) {
        ++femaleCount;

        if (improvedTech) {
          ++improvedTechFemaleCount;
        }
      } else {
        if (improvedTech) {
          ++improvedTechMaleCount;
        }
      }

      return acc;
    },
    {
      [YOUTH_LABEL]: [],
      [ADULT_LABEL]: [],
      [CHILDREN_LABEL]: []
    } as AgeDistributionMap
  );

  const maleCount = totalBeneficiaries - femaleCount;

  const combinedDistributions: CombinedDistribution = {
    [FEMALE_LABEL]: femaleCount,
    [MALE_LABEL]: maleCount,
    [IMPROVED_TECH_LABEL]: totalImprovedTech,
    [NO_IMPROVED_TECH_LABEL]: totalBeneficiaries - totalImprovedTech,
    [YOUTH_LABEL]: youthCount,
    [ADULT_LABEL]: adultCount,
    [RECEIVED_ASSETS_LABEL]: receivedAssetsCount,
    [NO_RECEIVED_ASSETS_LABEL]: totalBeneficiaries - receivedAssetsCount,
    [RECEIVED_TRAINING_LABEL]: receivedTrainingCount,
    [NO_RECEIVED_TRAINING_LABEL]: totalBeneficiaries - receivedTrainingCount
  };

  return {
    maleCount,
    femaleCount,
    improvedTechMaleCount,
    improvedTechFemaleCount,
    youthCount,
    adultCount,
    childrenCount,
    totalBeneficiaries,
    dataReady: true,
    combinedDistributions
  };
}

export const COMBINED_BAR_CONTAINER_WIDTH = 800;
export const COMBINED_BAR_CONTAINER_HEIGHT = 500;

interface CombinedChartD3Helpers {
  chartHeight: number;
  topScaleLinear: ScaleLinear<number, number>;
  leftScaleBand: ScaleBand<string>;
  xAxisTop: Axis<
    | number
    | {
        valueOf(): number;
      }
  >;
  yAxisLeft: Axis<string>;
  chartWidth: number;
  bandWidth: number;
  margins: {};
}

export function combinedBarChartInitD3() {
  const margins = {
    top: 20,
    left: 80,
    right: 30,
    bottom: 20
  };
  const chartHeight =
    COMBINED_BAR_CONTAINER_HEIGHT - margins.top - margins.bottom;

  const chartWidth =
    COMBINED_BAR_CONTAINER_WIDTH - margins.left - margins.right;

  const topScaleLinear = d3ScaleLinear().range([0, chartWidth]);

  const leftScaleBand = d3ScaleBand()
    .range([0, chartHeight])
    .domain(COMBINED_DISTRIBUTION_LABELS_LIST)
    .padding(0.2);

  const xAxisTop = d3AxisTop(topScaleLinear);
  const yAxisLeft = d3AxisLeft(leftScaleBand);

  return {
    chartHeight,
    topScaleLinear,
    leftScaleBand,
    xAxisTop,
    yAxisLeft,
    chartWidth,
    bandWidth: leftScaleBand.bandwidth(),
    margins
  };
}

export function computeCombinedBars(
  dataDistributions: ComputedDistribution,
  chartHelpers: CombinedChartD3Helpers
) {
  const { combinedDistributions } = dataDistributions;

  const { topScaleLinear, leftScaleBand } = chartHelpers;

  topScaleLinear.domain([0, d3Max(Object.values(combinedDistributions))]);

  const bars = COMBINED_DISTRIBUTION_LABELS_LIST.map(label => {
    const y = leftScaleBand(label) as number;

    return {
      barProps: {
        y,
        width: topScaleLinear(combinedDistributions[label])
      }
    };
  });

  return { bars };
}

export function combinedBarChartCustomLeftAxis(
  d3SelectedLeftAxis: Selection<BaseType, string, HTMLElement, string>,
  d3YAxisLeft: Axis<string>
) {
  const lineHeightEm = 1.2;
  const halfLineHeightEm = lineHeightEm / 2;

  d3SelectedLeftAxis = d3SelectedLeftAxis.call(d3YAxisLeft);
  const fontSizePixel = parseFloat(d3SelectedLeftAxis.attr("font-size"));
  const maxTextLen = fontSizePixel * 5; // 5em

  d3SelectedLeftAxis.selectAll(".tick text").each(function(label) {
    const svgNodeText = this as SVGTextElement;

    svgNodeText.textContent = "";
    const x = svgNodeText.getAttribute("x") as string;

    let word = "";

    let wordsLine: string[] = [];
    const words = label.split(/\s+/).reverse();

    let svgNodeTSpan = svgNodeText.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "tspan")
    );
    svgNodeTSpan.setAttribute("x", x);
    svgNodeTSpan.setAttribute("dy", svgNodeText.getAttribute("dy") as string);

    svgNodeText.removeAttribute("dy");

    while ((word = words.pop() as string)) {
      wordsLine.push(word);
      svgNodeTSpan.textContent = wordsLine.join(" ");

      if (svgNodeTSpan.getComputedTextLength() > maxTextLen) {
        wordsLine.pop();
        svgNodeTSpan.textContent = wordsLine.join(" ");
        wordsLine = [word];

        const firstSvgNodeTSpan = svgNodeText.firstElementChild as SVGTextElement;

        const dyNumberEm = parseFloat(
          (/[\d.]+/.exec(
            firstSvgNodeTSpan.getAttribute("dy") as string
          ) as string[])[0]
        );

        firstSvgNodeTSpan.setAttribute(
          "dy",
          `${dyNumberEm - halfLineHeightEm}em`
        );

        svgNodeTSpan = svgNodeText.appendChild(
          document.createElementNS("http://www.w3.org/2000/svg", "tspan")
        );

        svgNodeTSpan.setAttribute("x", x);
        svgNodeTSpan.setAttribute("dy", `${lineHeightEm}em`);
        svgNodeTSpan.textContent = word;
      }
    }

    svgNodeText.style.fontWeight = "bold";
  });
}

interface BarD3Helpers {
  barYScale: ScaleLinear<number, number>;
  barXScaleBand: ScaleBand<string>;
  ordinalColorScale: ScaleOrdinal<string, unknown>;
  xAxis: Axis<string>;
  yAxis: Axis<string>;
}

export function getBarD3Helpers() {
  const barYScale = d3ScaleLinear().range([BAR_HEIGHT, 0]);

  const barXScaleBand = d3ScaleBand()
    .range([0, BAR_WIDTH])
    .padding(0.04)
    .domain([IMPROVED_TECH_LABEL, NO_IMPROVED_TECH_LABEL]);

  const ordinalColorScale = d3ScaleOrdinal()
    .domain([FEMALE_LABEL, MALE_LABEL])
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const xAxis = d3AxisBottom(barXScaleBand);
  const yAxis = d3AxisLeft(barYScale);

  return { barYScale, barXScaleBand, ordinalColorScale, xAxis, yAxis };
}

export function computeImprovedTechBarsAndData(
  dataDistributions: ComputedDistribution,
  barHelpers: BarD3Helpers
) {
  const { barYScale, barXScaleBand, ordinalColorScale } = barHelpers;

  const {
    improvedTechFemaleCount,
    improvedTechMaleCount,
    totalBeneficiaries,
    femaleCount,
    maleCount
  } = dataDistributions;

  barYScale.domain([0, totalBeneficiaries]);

  const data = [
    {
      improvementCategory: IMPROVED_TECH_LABEL,
      [MALE_LABEL]: improvedTechMaleCount,
      [FEMALE_LABEL]: improvedTechFemaleCount
    },
    {
      improvementCategory: NO_IMPROVED_TECH_LABEL,
      [MALE_LABEL]: maleCount - improvedTechMaleCount,
      [FEMALE_LABEL]: femaleCount - improvedTechFemaleCount
    }
  ];

  const improvedTechBars: {
    bar: {
      x: number;
      y: number;
      height: number;
      width: number;
      fill: string;
    };

    textProps: {
      attrs: {
        x: number;
        y: number;
      };
      text: string;
    };

    key: string;
  }[] = [];
  const width = barXScaleBand.bandwidth();

  d3Stack()
    .keys([FEMALE_LABEL, MALE_LABEL])(data)
    .forEach(d => {
      let i = 0;
      const len = d.length;
      const key = d.key;

      for (; i < len; i++) {
        const nextBar = d[i];
        const yBottom = barYScale(nextBar[0]);
        const yTop = barYScale(nextBar[1]);
        const height = yBottom - yTop;
        const x = barXScaleBand(nextBar.data.improvementCategory) as number;

        const bar = {
          x,
          y: yTop,
          height,
          width,
          fill: ordinalColorScale(key) as string
        };

        const textProps = {
          attrs: { x: x + width / 2, y: yTop + height / 2 },

          text: key
        };

        improvedTechBars.push({ bar, textProps, key: x + key });
      }
    });

  return { improvedTechBars };
}

const totalAngle = Math.PI * 2;

export function computeGenderCategoryArcsAndData(
  dataDistribution: ComputedDistribution,
  helpers: BarD3Helpers
) {
  const { femaleCount, maleCount, totalBeneficiaries } = dataDistribution;
  const { arcGenerator, linearColorScale } = helpers;

  linearColorScale.domain([maleCount, femaleCount]);

  let startAngle = 0;
  const genderDistributionData = {} as {
    [FEMALE_LABEL]: { count: number; percent: string };
    [MALE_LABEL]: { count: number; percent: string };
  };

  const genderDistributionArcs = ([
    [femaleCount, FEMALE_LABEL],
    [maleCount, MALE_LABEL]
  ] as [number, keyof typeof genderDistributionData][])
    .filter(([count]) => count > 0)
    .map(([count, label]) => {
      const fraction = count / totalBeneficiaries;
      const percent = (fraction * 100).toFixed(2);
      genderDistributionData[label] = { count, percent };

      const arcOption = {
        innerRadius: 0,
        outerRadius: 220,
        startAngle: startAngle,
        endAngle: startAngle += fraction * totalAngle
      };

      const [labelX, labelY] = arcGenerator.centroid(arcOption);

      return {
        arcProps: { d: arcGenerator(arcOption), fill: linearColorScale(count) },
        labelProps: {
          x: labelX,
          y: labelY,
          labelText: `${label} (${percent}%)`
        }
      };
    });

  return { genderDistributionData, genderDistributionArcs };
}

export function computeAgeDistributionArcsAndData(dataDistribution, helpers) {
  const {
    youthCount,
    adultCount,
    childrenCount,
    totalBeneficiaries
  } = dataDistribution;

  const { linearColorScale, arcGenerator } = helpers;
  linearColorScale.domain([youthCount, adultCount]);

  let startAngle = 0;
  const ageDistributionData = {};

  const ageDistributionArcs = [
    [youthCount, YOUTH_LABEL],
    [adultCount, ADULT_LABEL],
    [childrenCount, CHILDREN_LABEL]
  ]
    .filter(([count]) => count > 0)
    .map(([count, label]) => {
      const fraction = count / totalBeneficiaries;
      const percent = (fraction * 100).toFixed(2);
      ageDistributionData[label] = { count, percent };

      const arcOption = {
        innerRadius: 0,
        outerRadius: 150,
        startAngle: startAngle,
        endAngle: startAngle += fraction * totalAngle
      };

      const [labelX, labelY] = arcGenerator.centroid(arcOption);

      return {
        arcProps: { d: arcGenerator(arcOption), fill: linearColorScale(count) },
        labelProps: {
          x: labelX,
          y: labelY,
          labelText: `${label} (${percent}%)`
        }
      };
    });

  return { ageDistributionData, ageDistributionArcs };
}
