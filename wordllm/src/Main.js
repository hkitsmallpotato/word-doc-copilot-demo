import { Routes, Route } from 'react-router-dom';
import { App } from './pages/App';
import { FileListing } from './pages/FileListing';

export function Main() {
    return (
        <div className="Main">
            <Routes>
                <Route path='/' element={ <FileListing/> } />
                <Route path='/app' element={ <App/> } />
            </Routes>
        </div>
    )
}