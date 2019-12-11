<script>
  import {
    computeGenderCategoryArcsAndData,
    initialGenderDistributionData,
    PIE_TRANSLATE
  } from "./appeals-utils";
  import { arc as d3Arc } from "d3-shape";

  const arcGenerator = d3Arc();

  export let dataDistributions = {};
  export let genderDistributionArcs = [];
  export let genderDistributionData = initialGenderDistributionData;
  export let d3Helpers;

  $: if (dataDistributions.dataReady) {
    const arcsAndData = computeGenderCategoryArcsAndData(dataDistributions, {
      arcGenerator,
      ...d3Helpers
    });

    genderDistributionArcs = arcsAndData.genderDistributionArcs;
    genderDistributionData = arcsAndData.genderDistributionData;
  }
</script>

<div class="chart-container gender-distribution">
  <svg width="500" height="500">
    <g transform={`translate(${PIE_TRANSLATE},${PIE_TRANSLATE})`}>
      {#each genderDistributionArcs as arc}
        <path d={arc.d} fill={arc.fill} stroke="white" />

        <!-- label -->
        <text
          class="outline"
          text-anchor="middle"
          x={arc.centroid[0]}
          y={arc.centroid[1]}>
          {arc.label}
        </text>

        <text x={arc.centroid[0]} y={arc.centroid[1]} text-anchor="middle">
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
