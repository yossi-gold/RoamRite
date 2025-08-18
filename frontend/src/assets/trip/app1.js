// app.js - Frontend logic to interact with the Express backend
// Note: You must have the backend server (server.js) running for this to work.

// --- Variables and DOM Elements ---
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalBudgetEl = document.getElementById('total-budget');
const totalSpentEl = document.getElementById('total-spent');
const remainingBalanceEl = document.getElementById('remaining-balance');
const clearExpensesBtn = document.getElementById('clear-expenses');
const budgetBar = document.getElementById('budget-bar');
const submitBtn = document.getElementById('submit-btn');
const formButtons = document.getElementById('form-buttons');
const editBudgetBtn = document.getElementById('edit-budget-btn');
const budgetModal = document.getElementById('budget-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const initialBudgetInput = document.getElementById('initial-budget-input');

let expenses = [];
let initialBudget = 0;
let isEditing = false;
let editingExpenseId = null;


// To this line (using your actual URL)
const API_URL = 'https://trip-production-fa70.up.railway.app/api';

console.log(`${API_URL}/budget`);
// --- Functions ---

/**
 * Fetches the budget and expenses from the backend and updates the UI.
 */
async function fetchAndRenderData() {
    try {
        // Fetch budget
        const budgetResponse = await fetch(`${API_URL}/budget`);
        const budgetData = await budgetResponse.json();
        console.log(budgetData);
        initialBudget = parseFloat(budgetData.amount);
        initialBudgetInput.value = initialBudget;

        // Fetch expenses
        const expensesResponse = await fetch(`${API_URL}/expenses`);
        expenses = await expensesResponse.json();
        
        renderApp();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

/**
 * Updates the UI with the latest budget and expense data.
 */
function renderApp() {
    // Clear existing list items
    expenseList.innerHTML = '';
    
    let totalSpent = 0;

    // Loop through the expenses array to create and append list items
    expenses.forEach((expense) => {
        const listItem = document.createElement('li');
        listItem.className = 'expense-item bg-gray-50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md';
        
        totalSpent += parseFloat(expense.amount);

        listItem.innerHTML = `
            <div class="flex-1">
                <p class="text-lg font-medium text-gray-800">${expense.description}</p>
                <p class="text-gray-500 text-sm">Category: ${expense.category}</p>
            </div>
            <div class="flex items-center space-x-4">
                <p class="text-xl font-bold text-orange-600">$${parseFloat(expense.amount).toFixed(2)}</p>
                <button class="edit-btn text-gray-400 hover:text-teal-500 transition-all" data-id="${expense.id}">
                    <i class="fa-solid fa-pen-to-square text-xl"></i>
                </button>
                <button class="delete-btn text-gray-400 hover:text-red-500 transition-all" data-id="${expense.id}">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(listItem);
    });
    
    const remainingBalance = initialBudget - totalSpent;
    totalBudgetEl.textContent = `$${initialBudget.toFixed(2)}`;
    totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
    remainingBalanceEl.textContent = `$${remainingBalance.toFixed(2)}`;
    
    if (remainingBalance < 0) {
        remainingBalanceEl.classList.remove('text-emerald-800');
        remainingBalanceEl.classList.add('text-red-800');
    } else {
        remainingBalanceEl.classList.remove('text-red-800');
        remainingBalanceEl.classList.add('text-emerald-800');
    }

    let percentage = (totalSpent / initialBudget) * 100;
    if (percentage > 100) {
        percentage = 100;
        budgetBar.classList.remove('bg-teal-500');
        budgetBar.classList.add('bg-red-500');
    } else {
        budgetBar.classList.remove('bg-red-500');
        budgetBar.classList.add('bg-teal-500');
    }
    budgetBar.style.width = `${percentage}%`;
}

/**
 * Resets the expense form and editing state.
 */
function resetForm() {
    expenseForm.reset();
    isEditing = false;
    editingExpenseId = null;
    submitBtn.textContent = 'Add Expense';
    
    const cancelButton = document.getElementById('cancel-btn');
    if (cancelButton) {
        cancelButton.remove();
    }
}

// --- Event Listeners ---

editBudgetBtn.addEventListener('click', () => {
    budgetModal.classList.add('visible');
});

closeModalBtn.addEventListener('click', () => {
    budgetModal.classList.remove('visible');
});

initialBudgetInput.addEventListener('input', async (e) => {
    const newBudget = parseFloat(e.target.value) || 0;
    try {
        await fetch(`${API_URL}/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newBudget })
        });
        fetchAndRenderData();
    } catch (error) {
        console.error("Error updating budget:", error);
    }
});





expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const expenseData = { description, amount, category };

    if (isEditing && editingExpenseId) {
        try {
            await fetch(`${API_URL}/expenses/${editingExpenseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData)
            });
            resetForm();
            fetchAndRenderData();
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    } else {
        try {
            await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData)
            });
            resetForm();
            fetchAndRenderData();
        } catch (error) {
            console.error("Error adding new expense:", error);
        }
    }
});

expenseList.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');
    
    if (deleteBtn) {
        const expenseId = deleteBtn.getAttribute('data-id');
        try {
            await fetch(`${API_URL}/expenses/${expenseId}`, { method: 'DELETE' });
            fetchAndRenderData();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    } else if (editBtn) {
        const expenseId = editBtn.getAttribute('data-id');
        const expenseToEdit = expenses.find(exp => String(exp.id) === String(expenseId));
        
        if (expenseToEdit) {
            document.getElementById('description').value = expenseToEdit.description;
            document.getElementById('amount').value = parseFloat(expenseToEdit.amount);
            document.getElementById('category').value = expenseToEdit.category;
            
            isEditing = true;
            editingExpenseId = expenseId;
            submitBtn.textContent = 'Update Expense';
            
            if (!document.getElementById('cancel-btn')) {
                const cancelButton = document.createElement('button');
                cancelButton.id = 'cancel-btn';
                cancelButton.type = 'button';
                cancelButton.textContent = 'Cancel';
                cancelButton.className = 'fancy-button flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
                formButtons.appendChild(cancelButton);
                
                cancelButton.addEventListener('click', resetForm);
            }
        }
    }
});

clearExpensesBtn.addEventListener('click', async () => {
    try {
        await fetch(`${API_URL}/expenses`, { method: 'DELETE' });
        fetchAndRenderData();
    } catch (error) {
        console.error("Error clearing expenses:", error);
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchAndRenderData);
