import { HiOutlinePlus } from 'react-icons/hi';

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction, showAction = false, customIllustration }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        {customIllustration ? (
          <div className="empty-state-custom-illustration" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-sm)' }}>
            {customIllustration}
          </div>
        ) : (
          <div className="empty-state-icon">
            {Icon && <Icon />}
          </div>
        )}
      </div>
      <h3>{title || 'Nothing here yet'}</h3>
      <p>{message || 'No items to display.'}</p>
      {showAction && actionLabel && (
        <button className="btn btn-primary" onClick={onAction}>
          <HiOutlinePlus />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
