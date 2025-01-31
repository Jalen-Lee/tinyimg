import { Theme as RadixTheme } from "@radix-ui/themes";
import AppRoutes from "./routes";
import "./index.css";

function App() {
  return (
    <RadixTheme>
      <AppRoutes />
    </RadixTheme>
  );
}

export default App;
