import React from 'react';
import PropTypes from 'prop-types';
// component
import WidgetFooter from '../WidgetFooter';

const DeleteCardModal = ({ setShowDeleteCardModal }) => {
  return (
    <div id="deleteCardModal" class="modal">
      <div className="modal-content">
        <div className="modal-content-child">
          <svg width="66" height="60" viewBox="0 0 66 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M63.4544 41.5302L43.0222 6.60143C40.9709 3.04537 37.1476 0.838222 33.0129 0.833382C28.8777 0.828542 25.0531 3.02658 22.9764 6.60157L2.53654 41.5431C0.417079 45.1068 0.36913 49.5724 2.42207 53.2144C4.47671 56.8593 8.32389 59.1277 12.5085 59.1617L53.4523 59.1619C57.6805 59.1208 61.5203 56.8594 63.5747 53.2177C65.6266 49.5803 65.5807 45.1246 63.4544 41.5302ZM7.56096 44.5066L28.0159 9.53935C29.0518 7.75619 30.9517 6.66431 33.0061 6.66671C35.0602 6.66912 36.9594 7.76551 37.9782 9.53152L58.4265 44.4879C59.4984 46.2998 59.5213 48.5305 58.494 50.3516C57.4652 52.1753 55.5419 53.308 53.4239 53.3287L12.5323 53.3285C10.4597 53.3115 8.53263 52.1753 7.50366 50.3499C6.47582 48.5265 6.49982 46.2909 7.56096 44.5066ZM33.0009 47.4952C34.6122 47.4952 35.9185 46.1894 35.9185 44.5786C35.9185 42.9677 34.6122 41.6619 33.0009 41.6619C31.3895 41.6619 30.0832 42.9677 30.0832 44.5786C30.0832 46.1894 31.3895 47.4952 33.0009 47.4952ZM35.927 18.3286H30.0918V38.7452H35.927V18.3286Z" fill="#E89806" />
          </svg>
          <h1>Delete Card</h1>
          <p>You are about to remove this card from your existing card list. This operation cannot be undone</p>
          <button type="button" className="remove-card">Remove Card</button>
        </div>
        <div className="modal-content-footer">
          <WidgetFooter verb="Dismiss" onClick={() => setShowDeleteCardModal(false)} />
        </div>
      </div>
    </div>
  );
}

export default DeleteCardModal;

DeleteCardModal.propTypes = {
  setShowDeleteCardModal: PropTypes.func.isRequired
};
