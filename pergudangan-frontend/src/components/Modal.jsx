const Modal = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;