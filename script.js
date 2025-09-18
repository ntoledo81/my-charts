// File storage and management
let uploadedFiles = [];

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileItems = document.getElementById('fileItems');
const viewerSection = document.getElementById('viewerSection');
const chartViewer = document.getElementById('chartViewer');
const currentFileName = document.getElementById('currentFileName');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateFileList();
});

function setupEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragenter', handleDragEnter);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
    // Clear the input so the same file can be selected again
    e.target.value = '';
}

function processFiles(files) {
    const htmlFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        const isHtmlType = file.type === 'text/html' || file.type === '';
        const hasHtmlExtension = fileName.endsWith('.html') || fileName.endsWith('.htm');
        return isHtmlType && hasHtmlExtension;
    });
    
    if (htmlFiles.length === 0) {
        showNotification('Please select only HTML files (.html, .htm)', 'error');
        return;
    }
    
    htmlFiles.forEach(file => {
        if (uploadedFiles.find(f => f.name === file.name)) {
            showNotification(`File "${file.name}" already exists`, 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = {
                name: file.name,
                size: file.size,
                content: e.target.result,
                uploadTime: new Date().toLocaleString(),
                id: Date.now() + Math.random()
            };
            
            uploadedFiles.push(fileData);
            updateFileList();
            showNotification(`File "${file.name}" uploaded successfully`, 'success');
        };
        
        reader.onerror = function() {
            showNotification(`Error reading file "${file.name}"`, 'error');
        };
        
        reader.readAsText(file);
    });
}

function updateFileList() {
    if (uploadedFiles.length === 0) {
        fileItems.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <p>No files uploaded yet. Drop HTML files above to get started.</p>
            </div>
        `;
        return;
    }
    
    fileItems.innerHTML = uploadedFiles.map(file => `
        <div class="file-item" data-file-id="${file.id}">
            <div class="file-info">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${formatFileSize(file.size)} • Uploaded ${file.uploadTime}</p>
                </div>
            </div>
            <div class="file-actions">
                <button class="view-btn" onclick="viewFile('${file.id}')">View</button>
                <button class="delete-btn" onclick="deleteFile('${file.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewFile(fileId) {
    const file = uploadedFiles.find(f => f.id == fileId);
    if (!file) {
        showNotification('File not found', 'error');
        return;
    }
    
    // Create a blob URL for the HTML content
    const blob = new Blob([file.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Update viewer
    currentFileName.textContent = file.name;
    chartViewer.src = url;
    viewerSection.style.display = 'block';
    
    // Scroll to viewer
    viewerSection.scrollIntoView({ behavior: 'smooth' });
    
    // Clean up the blob URL after a delay to ensure it's loaded
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function deleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
        updateFileList();
        
        // Close viewer if the deleted file was being viewed
        const currentFile = uploadedFiles.find(f => f.name === currentFileName.textContent);
        if (!currentFile) {
            closeViewer();
        }
        
        showNotification('File deleted successfully', 'success');
    }
}

function closeViewer() {
    viewerSection.style.display = 'none';
    chartViewer.src = '';
    currentFileName.textContent = 'Chart Viewer';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 15px;
                min-width: 300px;
                animation: slideIn 0.3s ease;
            }
            
            .notification-success { background: #28a745; }
            .notification-error { background: #dc3545; }
            .notification-warning { background: #ffc107; color: #212529; }
            .notification-info { background: #17a2b8; }
            
            .notification button {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close viewer
    if (e.key === 'Escape' && viewerSection.style.display !== 'none') {
        closeViewer();
    }
    
    // Ctrl/Cmd + O to open file dialog
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        fileInput.click();
    }
});

// Prevent default drag behavior on the page
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, function(e) {
        // Only prevent default if not in upload area
        if (!uploadArea.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});