import AppRoutes from "./routes/AppRoutes";
import AudioPlayer from "./components/player/AudioPlayer";

function App() {
  return (
    <>
      <AudioPlayer />
      <AppRoutes />
    </>
  );
}

export default App;