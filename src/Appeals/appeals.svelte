<script>
  import { onMount } from "svelte";
  import { headerMapping } from "./appeals-injectables.js";
  import {
    getBarD3Helpers,
    computeBars,
    computeDistributions,
    computeGenderCategoryArcsAndData,
    computeAgeDistributionArcsAndData,
    initialGenderDistributionData,
    initialAgeDistributionData
  } from "./appeals-utils";

  const PIE_TRANSLATE = 250;
  const PIE_LABEL_OFFSET = 50;
  const barD3Helpers = getBarD3Helpers();

  export let fetchDataFn;
  let genderDistributionArcs = [];
  let data = [];
  let ageDistributionArcs = [];
  let totalBeneficiaries = 0;
  let genderDistributionData = initialGenderDistributionData;
  let ageDistributionData = initialAgeDistributionData;

  onMount(async () => {
    data = await fetchDataFn();

    const distributions = computeDistributions(data);
    totalBeneficiaries = distributions.totalBeneficiaries;

    const {
      femaleCount,
      maleCount,
      improvedTechFemaleCount,
      improvedTechMaleCount,
      youthCount,
      adultCount,
      childrenCount
    } = distributions;

    const { arcGenerator, colorSchema } = barD3Helpers;
    colorSchema.domain([maleCount, femaleCount]);

    const genderDistributionComputed = computeGenderCategoryArcsAndData({
      arcGenerator,
      colorSchema,
      femaleCount,
      maleCount,
      totalBeneficiaries
    });

    genderDistributionData = genderDistributionComputed.genderDistributionData;
    genderDistributionArcs = genderDistributionComputed.genderDistributionArcs;

    const ageDistributionComputed = computeAgeDistributionArcsAndData({
      youthCount,
      adultCount,
      childrenCount,
      colorSchema,
      arcGenerator,
      totalBeneficiaries
    });
    ageDistributionData = ageDistributionComputed.ageDistributionData;
    ageDistributionArcs = ageDistributionComputed.ageDistributionArcs;

    const bars = computeBars({
      improvedTechFemaleCount,
      improvedTechMaleCount,
      totalBeneficiaries,
      femaleCount,
      maleCount,
      ...barD3Helpers
    });

    console.log(bars.barData);
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
        {#each genderDistributionArcs as arc}
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
          {#each Object.entries(genderDistributionData) as [k, { count, percent }]}
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
    <strong>gender</strong>
  </h3>

  <div class="chart-container age-distribution">
    <svg width="500" height="500">
      <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
        {#each ageDistributionArcs as arc}
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
          {#each Object.entries(ageDistributionData) as [k, { count, percent }]}
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
</div>
