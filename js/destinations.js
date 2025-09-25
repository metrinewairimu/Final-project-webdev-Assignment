// Destinations page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDestinationsPage();
});

function initializeDestinationsPage() {
    initializeSearch();
    initializeFilters();
    initializeDestinationCards();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        // Real-time search as user types
        searchInput.addEventListener('input', debounce(performSearch, 300));
        
        // Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Filter functionality
function initializeFilters() {
    const regionFilters = document.getElementById('regionFilters');
    const typeFilters = document.getElementById('typeFilters');

    if (regionFilters) {
        regionFilters.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                handleFilterClick(e.target, 'region');
            }
        });
    }

    if (typeFilters) {
        typeFilters.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                handleFilterClick(e.target, 'type');
            }
        });
    }
}

// Handle filter button clicks
function handleFilterClick(button, filterType) {
    const filterGroup = button.parentElement;
    const buttons = filterGroup.querySelectorAll('.filter-btn');
    
    // Remove active class from all buttons in this group
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Apply filters
    applyFilters();
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const destinationCards = document.querySelectorAll('.destination-card');
    let visibleCount = 0;

    destinationCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        const matches = name.includes(searchTerm) || 
                       title.includes(searchTerm) || 
                       description.includes(searchTerm);

        if (matches || searchTerm === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Apply other active filters after search
    if (searchTerm !== '') {
        applyFilters();
    }

    updateNoResultsMessage();
}

// Apply all active filters
function applyFilters() {
    const activeRegionFilter = document.querySelector('#regionFilters .filter-btn.active');
    const activeTypeFilter = document.querySelector('#typeFilters .filter-btn.active');
    
    const regionFilter = activeRegionFilter ? activeRegionFilter.getAttribute('data-filter') : 'all';
    const typeFilter = activeTypeFilter ? activeTypeFilter.getAttribute('data-filter') : 'all';
    
    const destinationCards = document.querySelectorAll('.destination-card');
    let visibleCount = 0;

    destinationCards.forEach(card => {
        const cardRegion = card.getAttribute('data-region');
        const cardType = card.getAttribute('data-type');
        
        const regionMatch = regionFilter === 'all' || cardRegion === regionFilter;
        const typeMatch = typeFilter === 'all' || cardType === typeFilter;
        
        // Check if card is currently visible due to search
        const currentlyVisible = card.style.display !== 'none';
        
        if (regionMatch && typeMatch && currentlyVisible) {
            card.style.display = 'block';
            visibleCount++;
        } else if (!regionMatch || !typeMatch) {
            card.style.display = 'none';
        }
    });

    updateNoResultsMessage();
    animateFilteredResults();
}

// Update no results message
function updateNoResultsMessage() {
    const noResults = document.getElementById('noResults');
    const visibleCards = document.querySelectorAll('.destination-card[style*="block"], .destination-card:not([style*="none"])');
    
    if (noResults) {
        if (visibleCards.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

// Animate filtered results
function animateFilteredResults() {
    const visibleCards = document.querySelectorAll('.destination-card[style*="block"], .destination-card:not([style*="none"])');
    
    visibleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Initialize destination cards with hover effects
function initializeDestinationCards() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        // Add loading effect for images
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Add error handling for images
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            });
        }

        // Add click tracking
        card.addEventListener('click', function(e) {
            const destinationName = this.querySelector('h3').textContent;
            trackDestinationClick(destinationName);
        });
    });
}

// Track destination clicks for analytics
function trackDestinationClick(destinationName) {
    // In a real implementation, this would send data to analytics
    console.log(`Kenya destination clicked: ${destinationName}`);
}

// Reset all filters
function resetFilters() {
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate "All" buttons
    document.querySelectorAll('.filter-btn[data-filter="all"]').forEach(btn => {
        btn.classList.add('active');
    });
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.style.display = 'block';
    });
    
    updateNoResultsMessage();
}

// Utility function for debouncing search
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Export functions for potential use by other scripts
window.destinationsPage = {
    resetFilters,
    performSearch,
    applyFilters
};