import {
  scaleLinear as d3ScaleLinear,
  scaleBand as d3ScaleBand,
  scaleOrdinal as d3ScaleOrdinal
} from "d3-scale";
import { stack as d3Stack } from "d3-shape";
import { axisBottom, axisLeft } from "d3-axis";
import { GENDER_FEMALE_DATA } from "./appeals-injectables.js";

export const BAR_HEIGHT = 400;
export const BAR_WIDTH = 400;
export const BAR_MARGINS = {
  top: 10,
  left: 50,
  right: 30,
  bottom: 20
};

export const BAR_SVG_WIDTH = BAR_WIDTH + BAR_MARGINS.top + BAR_MARGINS.bottom;
export const BAR_SVG_HEIGHT = BAR_HEIGHT + BAR_MARGINS.left + BAR_MARGINS.right;

export const FEMALE_LABEL = "Female";
export const MALE_LABEL = "Male";
export const YOUTH_LABEL = "Youth";
export const ADULT_LABEL = "Adult";
export const CHILDREN_LABEL = "Children";
export const PIE_TRANSLATE = 250;
export const PIE_LABEL_OFFSET = 50;

// improved tech beneficiaries
const IMPROVED_TECH_LABEL = "Improved Tech";
const NON_IMPROVED_TECH_LABEL = "Non Improved Tech";

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

  // gender distribution
  let femaleCount = 0;
  let maleCount = 0;

  /* age distribution */
  let youthCount = 0;
  let adultCount = 0;
  let childrenCount = 0;

  //ageDistributionMap
  data.reduce(
    (acc, d) => {
      const { age, gender, improvedTech } = d;

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
        ++maleCount;

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
    }
  );

  return {
    maleCount,
    femaleCount,
    improvedTechMaleCount,
    improvedTechFemaleCount,
    youthCount,
    adultCount,
    childrenCount,
    totalBeneficiaries: maleCount + femaleCount,
    dataReady: true
  };
}

export function getBarD3Helpers() {
  const barYScale = d3ScaleLinear().range([BAR_HEIGHT, 0]);

  const barXScaleBand = d3ScaleBand()
    .range([0, BAR_WIDTH])
    .padding(0.2)
    .domain([IMPROVED_TECH_LABEL, NON_IMPROVED_TECH_LABEL]);

  const ordinalColorScale = d3ScaleOrdinal()
    .domain([FEMALE_LABEL, MALE_LABEL])
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const xAxis = axisBottom(barXScaleBand);
  const yAxis = axisLeft(barYScale);

  return {
    barYScale,
    barXScaleBand,
    ordinalColorScale,
    xAxis,
    yAxis
  };
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
      improvementCategory: NON_IMPROVED_TECH_LABEL,
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

        const bar = {
          x,
          y: yTop,
          height,
          width,
          fill: ordinalColorScale(key)
        };

        const textProps = {
          attrs: {
            x: x + width / 2,
            y: yTop + height / 2
          },

          text: key
        };

        improvedTechBars.push({ bar, textProps, key: x + key });
      }
    });

  return {
    improvedTechBars
  };
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

      return {
        d: arcGenerator(arcOption),
        fill: linearColorScale(count),
        label: `${label} (${percent}%)`,
        centroid: arcGenerator.centroid(arcOption)
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

      return {
        d: arcGenerator(arcOption),
        fill: linearColorScale(count),
        label: `${label} (${percent}%)`,
        centroid: arcGenerator.centroid(arcOption)
      };
    });

  return { ageDistributionData, ageDistributionArcs };
}
