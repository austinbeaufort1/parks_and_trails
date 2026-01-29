// src/globalStyles.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #1B3A2F; /* Dark forest green */
    color: #EEE;               /* Light text for contrast */
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Optional: override card backgrounds */
  div, section, main {
    background-color: #253B32; /* Slightly lighter than body */
    color: #EEE;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
`;
