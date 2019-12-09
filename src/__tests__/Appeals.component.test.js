import { render } from "@testing-library/svelte";
import Appeals from "../Appeals/appeals.svelte";

test("it renders component", () => {
  render(Appeals, {
    fetchDataFn: () => []
  });
});

// Note: This is as an async test as we are using `fireEvent`
// Using await when firing events is unique to the svelte testing library because
// we have to wait for the next `tick` so that Svelte flushes all pending state changes.
/**
test("changes button text on click", async () => {
  render(Comp, { name: "World" });
  const domButton = document.getElementById("button");

  await fireEvent.click(domButton);
  expect(domButton.textContent).toBe("Button Clicked");
});
*/
