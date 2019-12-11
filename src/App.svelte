<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
  import ImprovedTech from "./Appeals/improved-tech.svelte";
  import GenderDistribution from "./Appeals/gender-distribution.svelte";
</script>

<main>
  <Appeals let:dataDistributions let:d3Helpers fetchDataFn={getCSVData}>
    <div slot="genderDistribution">
      <GenderDistribution {dataDistributions} {d3Helpers} />
    </div>

    <div slot="improvedTech">
      <ImprovedTech {dataDistributions} />
    </div>

  </Appeals>
</main>
