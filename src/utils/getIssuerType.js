
import MasterCard from '../assets/mastercardmd.svg';
import VisaCard from '../assets/visacard.svg';
import MaestroCard from '../assets/maestrocard.svg';
import UnknownCard from '../assets/unknowncard.svg';

export const getIssuerType = (issuer = '') => {
  issuer = issuer?.toLowerCase();
  if (issuer === 'mastercard') {
    return MasterCard;
  } else if (issuer === 'visa') {
    return VisaCard;
  } else if (issuer === 'maestro') {
    return MaestroCard;
  }
  return UnknownCard;
};
