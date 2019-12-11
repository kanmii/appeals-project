<script>
  import Appeals from "./Appeals/appeals.svelte";
  import { getCSVData } from "./Appeals/appeals-injectables.js";
  import ImprovedTech from "./Appeals/improved-tech.svelte";
</script>

<main>
  <Appeals
    let:dataReady
    let:improvedTechFemaleCount
    let:improvedTechMaleCount
    let:maleCount
    let:femaleCount
    let:totalBeneficiaries
    let:barD3Helpers
    fetchDataFn={getCSVData}>
    <div slot="improvedTech">
      <ImprovedTech
        {dataReady}
        {maleCount}
        {femaleCount}
        {improvedTechFemaleCount}
        {improvedTechMaleCount}
        {totalBeneficiaries}
        {barD3Helpers} />
    </div>
  </Appeals>
</main>
