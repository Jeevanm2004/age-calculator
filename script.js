// Initialize Flatpickr datepicker
const picker = flatpickr("#birthdate", {
    dateFormat: "d/m/Y",
    maxDate: "today",
    allowInput: true,
    disableMobile: true,
    onChange: function() {
        // Clear error message when date is selected
        document.getElementById('errorMessage').textContent = '';
    }
});

// Get form elements
const form = document.getElementById('ageForm');
const birthdateInput = document.getElementById('birthdate');
const errorMessage = document.getElementById('errorMessage');
const resultDiv = document.getElementById('result');
const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');
const totalDaysSpan = document.getElementById('totalDays');

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous error
    errorMessage.textContent = '';
    
    // Get the input value
    const birthdateValue = birthdateInput.value.trim();
    
    // Validate input
    if (!birthdateValue) {
        errorMessage.textContent = 'Please select your birthdate';
        return;
    }
    
    // Parse the date using Luxon
    const birthdate = luxon.DateTime.fromFormat(birthdateValue, 'd/M/yyyy');
    
    // Validate if the date is valid
    if (!birthdate.isValid) {
        errorMessage.textContent = 'Please enter a valid date';
        return;
    }
    
    // Check if birthdate is in the future
    const today = luxon.DateTime.now();
    if (birthdate > today) {
        errorMessage.textContent = 'Birthdate cannot be in the future';
        return;
    }
    
    // Calculate age
    calculateAge(birthdate, today);
});

function calculateAge(birthdate, today) {
    // Calculate the difference
    const diff = today.diff(birthdate, ['years', 'months', 'days']).toObject();
    
    // Get the values
    const years = Math.floor(diff.years);
    const months = Math.floor(diff.months);
    const days = Math.floor(diff.days);
    
    // Calculate total days lived
    const totalDays = Math.floor(today.diff(birthdate, 'days').days);
    
    // Display the results with animation
    displayResults(years, months, days, totalDays);
}

function displayResults(years, months, days, totalDays) {
    // Show the result div
    resultDiv.classList.remove('hidden');
    
    // Animate the numbers
    animateValue(yearsSpan, 0, years, 800);
    animateValue(monthsSpan, 0, months, 800);
    animateValue(daysSpan, 0, days, 800);
    animateValue(totalDaysSpan, 0, totalDays, 1000);
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = progress => 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(start + (end - start) * easeOutQuad(progress));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(update);
}
