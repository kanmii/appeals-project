import {
  axisTop as d3AxisTop,
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft
} from "d3-axis";
import {
  scaleBand as d3ScaleBand,
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from "d3-scale";
import { stack as d3Stack } from "d3-shape";

import { GENDER_FEMALE_DATA } from "./appeals-injectables.js";

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
const RECEIVED_ASSETS_LABEL = "Received\nAssets";
const NO_RECEIVED_ASSETS_LABEL = "No Received\nAssets";
const RECEIVED_TRAINING_LABEL = "Received\nTraining";
const NO_RECEIVED_TRAINING_LABEL = "No Received\nTraining";
const IMPROVED_TECH_LABEL = "Improved\nTech";
const NO_IMPROVED_TECH_LABEL = "Non Improved\nTech";

export const COMBINED_DISTRIBUTION_LABELS_LIST = [
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

export function computeDistributions(data) {
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
    { [YOUTH_LABEL]: [], [ADULT_LABEL]: [], [CHILDREN_LABEL]: [] }
  );

  const maleCount = totalBeneficiaries - femaleCount;

  const combinedDistributions = {
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

export function getCombinedChartHelpers() {
  const chartHeight =
    COMBINED_BAR_CONTAINER_HEIGHT - BAR_MARGINS.top - BAR_MARGINS.bottom;

  const chartWidth =
    COMBINED_BAR_CONTAINER_WIDTH - BAR_MARGINS.left - BAR_MARGINS.right;

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
    chartWidth
  };
}

export function computeCombinedBars(dataDistributions, chartHelpers) {
  const { totalBeneficiaries, combinedDistributions } = dataDistributions;

  const { topScaleLinear, leftScaleBand} = chartHelpers;

  topScaleLinear.domain([0, totalBeneficiaries]);

  const bandWidth = leftScaleBand.bandwidth();
  const halfHeight = bandWidth / 2;
  const x = 0;

  const bars = COMBINED_DISTRIBUTION_LABELS_LIST.map(label => {
    const y = leftScaleBand(label);
    const labelProps = {
      y: y + halfHeight
    };

    const words = label.split("\n");
    let wordIndex = 0;
    const wordsLen = words.length;
    const textSpanProps = [{ text: words[wordIndex] }];
    labelProps.textSpanProps = textSpanProps;

    for (++wordIndex; wordIndex < wordsLen; wordIndex++) {
      textSpanProps.push({
        text: words[wordIndex],
        dy: 15
      });
    }

    return {
      barProps: {
        y,
        x,
        height: bandWidth,
        width: topScaleLinear(combinedDistributions[label])
      },
      labelProps
    };
  });

  return { bars };
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

export function computeImprovedTechBarsAndData(dataDistributions, barHelpers) {
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

  const improvedTechBars = [];
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
        const x = barXScaleBand(nextBar.data.improvementCategory);

        const bar = { x, y: yTop, height, width, fill: ordinalColorScale(key) };

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

export function computeGenderCategoryArcsAndData(dataDistribution, helpers) {
  const { femaleCount, maleCount, totalBeneficiaries } = dataDistribution;
  const { arcGenerator, linearColorScale } = helpers;

  linearColorScale.domain([maleCount, femaleCount]);

  let startAngle = 0;
  const genderDistributionData = {};

  const genderDistributionArcs = [
    [femaleCount, FEMALE_LABEL],
    [maleCount, MALE_LABEL]
  ]
    .filter(([count]) => count > 0)
    .map(([count, label]) => {
      const fraction = count / totalBeneficiaries;
      const percent = (fraction * 100).toFixed(2);
      genderDistributionData[label] = { count, percent };

      const arcOption = {
        innerRadius: 0,
        outerRadius: 220,
        startAngle: startAngle,
        endAngle: (startAngle += fraction * totalAngle)
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
        endAngle: (startAngle += fraction * totalAngle)
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
