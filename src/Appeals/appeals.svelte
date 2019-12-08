<script>
  import { onMount } from "svelte";
  import { arc } from "d3-shape";
  import { scaleLinear as d3ScaleLinear } from "d3-scale";
  import lodashGroupBy from "lodash/groupBy";
  import { headerMapping } from "./appeals-injectables.js";

  const FEMALE_LABEL = "Female";
  const MALE_LABEL = "Male";
  const YOUTH_LABEL = "Youth";
  const ADULT_LABEL = "Adult";
  const CHILDREN_LABEL = "Children";
  const arcGenerator = arc();
  const colorSchema = d3ScaleLinear().range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56"
  ]);
  const PIE_TRANSLATE = 250;
  const PIE_LABEL_OFFSET = 50;

  export let fetchDataFn;
  let arcs = [];
  let data = [];
  let ageArcs = [];
  let numCandidates = 0;

  let femaleMaleCountsMap = [FEMALE_LABEL, MALE_LABEL].reduce(
    (acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }),
    {}
  );

  let ageDistributionCountsMap = [
    YOUTH_LABEL,
    ADULT_LABEL,
    CHILDREN_LABEL
  ].reduce((acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }), {});

  onMount(async () => {
    data = await fetchDataFn();

    let countYouths = 0;
    let countsAdults = 0;
    let countsChildren = 0;

    const ageDistributionMap = data.reduce(
      (acc, d) => {
        const { age } = d;

        if (age < 18) {
          ++countsChildren;
          acc[CHILDREN_LABEL].push(d);
        } else if (age < 41) {
          ++countYouths;
          acc[YOUTH_LABEL].push(d);
        } else {
          ++countsAdults;
          acc[ADULT_LABEL].push(d);
        }

        return acc;
      },
      {
        [YOUTH_LABEL]: [],
        [ADULT_LABEL]: [],
        [CHILDREN_LABEL]: []
      }
    );

    const { Female, Male } = lodashGroupBy(data, d => d.gender);
    const countFemales = Female.length;
    const countMales = Male.length;
    numCandidates = countFemales + countMales;
    const countsMap = {};

    const totalAngle = Math.PI * 2;
    colorSchema.domain([countMales, countFemales]);
    let startAngle = 0;

    arcs = [
      [countFemales, FEMALE_LABEL],
      [countMales, MALE_LABEL]
    ].map(([count, label]) => {
      const fraction = count / numCandidates;
      const percent = (fraction * 100).toFixed(2);
      countsMap[label] = { count, percent };

      const arcOption = {
        innerRadius: 0,
        outerRadius: 220,
        startAngle: startAngle,
        endAngle: startAngle += fraction * totalAngle
      };

      return {
        d: arcGenerator(arcOption),
        fill: colorSchema(count),
        label: `${label} (${percent}%)`,
        centroid: arcGenerator.centroid(arcOption)
      };
    });

    startAngle = 0;
    const ageCountsMap = {};

    ageArcs = [
      [countYouths, YOUTH_LABEL],
      [countsAdults, ADULT_LABEL],
      [countsChildren, CHILDREN_LABEL]
    ]
      .filter(([count]) => count > 0)
      .map(([count, label]) => {
        const fraction = count / numCandidates;
        const percent = (fraction * 100).toFixed(2);
        ageCountsMap[label] = { count, percent };

        const arcOption = {
          innerRadius: 0,
          outerRadius: 150,
          startAngle: startAngle,
          endAngle: startAngle += fraction * totalAngle
        };

        return {
          d: arcGenerator(arcOption),
          fill: colorSchema(count),
          label: `${label} (${percent}%)`,
          centroid: arcGenerator.centroid(arcOption)
        };
      });

    femaleMaleCountsMap = countsMap;
    ageDistributionCountsMap = ageCountsMap;
  });
</script>

<style>
  .title {
    text-align: center;
  }

  .chart-container {
    display: flex;
  }

  @media (max-width: 899px) {
    .chart-container {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .data-summary-table {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid #999;
    padding: 0.5rem;
  }

  .raw-data-table {
    max-height: 250px;
    overflow: auto;
    border-bottom: 1px solid #999;
    position: relative;
  }

  .num-candidates {
    max-width: 100px;
  }
</style>

<div class="appeals">
  <div class="raw-data-table">
    <table>
      <thead>
        <tr>
          <th>S/N</th>

          {#each Object.keys(headerMapping) as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each data as d, index}
          <tr>
            <td>{index + 1}</td>
            <td>{d.name}</td>
            <td>{d.gender}</td>
            <td>{d.age}</td>
            <td>{d.segment}</td>
            <td>{d.receivedAssets}</td>
            <td>{d.improvedTech}</td>
            <td>{d.receivedTraining}</td>
          </tr>
        {/each}
      </tbody>
    </table>

  </div>

  <h3 class="title">Raw Data</h3>

  <div class="chart-container gender-distribution">
    <svg width="500" height="500">
      <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
        {#each arcs as arc}
          <path d={arc.d} fill={arc.fill} stroke="white" />

          <!-- label -->
          <text
            class="outline"
            x={arc.centroid[0] - PIE_LABEL_OFFSET}
            y={arc.centroid[1]}>
            {arc.label}
          </text>

          <text x={arc.centroid[0] - PIE_LABEL_OFFSET} y={arc.centroid[1]}>
            {arc.label}
          </text>
          <!-- label -->
        {/each}
      </g>
    </svg>

    <div class="data-summary-table">
      <table>
        <thead>
          <tr>
            <th>Gender</th>
            <th class="num-candidates">Number of candidates</th>
            <th>% Distribution</th>
          </tr>
        </thead>

        <tbody>
          {#each Object.entries(femaleMaleCountsMap) as [k, { count, percent }]}
            {#if count > 0}
              <tr>
                <td>{k}</td>
                <td>{count}</td>
                <td>{percent}</td>
              </tr>
            {/if}
          {/each}

          {#if numCandidates > 0}
            <td>
              <strong>Total</strong>
            </td>

            <td>
              <strong>{numCandidates}</strong>
            </td>

            <td>
              <strong>100%</strong>
            </td>
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <h3 class="title">
    Distribution of beneficiaries by
    <strong>gender</strong>
  </h3>

  <div class="chart-container age-distribution">
    <svg width="500" height="500">
      <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
        {#each ageArcs as arc}
          <path d={arc.d} fill={arc.fill} stroke="white" />

          <!-- label -->
          <text
            class="outline"
            x={arc.centroid[0] - PIE_LABEL_OFFSET}
            y={arc.centroid[1]}>
            {arc.label}
          </text>

          <text x={arc.centroid[0] - PIE_LABEL_OFFSET} y={arc.centroid[1]}>
            {arc.label}
          </text>
          <!-- label -->
        {/each}
      </g>
    </svg>

    <div class="data-summary-table">
      <table>
        <thead>
          <tr>
            <th>Age Category</th>
            <th class="num-candidates">Number of candidates</th>
            <th>% Distribution</th>
          </tr>
        </thead>

        <tbody>
          {#each Object.entries(ageDistributionCountsMap) as [k, { count, percent }]}
            {#if count > 0}
              <tr>
                <td>{k}</td>
                <td>{count}</td>
                <td>{percent}</td>
              </tr>
            {/if}
          {/each}

          {#if numCandidates > 0}
            <td>
              <strong>Total</strong>
            </td>

            <td>
              <strong>{numCandidates}</strong>
            </td>

            <td>
              <strong>100%</strong>
            </td>
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <h3 class="title">
    Distribution of beneficiaries by
    <strong>age</strong>
  </h3>

</div>
