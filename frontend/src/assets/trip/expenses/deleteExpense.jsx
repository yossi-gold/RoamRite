import styles from "./expenses.module.css";

export function DeleteExpense({setVisibleDeleteModal, visibleDeleteModal, setExpensesDemo, expensesDemo}) {

        const handleDeleteExpense = async (e, expenseId) => {
            e.preventDefault();
            console.log('Delete expense with ID:', expenseId);

            try {
                const response = await fetch(`https://trip-production-fa70.up.railway.app/api/expenses/${expenseId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    
                    setVisibleDeleteModal({state: false, id: null, name: ''});
                    setExpensesDemo(expensesDemo.filter(expense => expense.id !== expenseId));
                } else {
                    console.error('Error deleting expense:', response.statusText);
                }

            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        }

    return (

        <div  className={`${styles.deleteModalOverlay} ${styles.visible}`}>
                <form className="modal-content" >
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Are you sure you want to delete &apos;{visibleDeleteModal.name}&apos; ?</h3>
                   <p className="text-gray-600">This action cannot be undone.</p>
                    <hr className="my-4 border-gray-200" />
                    <div className="flex justify-end space-x-2">
                        <button className={`${styles.cancelDeleteButton}`} onClick={(e) => { e.preventDefault();setVisibleDeleteModal({state: false, id: null, name: ''})}}>
                            Cancel
                        </button>
                        <button className={`${styles.confirmDeleteButton}`} onClick={(e) => handleDeleteExpense(e,visibleDeleteModal.id)}>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        
    );
}
