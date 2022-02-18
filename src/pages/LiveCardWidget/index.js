import React, { useState, useEffect } from "react";

import { useHistory, useParams, Link } from "react-router-dom";
import Payment from "payment";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { useQuery } from "react-query";

import {
	formatCreditCardNumber,
	formatCVC,
	formatExpirationDate,
} from "../../utils";

// components

// getRememberedCards;
import {
	getRememberedCards,
	payWithCard,
	payWithTokenizedCard,
	resolveFeesCard,
} from "../../services/card";

import FormError from "../../utils/form/FormError";

import { usePaymentContext } from "../../context/PaymentContext";
import { urls } from "../../utils/urls";

import { GET_REMEMBERED_CARDS } from "../../utils/constants/queryTypes";
import { getIssuerType } from "../../utils/getIssuerType";
import CardTestWidget from "../../pages/CardTestWidget";
import RememberCard from "../../components/CardPaymentWidget/RememberCard";
import ActionButton from "../../components/Button/ActionButton";
import SelectCheckmark from "../../components/SelectCheckmark";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import LiveCardForm from "./LiveCardForm";
import ExistingCard from "./ExistingCard";
import CardPin from "./CardPin";
import LocationDetails from "./LocationDetails";
// import { formatCreditCardNumber } from "../../utils";

const LiveCardWidget = ({ paymentDetail }) => {
	const [selectedCard, setSelectedCard] = useState(null);

	const [showPin, setShowPin] = useState(false);
	const [showLocationDetails, setShowLocationDetails] = useState(false);

	const history = useHistory();
	const { accessCode } = useParams();
	const paymentContext = usePaymentContext();

	const shouldResolveFees = paymentDetail.bearer !== "account";

	const { data, isLoading } = useQuery(
		[
			GET_REMEMBERED_CARDS,
			paymentDetail.customer?.email,
			paymentDetail.business?.id,
		],
		() =>
			getRememberedCards(
				paymentDetail.customer?.email,
				paymentDetail.business?.id
			)
	);

	let rememberedCards = [];
	if (data?.data) {
		rememberedCards = data.data?.data;
	}

	const resolvedFeesForSelectedCard = useFetchWithParams(
		["resolveFeesCard2", { bin: selectedCard?.first_6, accessCode }],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
			},
			onError: (error) => {
				console.log(error);
			},
			enabled: selectedCard?.first_6 && shouldResolveFees ? true : false,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		}
	);

	return (
		<>
			{selectedCard && !showPin && !showLocationDetails && (
				<ExistingCard
					paymentDetail={paymentDetail}
					selectedCard={selectedCard}
					setSelectedCard={setSelectedCard}
					accessCode={accessCode}
				/>
			)}

			{showPin && !showLocationDetails && <CardPin accessCode={accessCode} />}

			{!selectedCard && !showPin && !showLocationDetails && (
				<LiveCardForm
					setShowLocationDetails={setShowLocationDetails}
					setShowPin={setShowPin}
					paymentDetail={paymentDetail}
					rememberedCards={rememberedCards}
					isLoading={isLoading}
					setSelectedCard={setSelectedCard}
				/>
			)}
			{showLocationDetails && !showPin && (
				<LocationDetails accessCode={accessCode} />
			)}
		</>
	);
};

export default LiveCardWidget;
