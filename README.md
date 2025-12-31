https://epidural.ibnouf.me

# Epidural Analgesia Information Webpage

A multilingual, responsive webpage providing comprehensive information about epidural analgesia for labour pain in both Arabic and English.

## Features

- **Bilingual Support**: Full Arabic (RTL) and English (LTR) support with toggle button
- **Responsive Design**: Works perfectly on all device sizes
- **Interactive Elements**: 
  - Card-based contraindications questionnaire with swiping functionality
  - Smooth animations and transitions
  - Yes/No selection options for contraindications
- **Professional Design**: Clean, medical-grade interface with warm, reassuring tone
- **No External Dependencies**: Only uses Font Awesome and Google Fonts CDN

## File Structure
epidural/
│
├── index.html          (Main file - loads Arabic content by default)
├── style.css           (All CSS styles)
├── script.js           (All JavaScript functionality)
├── ar.html             (Arabic content only)
├── en.html             (English content only)
└── README.md           (Project documentation)


## How It Works

1. **index.html** is the main file that loads:
   - CSS styles from `style.css`
   - JavaScript functionality from `script.js`
   - Initial Arabic content from `ar.html` (loaded via JavaScript fetch)

2. **Language Switching**:
   - Uses a floating circular button at bottom-right (Arabic) or bottom-left (English)
   - Saves user preference in localStorage
   - Dynamically loads content without page refresh

3. **Interactive Features**:
   - Contraindications cards with swiping navigation
   - Yes/No questionnaire for each contraindication
   - Progress indicators and navigation controls

## Setup Instructions

1. **Local Development**:
   ```bash
   # Just open index.html in your browser
   # All files should be in the same directory
