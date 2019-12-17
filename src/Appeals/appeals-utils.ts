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
import { stack as d3Stack, Arc, arc as d3Arc } from "d3-shape";
import { GENDER_FEMALE_DATA, MappedData } from "./appeals-injectables";
import { max as d3Max } from "d3-array";
import { select as d3Select } from "d3-selection";

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

export const initialAgeDistributionData = [YOUTH_LABEL, ADULT_LABEL].reduce(
  (acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }),
  {}
);

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

      if (age < 41) {
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
      [ADULT_LABEL]: []
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
    totalBeneficiaries,
    dataReady: true,
    combinedDistributions
  };
}

export function initCombinedChartD3() {
  const margins = {
    top: 20,
    left: 80,
    right: 30,
    bottom: 20
  };

  const svgWidth = 800;
  const svgHeight = 500;

  const chartHeight = svgHeight - margins.top - margins.bottom;
  const chartWidth = svgWidth - margins.left - margins.right;

  const topScaleLinear = d3ScaleLinear().range([0, chartWidth]);

  const leftScaleBand = d3ScaleBand()
    .range([0, chartHeight])
    .domain(COMBINED_DISTRIBUTION_LABELS_LIST)
    .padding(0.2);

  const xAxisTop = d3AxisTop(topScaleLinear);
  const yAxisLeft = d3AxisLeft(leftScaleBand);

  return {
    topScaleLinear,
    leftScaleBand,
    xAxisTop,
    yAxisLeft,
    bandWidth: leftScaleBand.bandwidth(),
    margins,
    dimensions: {
      svgWidth,
      svgHeight
    }
  };
}

export function computeCombinedChartData(
  dataDistributions: ComputedDistribution,
  d3Objects: CombinedChartD3
) {
  const { combinedDistributions } = dataDistributions;

  const { topScaleLinear, leftScaleBand } = d3Objects;

  topScaleLinear.domain([0, d3Max(Object.values(combinedDistributions))]);

  const bars: CombinedChartDatum[] = COMBINED_DISTRIBUTION_LABELS_LIST.map(
    label => {
      const y = leftScaleBand(label) as number;

      return {
        barProps: {
          y,
          width: topScaleLinear(combinedDistributions[label])
        }
      };
    }
  );

  return { bars };
}

