<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
  import ImprovedTechDistribution from "./Appeals/improved-tech-distribution.svelte";
  import GenderDistribution from "./Appeals/gender-distribution.svelte";
  import AgeDistribution from "./Appeals/age-distribution.svelte";
</script>

<main>
  <Appeals let:dataDistributions let:d3Helpers fetchDataFn={getCSVData}>
    <div slot="genderDistribution">
      <GenderDistribution {dataDistributions} {d3Helpers} />
    </div>

    <div slot="ageDistribution">
      <AgeDistribution {dataDistributions} {d3Helpers} />
    </div>

    <div slot="improvedTechDistribution">
      <ImprovedTechDistribution {dataDistributions} />
    </div>

  </Appeals>
</main>
