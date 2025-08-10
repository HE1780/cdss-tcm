document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/medications';
    const plansList = document.getElementById('plans-list');
    const medForm = document.getElementById('med-form');
    const formMessage = document.getElementById('form-message');
    const typeSelect = document.getElementById('type');
    const ingredientsGroup = document.getElementById('ingredients-group');

    // --- 1. Fetch and Display Medication Plans ---
    const fetchMedicationPlans = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const plans = await response.json();

            plansList.innerHTML = ''; // Clear existing list
            if (plans.length === 0) {
                plansList.innerHTML = '<p>No medication plans found.</p>';
                return;
            }

            plans.forEach(plan => {
                const planElement = document.createElement('div');
                planElement.className = 'plan';
                planElement.innerHTML = `
                    <p><strong>Patient:</strong> ${plan.patient ? plan.patient.name : 'N/A'}</p>
                    <p class="med-name"><strong>Medication:</strong> ${plan.medication.name} (${plan.medication.dosage})</p>
                    <p><strong>Type:</strong> ${plan.medication.type}</p>
                    ${plan.medication.type === 'tcm' ? `<p><strong>Ingredients:</strong> ${plan.medication.ingredients.join(', ')}</p>` : ''}
                    <p><strong>Schedule:</strong> ${plan.schedule}</p>
                `;
                plansList.appendChild(planElement);
            });
        } catch (error) {
            plansList.innerHTML = '<p style="color: red;">Failed to load medication plans.</p>';
            console.error('Fetch error:', error);
        }
    };

    // --- 2. Handle Form Submission for Adding a New Plan ---
    medForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(medForm);
        const data = {
            patientId: formData.get('patientId'),
            medicationName: formData.get('medicationName'),
            dosage: formData.get('dosage'),
            type: formData.get('type'),
            schedule: formData.get('schedule'),
            ingredients: formData.get('ingredients') ? formData.get('ingredients').split(',').map(i => i.trim()) : []
        };

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            formMessage.className = ''; // Reset classes
            if (response.ok) {
                formMessage.textContent = result.message;
                formMessage.classList.add('message-success');
                medForm.reset();
                fetchMedicationPlans(); // Refresh the list
            } else if (response.status === 409) { // Conflict - Interaction detected
                formMessage.textContent = `Warning: ${result.error}`;
                formMessage.classList.add('message-error');
            }
            else {
                throw new Error(result.message || 'An unknown error occurred.');
            }
        } catch (error) {
            formMessage.textContent = `Error: ${error.message}`;
            formMessage.classList.add('message-error');
            console.error('Submit error:', error);
        }
    });

    // --- 3. Show/Hide Ingredients field based on Type ---
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'tcm') {
            ingredientsGroup.style.display = 'block';
        } else {
            ingredientsGroup.style.display = 'none';
        }
    });

    // --- Initial Load ---
    fetchMedicationPlans();
});
