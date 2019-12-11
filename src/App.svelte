<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
  import ImprovedTech from "./Appeals/improved-tech.svelte";
</script>

<main>
  <Appeals let:dataDistributions fetchDataFn={getCSVData}>
    <div slot="improvedTech">
      <ImprovedTech {dataDistributions} />
    </div>
  </Appeals>
</main>
