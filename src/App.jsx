import { PipelineToolbar } from "./screens/toolbar/PipeLineToolbar";
import { PipelineUI } from "./screens/ui/PipeLineUi";
import { SubmitButton } from "./components/submit/SubmitButton";

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
