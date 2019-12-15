<script type="text/typescript">
  import {
    COMBINED_BAR_CONTAINER_WIDTH,
    COMBINED_BAR_CONTAINER_HEIGHT,
    computeCombinedBars,
    combinedBarChartInitD3,
    combinedBarChartCustomLeftAxis
  } from "./appeals-utils";

  import { select as d3Select } from "d3-selection";

  const chartHelpers = combinedBarChartInitD3();
  const { bandWidth, margins } = chartHelpers;

  let bars = {
    bars: []
  };
  let leftAxisDomRef;
  let topAxisDomRef;

  export let dataDistributions = {};

  $: if (dataDistributions.dataReady) {
    bars = computeCombinedBars(dataDistributions, chartHelpers);

    const { xAxisTop, yAxisLeft } = chartHelpers;

    d3Select(topAxisDomRef).call(xAxisTop);

    d3Select(leftAxisDomRef).call(
      combinedBarChartCustomLeftAxis,
      yAxisLeft,
      bandWidth
    );
  }
</script>

<svg
  class="combined-charts"
  width="{COMBINED_BAR_CONTAINER_WIDTH}"
  height="{COMBINED_BAR_CONTAINER_HEIGHT}"
>
  <g
    bind:this="{leftAxisDomRef}"
    transform="translate({margins.left},{margins.top})"
  />

  <g
    bind:this="{topAxisDomRef}"
    transform="translate({margins.left},{margins.top})"
  />

  <g transform="translate({margins.left},{margins.top})">
    {#each bars.bars as { barProps } (barProps.y)}
    <rect height="{bandWidth}" x="0" {...barProps} fill="blue" />
    {/each}
  </g>
</svg>
