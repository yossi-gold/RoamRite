

 export function getCategoryColor(category) {
        switch (category) {
            case 'Food':
                // Added a new bgColor property
                return { ringColor: '#F59E0B', text: 'text-yellow-600', totalText: 'text-yellow-800', bgColor: 'bg-yellow-50' };
            case 'Lodging':
                // Added a new bgColor property
                return { ringColor: '#3B82F6', text: 'text-blue-600', totalText: 'text-blue-800', bgColor: 'bg-blue-50' };
            case 'Transportation':
                // Added a new bgColor property
                return { ringColor: '#8B5CF6', text: 'text-purple-600', totalText: 'text-purple-800', bgColor: 'bg-purple-50' };
            case 'Entertainment':
                // Added a new bgColor property
                return { ringColor: '#10B981', text: 'text-green-600', totalText: 'text-green-800', bgColor: 'bg-green-50' };
            case 'Shopping':
                // Added a new bgColor property
                return { ringColor: '#EF4444', text: 'text-red-600', totalText: 'text-red-800', bgColor: 'bg-red-50' };
            case 'Other':
            default:
                // Added a new bgColor property
                return { ringColor: '#6B7280', text: 'text-gray-600', totalText: 'text-gray-800', bgColor: 'bg-gray-50' };
        }
    }