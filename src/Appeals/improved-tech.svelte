<script>
  import { select as d3Select } from "d3-selection";
  import {
    computeBars,
    BAR_HEIGHT,
    BAR_MARGINS,
    BAR_SVG_WIDTH,
    BAR_SVG_HEIGHT
  } from "./appeals-utils";

  let improvedTechBarsXAxisContainerDom;
  let improvedTechBarsYAxisContainerDom;

  export let improvedTechBars = [];
  export let improvedTechFemaleCount = 0;
  export let improvedTechMaleCount = 0;
  export let maleCount = 0;
  export let femaleCount = 0;
  export let barD3Helpers = {};
  export let dataReady;
export let totalBeneficiaries = 0;

  $: if (dataReady) {
    const bars = computeBars({
      improvedTechFemaleCount,
      improvedTechMaleCount,
      totalBeneficiaries,
      femaleCount,
      maleCount,
      ...barD3Helpers
    });

    improvedTechBars = bars.improvedTechBars;

    const { xAxis, yAxis } = barD3Helpers;
    d3Select(improvedTechBarsXAxisContainerDom).call(xAxis);
    d3Select(improvedTechBarsYAxisContainerDom).call(yAxis);
  }
</script>

<div class="chart-container improved-tech-distribution">
  <svg width={BAR_SVG_WIDTH} height={BAR_SVG_HEIGHT}>
    <g transform={`translate(${BAR_MARGINS.left},${BAR_MARGINS.top})`}>

      {#each improvedTechBars as { bar, textProps: { attrs, text }, key } (key)}
        <rect {...bar} />
        <text text-anchor="middle" fill="white" {...attrs}>{text}</text>
      {/each}

      <g
        bind:this={improvedTechBarsXAxisContainerDom}
        class="x-axis-container"
        transform={`translate(0,${BAR_HEIGHT})`} />

      <g
        bind:this={improvedTechBarsYAxisContainerDom}
        class="y-axis-container" />

    </g>
  </svg>
</div>

<h3 class="title">
  Distribution of beneficiaries by
  <strong>improved technology</strong>
</h3>
