import React from 'react';

const Header = () => {
  return (
    <header>
      <div id="title-container">
        <h1 id="site-title">
          <a href="#" id="site-title-link">Backyard Thoughts</a>
        </h1>
        <div id="button-container">
          <button className="header-button" onClick={() => window.open('https://github.com/anvi-git', '_blank')}>
            <img src="svg_images/github-icon.png" alt="GitHub Icon" className="png-icon" />
          </button>
          <button className="header-button" onClick={() => window.open('https://www.linkedin.com/in/antonio-viscusi/', '_blank')}>
            <img src="svg_images/linkedin-app-icon.png" alt="LinkedIn Icon" className="png-icon" />
          </button>
          <button className="header-button" onClick={() => window.open('https://linktr.ee/anvi_tree', '_blank')}>
            <img src="svg_images/linktree-logo-icon.png" alt="Linktree Icon" className="png-icon" />
          </button>
          <button className="header-button" onClick={() => window.open('https://spaceofsound.substack.com', '_blank')}>
            <img src="svg_images/substack-icon.png" alt="Substack Icon" className="png-icon" />
          </button>
          <button className="header-button" onClick={() => window.open('https://lastscatteringsurface.substack.com', '_blank')}>
            <img src="svg_images/substack-icon.png" alt="Substack Icon" className="png-icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;