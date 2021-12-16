import React, { useState } from 'react';

// components
import DeleteCardModal from '../../components/DeleteCardModal';
import { getIssuerType } from '../../utils/getIssuerType';
import Spinner from '../Spinner';

const RememberCard = ({ cards, handleSelectCard }) => {
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);

  return (
    <>
      <div className="remembercard-collections">
        {cards.map((card) => (
          <div className="remembercard" type="button" key={card.token}>
            <button type="button" onClick={() => setShowDeleteCardModal(true)}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.00008 7.41417L1.70718 11.7071L0.292969 10.2928L4.58586 5.99995L0.292969 1.70706L1.70718 0.292847L6.00008 4.58574L10.293 0.292847L11.7072 1.70706L7.41429 5.99995L11.7072 10.2928L10.293 11.7071L6.00008 7.41417Z"
                  fill="#91979F"
                />
              </svg>
            </button>
            <button className="card-pill" type="button" onClick={() => handleSelectCard(card)}>
              {card.last_4}
            </button>
            <img src={getIssuerType(card.type)} alt={`${card.type} Card`} />
          </div>
        ))}
      </div>
      {showDeleteCardModal && (
        <DeleteCardModal setShowDeleteCardModal={setShowDeleteCardModal} />
      )}
    </>
  );
};

export default RememberCard;
