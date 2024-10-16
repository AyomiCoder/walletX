import React from 'react';
import '../../App.css';

// Define the props interface
interface NotificationProps {
    message: string; // Type for message
    type: 'success' | 'error'; // Type for type; restricts to specific values
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;
