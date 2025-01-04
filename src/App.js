import { PipelineToolbar } from "../src/components/toolbar/toolbar";
import { PipelineUI } from "./screens/ui";
import { SubmitButton } from "./submit";

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
