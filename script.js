document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    const envMode = document.getElementById('env-mode');

    // Fetch the real live status from the Node.js backend API
    function fetchContainerData() {
        statusBadge.className = 'badge badge-loading';
        statusBadge.textContent = 'Fetching...';
        statusText.textContent = 'Querying live container layer...';

        fetch('/api/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update DOM with live server data
                statusBadge.className = 'badge badge-online';
                statusBadge.textContent = data.status;
                statusText.textContent = data.message;
                envMode.textContent = data.environment;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                statusBadge.className = 'badge';
                statusBadge.style.backgroundColor = '#e74c3c';
                statusBadge.style.color = '#fff';
                statusBadge.textContent = 'Offline';
                statusText.textContent = 'Failed to connect to the Node.js backend.';
            });
    }

    // Refresh data on button click
    refreshBtn.addEventListener('click', fetchContainerData);

    // Initial load fetch
    fetchContainerData();
});