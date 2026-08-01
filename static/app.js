// Initialize Video.js player
const player = videojs('iptv-player');

const channelListElement = document.getElementById('channel-list');
const currentTitleElement = document.getElementById('current-title');

// Fetch channels from the FastAPI backend endpoint
async function loadChannels() {
    try {
        const response = await fetch('/api/channels');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const channels = await response.ok ? await response.json() : [];
        renderChannels(channels);
    } catch (error) {
        console.error("Failed to load channels:", error);
        channelListElement.innerHTML = `<li class="loading-text" style="color: #ff4d4d;">Error loading channels. Check console.</li>`;
    }
}

// Function to render channels in the sidebar
function renderChannels(channels) {
    channelListElement.innerHTML = ''; // Clear the "Loading channels..." text
    
    if (channels.length === 0) {
        channelListElement.innerHTML = '<li class="loading-text">No channels found.</li>';
        return;
    }

    channels.forEach((channel) => {
        const li = document.createElement('li');
        li.textContent = channel.name;
        
        li.addEventListener('click', () => {
            // Remove active class from all, add to clicked
            document.querySelectorAll('#channel-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            
            // Update Title
            currentTitleElement.textContent = `Playing: ${channel.name}`;
            
            // Load the stream into the player
            player.src({
                src: channel.url,
                type: 'application/x-mpegURL' // HLS stream type
            });
            
            // Start playing immediately with sound
            player.play().catch(error => {
                console.log("Autoplay was prevented by the browser:", error);
            });
        });
        
        channelListElement.appendChild(li);
    });
}

// Initialize the list on page load
document.addEventListener('DOMContentLoaded', loadChannels);