import Guide from './components/guide'
import Workspace from './components/workspace'
import useAppStore from './store/app.store' 
import useSelector from './hooks/useSelector'

function App() {
	const {
    workspace:{
      hasFile
    }
  } = useAppStore(useSelector(['workspace']))

  return (
    <main id="tinyimg">
      {hasFile ? <Workspace/> : <Guide/>}
    </main>
  );
}

export default App;
