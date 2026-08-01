document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            location.reload(); // Refresh the page
            console.log('Page refreshed!');
        });

        refreshButton.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Prevent the context menu
            console.log('Context menu disabled on Refresh button!');
        });
    } else {
        console.error('Element with ID "refreshButton" not found!');
    }
});