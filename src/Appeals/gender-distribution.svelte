<script context="module">
  import {
    computeGenderDistributionChartData,
    initialGenderDistributionData,
    PIE_TRANSLATE,
    arcD3Objects
  } from "./appeals-utils";
</script>

<script>
  export let dataDistributions = {};
  export let genderDistributionArcs = [];
  export let genderDistributionData = initialGenderDistributionData;

  $: if (dataDistributions.dataReady) {
    const arcsAndData = computeGenderDistributionChartData(
      dataDistributions,
      arcD3Objects
    );

    genderDistributionArcs = arcsAndData.genderDistributionArcs;
    genderDistributionData = arcsAndData.genderDistributionData;
  }
</script>

<div class="chart-container gender-distribution">
  <svg width="500" height="500">
    <g transform="translate({PIE_TRANSLATE},{PIE_TRANSLATE})">
      {#each genderDistributionArcs as { arcProps, labelProps: { x, y, labelText } }}
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
          <th>Gender</th>
          <th class="num-candidates">Number of candidates</th>
          <th>% Distribution</th>
        </tr>
      </thead>

      <tbody>
        {#each Object.entries(genderDistributionData) as [k, { count, percent }] (k)}
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
  <strong>gender</strong>
</h3>
