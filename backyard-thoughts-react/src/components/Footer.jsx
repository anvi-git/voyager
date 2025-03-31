import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Backyard Thoughts. All rights reserved.</p>
                <div className="footer-links">
                    <a href="https://github.com/anvi-git" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/antonio-viscusi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://linktr.ee/anvi_tree" target="_blank" rel="noopener noreferrer">Linktree</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;