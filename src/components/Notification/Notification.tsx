import React from 'react';
import '../../App.css';

// Define the props interface
interface NotificationProps {
    message: string;
    type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;
