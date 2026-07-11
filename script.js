document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    const envMode = document.getElementById('env-mode');

    function fetchContainerData() {
        statusBadge.className = 'badge badge-loading';
        statusBadge.textContent = 'Fetching...';
        statusText.textContent = 'Querying live container layer...';

        // Fetching from relative path so it hits the Node.js server container directly
        fetch('/api/status')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                statusBadge.className = 'badge badge-online';
                statusBadge.style.backgroundColor = '#d4edda'; // green light
                statusBadge.style.color = '#155724';
                statusBadge.textContent = data.status;
                statusText.textContent = data.message;
                envMode.textContent = data.environment;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                statusBadge.className = 'badge';
                statusBadge.style.backgroundColor = '#e74c3c'; // red light
                statusBadge.style.color = '#fff';
                statusBadge.textContent = 'Offline';
                statusText.textContent = 'Failed to connect to the Node.js backend.';
            });
    }

    refreshBtn.addEventListener('click', fetchContainerData);
    fetchContainerData();
});