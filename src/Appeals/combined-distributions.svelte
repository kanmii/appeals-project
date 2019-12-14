<script>
  import {
    COMBINED_BAR_CONTAINER_WIDTH,
    COMBINED_BAR_CONTAINER_HEIGHT,
    BAR_MARGINS,
    computeCombinedBars,
    getCombinedChartHelpers
  } from "./appeals-utils";

  import { select as d3Select } from "d3-selection";

  const chartHelpers = getCombinedChartHelpers();

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
    d3Select(leftAxisDomRef).call(yAxisLeft);
  }
</script>

<svg
  width={COMBINED_BAR_CONTAINER_WIDTH}
  height={COMBINED_BAR_CONTAINER_HEIGHT}>

  <g
    bind:this={leftAxisDomRef}
    transform="translate({BAR_MARGINS.left},{BAR_MARGINS.top})" />

  <g
    bind:this={topAxisDomRef}
    transform="translate({BAR_MARGINS.left},{BAR_MARGINS.top})" />

  <g transform="translate({BAR_MARGINS.left},{BAR_MARGINS.top})">
    {#each bars.bars as { barProps } (barProps.y)}
      <rect {...barProps} fill="blue" />
    {/each}
  </g>

  {#if dataDistributions.dataReady}
    <g
      transform="translate({BAR_MARGINS.left + 10},{BAR_MARGINS.top})"
      id="dodo"
      font-size="10">

      {#each bars.bars as { labelProps: { x, y, textSpanProps } } (y)}
        <text x="20" {y} text-anchorx="middle">
          {#each textSpanProps as s, index}
            <tspan x="20" dy={s.dy}>{s.text}</tspan>
          {/each}
        </text>
      {/each}

    </g>
  {/if}

</svg>

<pre>{JSON.stringify(bars, null, 2)}</pre>
