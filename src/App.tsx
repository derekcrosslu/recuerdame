import "./App.css";
import Notes from "./components/notes";
import AddNoteToCal from "./components/testCal";

const App: React.FC = () => {
  return (
    <div className="App">
      <Notes />
      <AddNoteToCal />
    </div>
  );
};

export default App;
