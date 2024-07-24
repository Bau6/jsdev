import {BrowserRouter, Route, Routes} from "react-router-dom";
import {memo} from 'react';
import TablePage from "./table/table";
import TasksPage from "./tasks/tasks";
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
const AppContent = memo(() => {
    return (
        <div>
            <Routes>
                <Route path={'/'} element={<TablePage />}/>
                <Route path={'/tasks'} element={<TasksPage />}/>
            </Routes>
        </div>
    );
});
export default App;
