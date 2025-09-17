\# BrickWorks Studio Portfolio



A clean, fast, and responsive portfolio website for BrickWorks Studio, a two-person team focused on creating small Unity game prototypes. This site serves as a central hub for our projects, development logs, and media.





\## Features



\-   \*\*Fully Responsive:\*\* Designed to work seamlessly on desktops, tablets, and mobile devices.

\-   \*\*Themeable:\*\* Includes multiple color themes (Indigo, Teal, Slate) and a theme switcher.

\-   \*\*Accessible:\*\* Features a high-contrast mode and respects `prefers-reduced-motion` for a better user experience.

\-   \*\*Performance Optimized:\*\* Built with a focus on speed, utilizing techniques like critical CSS inlining and efficient asset loading.

\-   \*\*Consolidated Structure:\*\* A simplified and intuitive site structure with four main sections: Games, About, Media, and Devlog.



\## Tech Stack



This project was built from scratch using fundamental web technologies:



\-   \*\*HTML5:\*\* For semantic and accessible content structure.

\-   \*\*CSS3:\*\* For styling, using Custom Properties (variables) for easy theming.

\-   \*\*Vanilla JavaScript (ES6+):\*\* For all interactive features, including the theme switcher and mobile navigation.

\-   \*\*Hosting:\*\* Deployed on \*\*GitHub Pages\*\*.



\## Local Development



To run this project on your local machine:



1\.  \*\*Clone the repository:\*\*

&nbsp;   ```bash

&nbsp;   git clone \[https://github.com/pontusfalkman/test2.github.io.git](https://github.com/pontusfalkman/test2.github.io.git)

&nbsp;   ```



2\.  \*\*Navigate to the project directory:\*\*

&nbsp;   ```bash

&nbsp;   cd test2.github.io

&nbsp;   ```



3\.  \*\*Open `index.html`:\*\*

&nbsp;   You can open the `index.html` file directly in your web browser. For the best experience, it's recommended to use a lightweight local server. If you have Python installed, you can run:

&nbsp;   ```bash

&nbsp;   python -m http.server

&nbsp;   ```

&nbsp;   Then, navigate to `http://localhost:8000` in your browser.



\## File Structure



The repository is organized into a clean and logical structure:



/

├── index.html          # Homepage

├── about.html          # Combined About/Team/Skills page

├── media.html          # Combined Videos/Gallery page

├── contact.html        # Contact page

├── 404.html            # Custom 404 page

│

├── projects/

│   └── index.html      # Main "Games" page

│

├── devlog/

│   ├── index.html      # Devlog landing page

│   └── posts/          # Individual devlog posts

│

├── games/

│   ├── puzzle/         # Playable WebGL puzzle game

│   └── platformer/     # Playable WebGL platformer game

│

├── css/

│   └── style.css       # Main stylesheet

│

├── js/

│   └── main.js         # Main JavaScript file

│

└── images/             # All image assets



\## Credits



\-   \*\*Fonts:\*\* \[Inter](https://fonts.google.com/specimen/Inter) from Google Fonts.

\-   \*\*Built by:\*\* Pontus Falkman and Martin Havsbro.

