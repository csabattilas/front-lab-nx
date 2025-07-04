import '../styles.css';

import { Route, Routes, Link } from 'react-router-dom';
import CustomLionDemo from './pages/custom-lion/custom-lion-demo.tsx';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/custom-lion">Custom Lion</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
        <Route path="/custom-lion" element={<CustomLionDemo />} />
      </Routes>
    </div>
  );
}

export default App;
