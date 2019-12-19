<script type="text/typescript">
  import { onMount } from "svelte";
  import {
    computeCombinedChartData,
    initCombinedChartD3,
    combinedBarChartCustomLeftAxis,
    ComputedDistribution,
    CombinedChartData
  } from "./appeals-utils";
  import { select as d3Select } from "d3-selection";

  const chartHelpers = initCombinedChartD3();
  const { bandWidth, margins, dimensions } = chartHelpers;
  let bars = {
    bars: []
  } as CombinedChartData;

  let leftAxisDomRef = (null as unknown) as SVGSVGElement;
  let topAxisDomRef = (null as unknown) as SVGSVGElement;

  export let dataDistributions = {} as ComputedDistribution;

  interface StateMachine {
    renderingAxis: { value: "rendered" } | { value: "notRendered" };
  }

  let stateMachine: StateMachine = {
    renderingAxis: { value: "notRendered" }
  };

  onMount(() => {
    renderAxis();
  });

  $: if (dataDistributions.dataReady) {
    bars = computeCombinedChartData(dataDistributions, chartHelpers);
    renderAxis();
  }

  function renderAxis() {
    if (
      !dataDistributions.dataReady ||
      !leftAxisDomRef ||
      !topAxisDomRef ||
      stateMachine.renderingAxis.value === "rendered"
    ) {
      return;
    }

    const { xAxisTop, yAxisLeft } = chartHelpers;

    d3Select(topAxisDomRef).call(xAxisTop);
    combinedBarChartCustomLeftAxis(leftAxisDomRef, yAxisLeft);

    stateMachine = { ...stateMachine, renderingAxis: { value: "rendered" } };
  }
</script>

<svg
  class="combined-charts"
  width={dimensions.svgWidth}
  height={dimensions.svgHeight}>
  <g
    bind:this={leftAxisDomRef}
    transform="translate({margins.left},{margins.top})" />

  <g
    bind:this={topAxisDomRef}
    transform="translate({margins.left},{margins.top})" />

  <g transform="translate({margins.left},{margins.top})">
      {#each bars.bars as { barProps } (barProps.y)}
        <rect height={bandWidth} x="0" {...barProps} fill="blue" />
      {/each}
  </g>
</svg>
