<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
</script>

<main>
  <Appeals fetchDataFn={getCSVData} />
</main>
