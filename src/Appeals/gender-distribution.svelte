<script>
  import {
    computeGenderCategoryArcsAndData,
    initialGenderDistributionData,
    PIE_TRANSLATE
  } from "./appeals-utils";
  import { arc as d3Arc } from "d3-shape";


  export let dataDistributions = {};
  export let genderDistributionArcs = [];
  export let genderDistributionData = initialGenderDistributionData;
  export let d3Helpers;

  $: if (dataDistributions.dataReady) {
    const arcsAndData = computeGenderCategoryArcsAndData(dataDistributions, d3Helpers);

    genderDistributionArcs = arcsAndData.genderDistributionArcs;
    genderDistributionData = arcsAndData.genderDistributionData;
  }
</script>

<div class="chart-container gender-distribution">
  <svg width="500" height="500">
    <g transform="translate({PIE_TRANSLATE},{PIE_TRANSLATE})">
    {#each genderDistributionArcs as { arcProps, labelProps:{x, y, labelText} }}
        <path {...arcProps} stroke="white" />

        <text
          class="outline"
          text-anchor="middle"
          x={x}
          y={y}>
          {labelText}
        </text>

        <text x={x} y={y} text-anchor="middle">
          {labelText}
        </text>
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