export function combinedBarChartCustomLeftAxis(
  leftAxisDomRef: SVGGElement,
  d3YAxisLeft: Axis<string>
) {
  const lineHeightEm = 1.2;
  const halfLineHeightEm = lineHeightEm / 2;

  const d3SelectedLeftAxis = d3Select<SVGGElement, string>(leftAxisDomRef).call(
    d3YAxisLeft
  );

  const fontSizePixel = parseFloat(d3SelectedLeftAxis.attr("font-size"));
  const maxTextLen = fontSizePixel * 5; // 5em

  d3SelectedLeftAxis
    .selectAll<SVGElement, string>(".tick text")
    .each(function(label: string) {
      const svgNodeText = this;

      svgNodeText.textContent = "";
      const x = svgNodeText.getAttribute("x") as string;

      let word = "";

      let wordsLine: string[] = [];
      const words = label.split(/\s+/).reverse();

      let svgNodeTSpan = svgNodeText.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "tspan")
      );

      const dyNumberEm = parseFloat(
        (/[\d.]+/.exec(svgNodeText.getAttribute("dy") as string) as string[])[0]
      );
      svgNodeText.removeAttribute("dy");

      svgNodeTSpan.setAttribute("x", x);
      svgNodeTSpan.setAttribute("dy", `${dyNumberEm}em`);

      let lineNumber = 0;

      while ((word = words.pop() as string)) {
        wordsLine.push(word);
        svgNodeTSpan.textContent = wordsLine.join(" ");

        if (svgNodeTSpan.getComputedTextLength() > maxTextLen) {
          wordsLine.pop();
          svgNodeTSpan.textContent = wordsLine.join(" ");
          wordsLine = [word];

          const firstSvgNodeTSpan = svgNodeText.firstElementChild as SVGTextElement;

          firstSvgNodeTSpan.setAttribute(
            "dy",
            `${dyNumberEm - ++lineNumber * halfLineHeightEm}em`
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

export function initBarChartD3() {
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

export function computeImprovedTechChartData(
  dataDistributions: ComputedDistribution,
  d3Objects: BarChartD3
) {
  const { barYScale, barXScaleBand, ordinalColorScale } = d3Objects;

  const {
    improvedTechFemaleCount,
    improvedTechMaleCount,
    totalBeneficiaries,
    femaleCount,
    maleCount
  } = dataDistributions;

  barYScale.domain([0, totalBeneficiaries]);

  const data: TechImprovementDatum[] = [
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

  d3Stack<TechImprovementDatum>()
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

export function computeGenderDistributionChartData(
  dataDistribution: ComputedDistribution,
  d3Objects: ArcD3Objects
) {
  const { femaleCount, maleCount, totalBeneficiaries } = dataDistribution;
  const { arcGenerator, linearColorScale } = d3Objects;

  linearColorScale.domain([maleCount, femaleCount]);

  let startAngle = 0;
  const genderDistributionData = {} as {
    [FEMALE_LABEL]: DataCount;
    [MALE_LABEL]: DataCount;
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

export function computeAgeDistributionChartData(
  dataDistribution: ComputedDistribution,
  d3Objects: ArcD3Objects
) {
  const {
    youthCount,
    adultCount,
    childrenCount,
    totalBeneficiaries
  } = dataDistribution;

  const { linearColorScale, arcGenerator } = d3Objects;
  linearColorScale.domain([youthCount, adultCount]);

  let startAngle = 0;
  const ageDistributionData = {} as AgeDistributionCount;

  const ageDistributionArcs: DistributionArc[] = ([
    [youthCount, YOUTH_LABEL],
    [adultCount, ADULT_LABEL],
    [childrenCount]
  ] as [number, keyof AgeDistributionMap][])
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

export interface DistributionArc {
  arcProps: {
    d: string | null;
    fill: string;
  };
  labelProps: {
    x: number;
    y: number;
    labelText: string;
  };
}

export const arcD3Objects: ArcD3Objects = {
  arcGenerator: d3Arc(),
  linearColorScale: d3ScaleLinear<string, string>().range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56"
  ])
};

////////////////////////// TYPES ////////////////////////////

export interface ArcD3Objects {
  arcGenerator: Arc<
    unknown,
    {
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
    }
  >;
  linearColorScale: ScaleLinear<string, string>;
}

interface TechImprovementDatum {
  improvementCategory: string;
  [MALE_LABEL]: number;
  [FEMALE_LABEL]: number;
}

interface BarChartD3 {
  barYScale: ScaleLinear<number, number>;
  barXScaleBand: ScaleBand<string>;
  ordinalColorScale: ScaleOrdinal<string, unknown>;
  xAxis: Axis<string>;
  yAxis: Axis<string>;
}

interface CombinedChartD3 {
  topScaleLinear: ScaleLinear<number, number>;
  leftScaleBand: ScaleBand<string>;
  xAxisTop: Axis<
    | number
    | {
        valueOf(): number;
      }
  >;
  yAxisLeft: Axis<string>;
  bandWidth: number;
  margins: {};
  dimensions: {
    svgWidth: number;
    svgHeight: number;
  };
}

interface AgeDistributionMap {
  [YOUTH_LABEL]: MappedData[];
  [ADULT_LABEL]: MappedData[];
}

type KeyOfAgeDistributionMap = keyof AgeDistributionMap;

type AgeDistributionCount = {
  [k in KeyOfAgeDistributionMap]: DataCount;
};

export interface ComputedDistribution {
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

interface DataCount {
  count: number;
  percent: string;
}

interface CombinedChartDatum {
  barProps: {
    y: number;
    width: number;
  };
}

export interface CombinedChartData {
  bars: CombinedChartDatum[];
}
