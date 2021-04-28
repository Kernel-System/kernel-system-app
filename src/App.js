import './App.css';
import Layout from './pages/Layout/index';
//import Table from "./components/table/GenericTable";
import List from './components/list/GenericList';

function App() {
  return (
    <div className="App">
      <Layout>
        <List />
      </Layout>
    </div>
  );
}

export default App;
