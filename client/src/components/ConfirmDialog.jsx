import { HiOutlineExclamation } from 'react-icons/hi';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={`btn btn-${confirmVariant}`} onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> : null}
            {confirmText}
          </button>
        </>
      }
    >
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">
          <HiOutlineExclamation />
        </div>
        <h3>{title || 'Are you sure?'}</h3>
        <p>{message || 'This action cannot be undone.'}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
