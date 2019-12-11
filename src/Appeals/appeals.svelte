<script>
  import { onMount } from "svelte";
  import { headerMapping } from "./appeals-injectables.js";
  import {
    computeDistributions,
    computeAgeDistributionArcsAndData,
    initialAgeDistributionData,
    PIE_TRANSLATE,
    PIE_LABEL_OFFSET
  } from "./appeals-utils";
  import { scaleLinear as d3ScaleLinear } from "d3-scale";
  import { arc as d3Arc } from "d3-shape";

  const arcGenerator = d3Arc();
  const linearColorScale = d3ScaleLinear().range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56"
  ]);

  let data = [];
  let ageDistributionArcs = [];
  let ageDistributionData = initialAgeDistributionData;

  let totalBeneficiaries = 0;

  export let fetchDataFn;
  export let distributions = {
    maleCount: 0,
    femaleCount: 0,
    improvedTechMaleCount: 0,
    improvedTechFemaleCount: 0,
    youthCount: 0,
    adultCount: 0,
    childrenCount: 0,
    totalBeneficiaries: 0,
    dataReady: false
  };

  onMount(async () => {
    data = await fetchDataFn();

    if (!data.length) {
      return;
    }

    distributions = computeDistributions(data);

    totalBeneficiaries = distributions.totalBeneficiaries;

    const ageDistributionComputed = computeAgeDistributionArcsAndData(
      distributions,
      {
        linearColorScale,
        arcGenerator
      }
    );

    ageDistributionData = ageDistributionComputed.ageDistributionData;
    ageDistributionArcs = ageDistributionComputed.ageDistributionArcs;
  });
</script>

<style>
  .appeals :global(.title) {
    text-align: center;
  }

  .appeals :global(.chart-container) {
    display: flex;
  }

  @media (max-width: 899px) {
    .appeals :global(.chart-container) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .appeals :global(.data-summary-table) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .appeals :global(table) {
    border-collapse: collapse;
  }

  .appeals :global(td, th) {
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

  <div class="chart-container age-distribution">
    <svg width="500" height="500">
      <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
        {#each ageDistributionArcs as { d, fill, centroid, label } (fill)}
          <path {d} {fill} stroke="white" />

          <!-- label -->
          <text
            class="outline"
            x={centroid[0] - PIE_LABEL_OFFSET}
            y={centroid[1]}>
            {label}
          </text>

          <text x={centroid[0] - PIE_LABEL_OFFSET} y={centroid[1]}>
            {label}
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
          {#each Object.entries(ageDistributionData) as [k, { count, percent }] (k)}
            {#if count > 0}
              <tr>
                <td>{k}</td>
                <td>{count}</td>
                <td>{percent}</td>
              </tr>
            {/if}
          {/each}

          {#if totalBeneficiaries > 0}
            <td>
              <strong>Total</strong>
            </td>

            <td>
              <strong>{totalBeneficiaries}</strong>
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

  <slot
    name="genderDistribution"
    dataDistributions={distributions}
    d3Helpers={{ linearColorScale }} />

  <slot name="improvedTech" dataDistributions={distributions} />
</div>
