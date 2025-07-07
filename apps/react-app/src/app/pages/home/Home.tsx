import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <section className="intro">
        <p>Welcome to my frontend lab.</p>
        <p>
          This project explores interesting React patterns and component
          architectures
        </p>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Lion based locked selection demo</h3>
            <p>Implementing lion based locked selection control</p>
            <Link to="/locked-selection" className="feature-link">
              View Locked selection demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
