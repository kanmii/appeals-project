<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
  import ImprovedTechDistribution from "./Appeals/improved-tech-distribution.svelte";
  import GenderDistribution from "./Appeals/gender-distribution.svelte";
  import AgeDistribution from "./Appeals/age-distribution.svelte";
  import CombinedDistributions from "./Appeals/combined-distributions.svelte";
</script>

<main>
  <Appeals let:dataDistributions fetchDataFn={getCSVData}>
    <div slot="combinedDistributions">
      <CombinedDistributions {dataDistributions} />
    </div>

    <div slot="genderDistribution">
      <GenderDistribution {dataDistributions} />
    </div>

    <div slot="ageDistribution">
      <AgeDistribution {dataDistributions} />
    </div>

    <div slot="improvedTechDistribution">
      <ImprovedTechDistribution {dataDistributions} />
    </div>

  </Appeals>
</main>
