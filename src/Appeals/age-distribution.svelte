<script type="text/typescript">
  import {
    computeAgeDistributionArcsAndData,
    initialAgeDistributionData,
    PIE_TRANSLATE,
    ArcD3Helpers,
    DistributionArc,
    ComputedDistribution
  } from "./appeals-utils";

  export let dataDistributions = {} as ComputedDistribution;
  export let d3Helpers = {} as ArcD3Helpers;
  export let ageDistributionArcs = [] as DistributionArc[];
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
    <g transform="translate({PIE_TRANSLATE},{PIE_TRANSLATE})">
      {#each ageDistributionArcs as { arcProps, labelProps: { x, y, labelText } }}
        <path {...arcProps} stroke="white" />

        <text class="outline" text-anchor="middle" {x} {y}>{labelText}</text>

        <text {x} {y} text-anchor="middle">{labelText}</text>
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
