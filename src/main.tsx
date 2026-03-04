import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { seedBuses } from "./components/seedBuses";

// Run seeding once before app renders
// const startApp = async () => {
//   await seedBuses();

//   createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// };
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// startApp();
