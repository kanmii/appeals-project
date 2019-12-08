<script>
  import { onMount } from "svelte";
  import { arc } from "d3-shape";
  import { scaleLinear as d3ScaleLinear } from "d3-scale";
  import lodashGroupBy from "lodash/groupBy";
  import { headerMapping } from "./appeals-injectables.js";

  const FEMALE_LABEL = "Female";
  const MALE_LABEL = "Male";

  export let fetchDataFn;
  let arcs = [];
  let data = [];
  let femaleMaleCountsMap = [FEMALE_LABEL, MALE_LABEL].reduce(
    (acc, l) => ({ ...acc, [l]: { count: 0, percent: 0 } }),
    {}
  );

  const arcGenerator = arc();

  const colorSchema = d3ScaleLinear().range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56"
  ]);

  onMount(async () => {
    data = await fetchDataFn();

    const { Female, Male } = lodashGroupBy(data, d => d.gender);
    const countFemales = Female.length;
    const countMales = Male.length;
    const numCandidates = countFemales + countMales;
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

    femaleMaleCountsMap = countsMap;
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

  <div class="chart-container">
    <svg width="500" height="500">
      <g transform="translate(250,250)">
        {#each arcs as arc}
          <path d={arc.d} fill={arc.fill} stroke="white" />

          <!-- label -->
          <text class="outline" x={arc.centroid[0] - 20} y={arc.centroid[1]}>
            {arc.label}
          </text>

          <text x={arc.centroid[0] - 20} y={arc.centroid[1]}>{arc.label}</text>
          <!-- label -->
        {/each}
      </g>
    </svg>

    <div class="data-summary-table">
      <table>
        <thead>
          <tr>
            <th>Gender</th>
            <th>Number of candidates</th>
            <th>% Distribution</th>
          </tr>
        </thead>

        <tbody>
          {#each Object.entries(femaleMaleCountsMap) as [k, { count, percent }]}
            <tr>
              <td>{k}</td>
              <td>{count}</td>
              <td>{percent}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <h3 class="title">Distribution of beneficiaries by gender</h3>
</div>
