document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    const envMode = document.getElementById('env-mode');

    // Simulated API call matching the Node.js backend structure
    function fetchContainerData() {
        statusBadge.className = 'badge badge-loading';
        statusBadge.textContent = 'Fetching...';
        statusText.textContent = 'Querying the virtualized cluster layer...';

        // Simulating network latency
        setTimeout(() => {
            // Mock data representing what the Docker container spits out
            const mockApiResponse = {
                message: "Hello from inside the Docker container!",
                status: "Running smoothly",
                environment: "development" 
            };

            // Update DOM with data
            statusBadge.className = 'badge badge-online';
            statusBadge.textContent = 'Online';
            statusText.textContent = mockApiResponse.message;
            envMode.textContent = mockApiResponse.environment;
            
        }, 800);
    }

    // Event Listener for the action button
    refreshBtn.addEventListener('click', fetchContainerData);

    // Initial load configuration
    fetchContainerData();
});