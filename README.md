# My Charts - HTML Chart Viewer

A simple, elegant web application for uploading and viewing HTML files containing charts and data analysis visualizations.

## Features

- **Drag & Drop Interface**: Easy file upload with intuitive drag-and-drop functionality
- **File Management**: Upload, view, and delete HTML chart files
- **Secure Viewing**: Charts are displayed in sandboxed iframes for security
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Success/error notifications for all operations
- **Keyboard Shortcuts**: Escape to close viewer, Ctrl/Cmd+O to open files

## Getting Started

1. Open `index.html` in your web browser or serve it via HTTP server
2. Upload HTML files by:
   - Dragging and dropping files onto the upload area
   - Clicking "Browse Files" to select files
3. View uploaded charts by clicking the "View" button
4. Delete files using the "Delete" button (with confirmation)

## File Requirements

- Only HTML files (.html, .htm) are supported
- Files can contain any HTML content including:
  - Chart.js visualizations
  - D3.js charts
  - Custom HTML/CSS/JavaScript charts
  - Data analysis dashboards

## Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **File Storage**: Client-side only (files stored in browser memory)
- **Security**: Sandboxed iframes prevent malicious script execution
- **Compatibility**: Works in all modern browsers

## Example Usage

1. Create an HTML file with your chart visualization
2. Upload it using the web interface
3. Click "View" to display the chart in the viewer
4. Charts are displayed in a secure, isolated environment

## Sample Chart

The repository includes `sample-chart.html` which demonstrates a Chart.js-based sales data visualization with:
- Line chart showing revenue and orders over time
- Statistical cards displaying key metrics
- Responsive design and interactive features

## Development

To run locally:
```bash
# Simple HTTP server (Python)
python3 -m http.server 8000

# Or use any other HTTP server
# Then open http://localhost:8000
```

## License

This project is open source and available under the MIT License.
