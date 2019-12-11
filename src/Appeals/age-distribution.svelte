<script>
  import {
    computeAgeDistributionArcsAndData,
    initialAgeDistributionData,
    PIE_TRANSLATE
  } from "./appeals-utils";

  export let dataDistributions = {};
  export let d3Helpers;
  export let ageDistributionArcs = [];
  export let ageDistributionData = initialAgeDistributionData;

  $: if (dataDistributions.dataReady) {
    const arcsAndData = computeAgeDistributionArcsAndData(
      dataDistributions,
      d3Helpers
    );

    ageDistributionArcs = arcsAndData.ageDistributionArcs;
    ageDistributionData = arcsAndData.ageDistributionData;
  }
</script>

<style>
  .num-candidates {
    max-width: 100px;
  }
</style>

<div class="chart-container age-distribution">
  <svg width="500" height="500">
    <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
      {#each ageDistributionArcs as { d, fill, centroid, label } (fill)}
        <path {d} {fill} stroke="white" />

        <!-- label -->
        <text
          text-anchor="middle"
          class="outline"
          x={centroid[0]}
          y={centroid[1]}>
          {label}
        </text>

        <text text-anchor="middle" x={centroid[0]} y={centroid[1]}>
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

        {#if dataDistributions.totalBeneficiaries > 0}
          <td>
            <strong>Total</strong>
          </td>

          <td>
            <strong>{dataDistributions.totalBeneficiaries}</strong>
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
