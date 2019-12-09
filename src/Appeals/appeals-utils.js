import {
  scaleLinear as d3ScaleLinear,
  scaleBand as d3ScaleBand,
  scaleOrdinal as d3ScaleOrdinal
} from "d3-scale";
import { arc } from "d3-shape";
import { axisBottom, axisLeft } from "d3-axis";
import { stack as d3Stack } from "d3-shape";
import { GENDER_FEMALE_DATA } from "./appeals-injectables.js";

export const BAR_HEIGHT = 400;
export const BAR_WIDTH = 400;
export const BAR_MARGINS = {
  top: 10,
  left: 50,
  right: 30,
  bottom: 20
};
export const FEMALE_LABEL = "Female";
export const MALE_LABEL = "Male";
export const YOUTH_LABEL = "Youth";
export const ADULT_LABEL = "Adult";
export const CHILDREN_LABEL = "Children";

export const initialGenderDistributionData = [FEMALE_LABEL, MALE_LABEL].reduce(
  (acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }),
  {}
);

export const initialAgeDistributionData = [
  YOUTH_LABEL,
  ADULT_LABEL,
  CHILDREN_LABEL
].reduce((acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }), {});

export function getBarD3Helpers() {
  const barYScale = d3ScaleLinear().range([BAR_HEIGHT, 0]);
  const barXScale = d3ScaleBand().range([0, BAR_WIDTH]);
  const colorScale = d3ScaleOrdinal()
    .domain([FEMALE_LABEL, MALE_LABEL])
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);
  const xAxis = axisBottom(barXScale);
  const yAxis = axisLeft(barYScale);
  const arcGenerator = arc();

  const colorSchema = d3ScaleLinear().range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56"
  ]);

  return {
    barYScale,
    barXScale,
    colorScale,
    xAxis,
    yAxis,
    arcGenerator,
    colorSchema
  };
}

// improved tech beneficiaries
const IMPROVED_TECH_LABEL = "Improved Tech";
const NON_IMPROVED_TECH_LABEL = "Non Improved Tech";

export function computeBars(args) {
  const {
    improvedTechFemaleCount,
    improvedTechMaleCount,
    totalBeneficiaries,
    barYScale,
    barXScale,
    femaleCount,
    maleCount,
    colorScale
  } = args;

  barXScale.domain([IMPROVED_TECH_LABEL, NON_IMPROVED_TECH_LABEL]);
  barYScale.domain([0, computeSuperMax(totalBeneficiaries)]);

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

  const improvedTechBars = d3Stack()
    .keys([FEMALE_LABEL, MALE_LABEL])(data)
    .map(d => {
      let i = 0;
      const len = d.length;
      const nextBars = [];

      for (; i < len; i++) {
        const nextBar = d[i];
        const y0 = barYScale(nextBar[0]);
        const y1 = barYScale(nextBar[1]);

        nextBars.push({
          x: barXScale(nextBar.data.improvementCategory),
          y: y1,
          height: y0 - y1,
          width: barXScale.bandwidth(),
          fill: colorScale(d.key)
        });
      }

      return nextBars;
    });

  return {
    improvedTechBars: improvedTechBars.flat()
  };
}

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
    totalBeneficiaries: maleCount + femaleCount
  };
}

const totalAngle = Math.PI * 2;

export function computeGenderCategoryArcsAndData({
  arcGenerator,
  colorSchema,
  femaleCount,
  maleCount,
  totalBeneficiaries
}) {
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
        fill: colorSchema(count),
        label: `${label} (${percent}%)`,
        centroid: arcGenerator.centroid(arcOption)
      };
    });

  return { genderDistributionData, genderDistributionArcs };
}

export function computeAgeDistributionArcsAndData({
  youthCount,
  adultCount,
  childrenCount,
  colorSchema,
  arcGenerator,
  totalBeneficiaries
}) {
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
        fill: colorSchema(count),
        label: `${label} (${percent}%)`,
        centroid: arcGenerator.centroid(arcOption)
      };
    });

  return { ageDistributionData, ageDistributionArcs };
}

function computeSuperMax(totalBeneficiaries) {
  const string = "" + totalBeneficiaries;
  const lastCharNumber = +string.charAt(string.length - 1);
  return totalBeneficiaries + (10 - lastCharNumber);
}
