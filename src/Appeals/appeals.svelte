<script>
  import { onMount } from "svelte";
  import { headerMapping } from "./appeals-injectables.js";
  import { computeDistributions } from "./appeals-utils";
  import { scaleLinear as d3ScaleLinear } from "d3-scale";
  import { arc as d3Arc } from "d3-shape";

  const d3Helpers = {
    arcGenerator: d3Arc(),
    linearColorScale: d3ScaleLinear().range([
      "#98abc5",
      "#8a89a6",
      "#7b6888",
      "#6b486b",
      "#a05d56"
    ])
  };

  let data = [];
  let dataDistributions = {
    maleCount: 0,
    femaleCount: 0,
    improvedTechMaleCount: 0,
    improvedTechFemaleCount: 0,
    youthCount: 0,
    adultCount: 0,
    childrenCount: 0,
    totalBeneficiaries: 0,
    dataReady: false
  };

  export let fetchDataFn;

  onMount(async () => {
    data = await fetchDataFn();

    if (!data.length) {
      return;
    }

    dataDistributions = computeDistributions(data);
  });
</script>

<style>
  .appeals :global(.title) {
    text-align: center;
  }

  .appeals :global(.chart-container) {
    display: flex;
  }

  @media (max-width: 899px) {
    .appeals :global(.chart-container) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .appeals :global(.data-summary-table) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .appeals :global(table) {
    border-collapse: collapse;
  }

  .appeals :global(td, th) {
    border: 1px solid #999;
    padding: 0.5rem;
  }

  .raw-data-table {
    max-height: 250px;
    overflow: auto;
    border-bottom: 1px solid #999;
    position: relative;
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

  <slot name="genderDistribution" {dataDistributions} {d3Helpers} />

  <slot name="ageDistribution" {dataDistributions} {d3Helpers} />

  <slot name="improvedTech" {dataDistributions} />
</div>
