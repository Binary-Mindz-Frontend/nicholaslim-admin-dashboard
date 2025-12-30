/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CreditCard,
  Lock,
  Shield,
  User,
  Loader2,
} from "lucide-react";
import {
  useCreateSetupIntentMutation,
  useGetWalletCardsQuery,
} from "@/redux/features/payment/paymentApi";
import { useWalletPayMutation } from "@/redux/features/wallet/walletApi";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: (paymentMethodId: string) => void;
  orderId?: string | null;
  createdUserId?: string | null;
}

const StripeCheckoutModal = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess,
}: StripeCheckoutModalProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [createSetupIntent, { isLoading: isCreatingIntent }] =
    useCreateSetupIntentMutation();
  const [walletPay, { isLoading: isProcessingPayment }] =
    useWalletPayMutation();
  const { data: walletCards, isLoading: isCardsLoading } =
    useGetWalletCardsQuery();

  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<"new" | "saved">("saved");

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: "#1f2937",
        fontFamily: '"Inter", -apple-system, sans-serif',
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  useEffect(() => {
    if (isOpen) {
      fetchClientSecret();
      setShowSuccessModal(false);
      setPaymentMode("saved");
      setSelectedCardId(null);
    } else {
      setClientSecret("");
      setCardholderName("");
      setErrorMessage("");
      setShowSuccessModal(false);
      setSelectedCardId(null);
    }
  }, [isOpen]);

  const fetchClientSecret = async () => {
    try {
      const response = await createSetupIntent().unwrap();
      const secret =
        (response as any).clientSecret || response.data?.clientSecret;

      if (secret) {
        setClientSecret(secret);
      } else {
        setErrorMessage("Failed to initialize payment. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.data?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || "Failed to initialize payment"
      );
    }
  };

  const handlePaymentWithSavedCard = async () => {
    if (!selectedCardId) {
      setErrorMessage("Please select a card");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const selectedCard = walletCards?.find(
        (card: any) => card.id === selectedCardId
      );

      if (!selectedCard) {
        setErrorMessage("Selected card not found");
        setIsProcessing(false);
        return;
      }

      await walletPay({
        paymentMethodId: String(selectedCardId),
        amount: totalAmount,
        payType: "PAYMENT",
      }).unwrap();

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        onPaymentSuccess(selectedCard.stripeMethodId);
        onClose();
      }, 2000);
    } catch (paymentError: any) {
      const msg = paymentError?.data?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || "Payment processing failed"
      );
      setIsProcessing(false);
    }
  };

  const handlePaymentWithNewCard = async () => {
    setErrorMessage("");

    if (!stripe || !elements) {
      setErrorMessage("Payment system not ready. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement || !cardholderName) {
      setErrorMessage("Please fill in card details and cardholder name");
      return;
    }

    if (!clientSecret) {
      setErrorMessage("Payment session not initialized. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (stripeError) {
        setErrorMessage(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (setupIntent && setupIntent.status === "succeeded") {
        const stripePaymentMethodId = setupIntent.payment_method as string;

        try {
          await walletPay({
            paymentMethodId: stripePaymentMethodId,
            amount: totalAmount,
            payType: "PAYMENT",
          }).unwrap();

          setShowSuccessModal(true);
          setCardholderName("");
          elements.getElement(CardNumberElement)?.clear();
          elements.getElement(CardExpiryElement)?.clear();
          elements.getElement(CardCvcElement)?.clear();

          setTimeout(() => {
            setShowSuccessModal(false);
            onPaymentSuccess(stripePaymentMethodId);
            onClose();
          }, 2000);
        } catch (paymentError: any) {
          const msg = paymentError?.data?.message;
          setErrorMessage(
            Array.isArray(msg) ? msg[0] : msg || "Payment processing failed"
          );
          setIsProcessing(false);
        }
      } else {
        setErrorMessage(
          "Card verification was not successful. Please try again."
        );
        setIsProcessing(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || "An unexpected error occurred"
      );
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (paymentMode === "saved") {
      await handlePaymentWithSavedCard();
    } else {
      await handlePaymentWithNewCard();
    }
  };

  const handleClose = () => {
    if (!isProcessing && !showSuccessModal) {
      setErrorMessage("");
      setCardholderName("");
      setSelectedCardId(null);
      onClose();
    }
  };

  const getCardBrandImage = (brand: string) => {
    if (!brand) return null;
    const brandLower = brand.toLowerCase();

    const brandImages: Record<string, string> = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
      mastercard:
        "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      "american express":
        "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
      discover:
        "https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg",
      "diners club":
        "https://upload.wikimedia.org/wikipedia/commons/6/69/Diners_Club_Logo.svg",
      jcb: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
      unionpay:
        "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg",
    };

    return brandImages[brandLower] || null;
  };

  if (showSuccessModal) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-linear-to-br from-emerald-50 to-green-50 border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center px-6 py-10 space-y-5">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-75"></div>
              <div className="relative rounded-full bg-linear-to-br from-emerald-500 to-green-600 p-4 shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-emerald-800">
                Payment Successful!
              </h3>
              <p className="text-emerald-700 text-base">
                ${totalAmount.toFixed(2)} has been processed
              </p>
              <div className="pt-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-emerald-700 text-sm font-medium">
                    Confirming order...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-linear-to-b from-white to-gray-50 border border-gray-200 shadow-2xl">
        <div className="relative">
          <div className="bg-linear-to-r from-amber-500 to-yellow-400 px-5 py-4">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-white">
                  Secure Payment
                </DialogTitle>
                {/* <Lock className="w-5 h-5 text-white" /> */}
              </div>
              <DialogDescription className="text-white/95 text-base font-semibold">
                Total: <span className="text-xl">${totalAmount.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-5 space-y-5">
            {!clientSecret && isCreatingIntent ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-t-amber-400 border-r-amber-400 border-b-transparent border-l-transparent"></div>
                <div className="text-center space-y-1">
                  <p className="text-gray-700 font-medium text-sm">
                    Initializing secure payment
                  </p>
                  <p className="text-gray-500 text-xs">Please wait...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Payment Mode Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setPaymentMode("saved")}
                    disabled={!walletCards || walletCards.length === 0}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      paymentMode === "saved"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Saved Cards
                  </button>
                  <button
                    onClick={() => setPaymentMode("new")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      paymentMode === "new"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    New Card
                  </button>
                </div>

                {paymentMode === "saved" ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Select Payment Method
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Choose from your saved cards
                      </p>
                    </div>

                    {isCardsLoading ? (
                      <div className="text-center p-6 text-gray-500 text-sm">
                        Loading cards...
                      </div>
                    ) : walletCards && walletCards.length > 0 ? (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto">
                        {walletCards.map((card: any) => {
                          const brandImgUrl = getCardBrandImage(card.brand);
                          const isSelected = selectedCardId === card.id;

                          return (
                            <label
                              key={card.id}
                              className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-amber-400 bg-amber-50"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-7 flex items-center justify-center">
                                  {brandImgUrl ? (
                                    <img
                                      src={brandImgUrl}
                                      className="w-full h-full object-contain"
                                      alt={card.brand}
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>

                                <div>
                                  <p className="font-medium text-sm capitalize text-gray-900">
                                    {card.brand} •••• {card.last4}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Expires {card.exp_month}/{card.exp_year}
                                  </p>
                                </div>
                              </div>

                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={isSelected}
                                onChange={() => setSelectedCardId(card.id)}
                                className="w-4 h-4 accent-amber-500 cursor-pointer"
                              />
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-500 text-sm">
                        No saved cards found. Add a new card to continue.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Add New Card
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Your details are encrypted and secure
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 flex items-center">
                        <CreditCard className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                        Card Number
                      </label>
                      <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                        <CardNumberElement options={cardElementOptions} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                          <CardExpiryElement options={cardElementOptions} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">
                          CVC
                        </label>
                        <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                          <CardCvcElement options={cardElementOptions} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-700 flex items-center">
                        Cardholder Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cardholder name"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          disabled={isProcessing}
                          className="w-full pl-10 pr-4 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:opacity-50 transition-all outline-none"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700 text-xs font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-1.5 shrink-0" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handlePaymentConfirm}
                  disabled={
                    isProcessing ||
                    isProcessingPayment ||
                    (paymentMode === "saved" && !selectedCardId) ||
                    (paymentMode === "new" && (!stripe || !clientSecret))
                  }
                  className="w-full py-2.5 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-gray-900 font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing || isProcessingPayment ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay $${totalAmount.toFixed(2)}`
                  )}
                </Button>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-center text-gray-500 text-xs flex items-center justify-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Secured by Stripe. We never store your card details.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripeCheckoutModal;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import {
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
// } from "@stripe/react-stripe-js";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   CheckCircle,
//   CreditCard,
//   Lock,
//   Shield,
//   User,
//   Loader2,
// } from "lucide-react";
// import {
//   useCreateSetupIntentMutation,
//   useGetWalletCardsQuery,
// } from "@/redux/features/payment/paymentApi";
// import { useSaveCardMutation } from "@/redux/features/payment/paymentApi";
// import { useWalletPayMutation } from "@/redux/features/wallet/walletApi";

// interface StripeCheckoutModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   totalAmount: number;
//   onPaymentSuccess: (paymentMethodId: string) => void;
//   orderId?: string | null;
//   createdUserId?: string | null;
// }

// const StripeCheckoutModal = ({
//   isOpen,
//   onClose,
//   totalAmount,
//   onPaymentSuccess,
// }: StripeCheckoutModalProps) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [createSetupIntent, { isLoading: isCreatingIntent }] =
//     useCreateSetupIntentMutation();
//   const [saveCard, { isLoading: isSavingCard }] = useSaveCardMutation();
//   const [walletPay, { isLoading: isProcessingPayment }] =
//     useWalletPayMutation();
//   const { data: walletCards, isLoading: isCardsLoading } =
//     useGetWalletCardsQuery();

//   const [cardholderName, setCardholderName] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [clientSecret, setClientSecret] = useState("");
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
//   const [paymentMode, setPaymentMode] = useState<"new" | "saved">("saved");

//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: "15px",
//         color: "#1f2937",
//         fontFamily: '"Inter", -apple-system, sans-serif',
//         "::placeholder": {
//           color: "#9ca3af",
//         },
//       },
//       invalid: {
//         color: "#ef4444",
//         iconColor: "#ef4444",
//       },
//     },
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchClientSecret();
//       setShowSuccessModal(false);
//       setPaymentMode("saved");
//       setSelectedCardId(null);
//     } else {
//       setClientSecret("");
//       setCardholderName("");
//       setErrorMessage("");
//       setShowSuccessModal(false);
//       setSelectedCardId(null);
//     }
//   }, [isOpen]);

//   const fetchClientSecret = async () => {
//     try {
//       const response = await createSetupIntent().unwrap();
//       const secret =
//         (response as any).clientSecret || response.data?.clientSecret;

//       if (secret) {
//         setClientSecret(secret);
//       } else {
//         setErrorMessage("Failed to initialize payment. Please try again.");
//       }
//     } catch (err: any) {
//       const msg = err?.data?.message;
//       setErrorMessage(
//         Array.isArray(msg) ? msg[0] : msg || "Failed to initialize payment"
//       );
//     }
//   };

//   const handlePaymentWithSavedCard = async () => {
//     if (!selectedCardId) {
//       setErrorMessage("Please select a card");
//       return;
//     }

//     setIsProcessing(true);
//     setErrorMessage("");

//     try {
//       const selectedCard = walletCards?.find(
//         (card: any) => card.id === selectedCardId
//       );

//       if (!selectedCard) {
//         setErrorMessage("Selected card not found");
//         setIsProcessing(false);
//         return;
//       }

//       await walletPay({
//         paymentMethodId: String(selectedCardId),
//         amount: totalAmount,
//         payType: "PAYMENT",
//       }).unwrap();

//       setShowSuccessModal(true);

//       setTimeout(() => {
//         setShowSuccessModal(false);
//         onPaymentSuccess(selectedCard.stripeMethodId);
//         onClose();
//       }, 2000);
//     } catch (paymentError: any) {
//       const msg = paymentError?.data?.message;
//       setErrorMessage(
//         Array.isArray(msg) ? msg[0] : msg || "Payment processing failed"
//       );
//       setIsProcessing(false);
//     }
//   };

//   const handlePaymentWithNewCard = async () => {
//     setErrorMessage("");

//     if (!stripe || !elements) {
//       setErrorMessage("Payment system not ready. Please try again.");
//       return;
//     }

//     const cardNumberElement = elements.getElement(CardNumberElement);
//     if (!cardNumberElement || !cardholderName) {
//       setErrorMessage("Please fill in card details and cardholder name");
//       return;
//     }

//     if (!clientSecret) {
//       setErrorMessage("Payment session not initialized. Please try again.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
//         clientSecret,
//         {
//           payment_method: {
//             card: cardNumberElement,
//             billing_details: {
//               name: cardholderName,
//             },
//           },
//         }
//       );

//       if (stripeError) {
//         setErrorMessage(stripeError.message || "Payment failed");
//         setIsProcessing(false);
//         return;
//       }

//       if (setupIntent && setupIntent.status === "succeeded") {
//         const stripePaymentMethodId = setupIntent.payment_method as string;

//         try {
//           const saveResponse = await saveCard({
//             paymentMethodId: stripePaymentMethodId,
//           }).unwrap();

//           const numericPaymentMethodId =
//             (saveResponse as any)?.data?.id ||
//             (saveResponse as any)?.id ||
//             (saveResponse as any)?.payment_method_id;

//           if (!numericPaymentMethodId) {
//             setErrorMessage("Failed to save payment method. Please try again.");
//             setIsProcessing(false);
//             return;
//           }

//           try {
//             await walletPay({
//               paymentMethodId: String(numericPaymentMethodId),
//               amount: totalAmount,
//               payType: "PAYMENT",
//             }).unwrap();

//             setShowSuccessModal(true);
//             setCardholderName("");
//             elements.getElement(CardNumberElement)?.clear();
//             elements.getElement(CardExpiryElement)?.clear();
//             elements.getElement(CardCvcElement)?.clear();

//             setTimeout(() => {
//               setShowSuccessModal(false);
//               onPaymentSuccess(stripePaymentMethodId);
//               onClose();
//             }, 2000);
//           } catch (paymentError: any) {
//             const msg = paymentError?.data?.message;
//             setErrorMessage(
//               Array.isArray(msg) ? msg[0] : msg || "Payment processing failed"
//             );
//             setIsProcessing(false);
//           }
//         } catch (saveError: any) {
//           const msg = saveError?.data?.message;
//           setErrorMessage(
//             Array.isArray(msg) ? msg[0] : msg || "Failed to save card"
//           );
//           setIsProcessing(false);
//         }
//       } else {
//         setErrorMessage(
//           "Card verification was not successful. Please try again."
//         );
//         setIsProcessing(false);
//       }
//     } catch (err: any) {
//       const msg = err?.data?.message || err?.message;
//       setErrorMessage(
//         Array.isArray(msg) ? msg[0] : msg || "An unexpected error occurred"
//       );
//       setIsProcessing(false);
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (paymentMode === "saved") {
//       await handlePaymentWithSavedCard();
//     } else {
//       await handlePaymentWithNewCard();
//     }
//   };

//   const handleClose = () => {
//     if (!isProcessing && !showSuccessModal) {
//       setErrorMessage("");
//       setCardholderName("");
//       setSelectedCardId(null);
//       onClose();
//     }
//   };

//   const getCardBrandImage = (brand: string) => {
//     if (!brand) return null;
//     const brandLower = brand.toLowerCase();

//     const brandImages: Record<string, string> = {
//       visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
//       mastercard:
//         "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
//       "american express":
//         "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
//       discover:
//         "https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg",
//       "diners club":
//         "https://upload.wikimedia.org/wikipedia/commons/6/69/Diners_Club_Logo.svg",
//       jcb: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
//       unionpay:
//         "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg",
//     };

//     return brandImages[brandLower] || null;
//   };

//   if (showSuccessModal) {
//     return (
//       <Dialog open={isOpen} onOpenChange={() => {}}>
//         <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-linear-to-br from-emerald-50 to-green-50 border-0 shadow-2xl">
//           <div className="flex flex-col items-center justify-center px-6 py-10 space-y-5">
//             <div className="relative">
//               <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-75"></div>
//               <div className="relative rounded-full bg-linear-to-br from-emerald-500 to-green-600 p-4 shadow-lg">
//                 <CheckCircle className="w-14 h-14 text-white" strokeWidth={2} />
//               </div>
//             </div>
//             <div className="text-center space-y-2">
//               <h3 className="text-2xl font-bold text-emerald-800">
//                 Payment Successful!
//               </h3>
//               <p className="text-emerald-700 text-base">
//                 ${totalAmount.toFixed(2)} has been processed
//               </p>
//               <div className="pt-3">
//                 <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 rounded-full">
//                   <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
//                   <span className="text-emerald-700 text-sm font-medium">
//                     Confirming order...
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-2xl">
//         <div className="relative">
//           <div className="bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-4">
//             <DialogHeader className="space-y-1">
//               <div className="flex items-center justify-between">
//                 <DialogTitle className="text-xl font-bold text-white">
//                   Secure Payment
//                 </DialogTitle>
//                 <Lock className="w-5 h-5 text-white" />
//               </div>
//               <DialogDescription className="text-white/95 text-base font-semibold">
//                 Total: <span className="text-xl">${totalAmount.toFixed(2)}</span>
//               </DialogDescription>
//             </DialogHeader>
//           </div>

//           <div className="px-5 py-5 space-y-5">
//             {!clientSecret && isCreatingIntent ? (
//               <div className="flex flex-col items-center justify-center py-10 space-y-3">
//                 <div className="animate-spin rounded-full h-10 w-10 border-3 border-t-amber-400 border-r-amber-400 border-b-transparent border-l-transparent"></div>
//                 <div className="text-center space-y-1">
//                   <p className="text-gray-700 font-medium text-sm">
//                     Initializing secure payment
//                   </p>
//                   <p className="text-gray-500 text-xs">Please wait...</p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* Payment Mode Toggle */}
//                 <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//                   <button
//                     onClick={() => setPaymentMode("saved")}
//                     disabled={!walletCards || walletCards.length === 0}
//                     className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
//                       paymentMode === "saved"
//                         ? "bg-white text-gray-900 shadow-sm"
//                         : "text-gray-600 hover:text-gray-900"
//                     } disabled:opacity-50 disabled:cursor-not-allowed`}
//                   >
//                     Saved Cards
//                   </button>
//                   <button
//                     onClick={() => setPaymentMode("new")}
//                     className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
//                       paymentMode === "new"
//                         ? "bg-white text-gray-900 shadow-sm"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     New Card
//                   </button>
//                 </div>

//                 {paymentMode === "saved" ? (
//                   <div className="space-y-4">
//                     <div className="text-center space-y-1">
//                       <h3 className="text-lg font-bold text-gray-800">
//                         Select Payment Method
//                       </h3>
//                       <p className="text-gray-600 text-xs">
//                         Choose from your saved cards
//                       </p>
//                     </div>

//                     {isCardsLoading ? (
//                       <div className="text-center p-6 text-gray-500 text-sm">
//                         Loading cards...
//                       </div>
//                     ) : walletCards && walletCards.length > 0 ? (
//                       <div className="space-y-2 max-h-[280px] overflow-y-auto">
//                         {walletCards.map((card: any) => {
//                           const brandImgUrl = getCardBrandImage(card.brand);
//                           const isSelected = selectedCardId === card.id;

//                           return (
//                             <label
//                               key={card.id}
//                               className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
//                                 isSelected
//                                   ? "border-amber-400 bg-amber-50"
//                                   : "border-gray-200 hover:border-gray-300 bg-white"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-7 flex items-center justify-center">
//                                   {brandImgUrl ? (
//                                     <img
//                                       src={brandImgUrl}
//                                       className="w-full h-full object-contain"
//                                       alt={card.brand}
//                                       onError={(e) => {
//                                         (
//                                           e.target as HTMLImageElement
//                                         ).style.display = "none";
//                                       }}
//                                     />
//                                   ) : (
//                                     <CreditCard className="w-5 h-5 text-gray-400" />
//                                   )}
//                                 </div>

//                                 <div>
//                                   <p className="font-medium text-sm capitalize text-gray-900">
//                                     {card.brand} •••• {card.last4}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Expires {card.exp_month}/{card.exp_year}
//                                   </p>
//                                 </div>
//                               </div>

//                               <input
//                                 type="radio"
//                                 name="paymentMethod"
//                                 checked={isSelected}
//                                 onChange={() => setSelectedCardId(card.id)}
//                                 className="w-4 h-4 accent-amber-500 cursor-pointer"
//                               />
//                             </label>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="text-center p-6 text-gray-500 text-sm">
//                         No saved cards found. Add a new card to continue.
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="text-center space-y-1">
//                       <h3 className="text-lg font-bold text-gray-800">
//                         Add New Card
//                       </h3>
//                       <p className="text-gray-600 text-xs">
//                         Your details are encrypted and secure
//                       </p>
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-xs font-medium text-gray-700 flex items-center">
//                         <CreditCard className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
//                         Card Number
//                       </label>
//                       <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
//                         <CardNumberElement options={cardElementOptions} />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="space-y-1.5">
//                         <label className="text-xs font-medium text-gray-700">
//                           Expiry Date
//                         </label>
//                         <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
//                           <CardExpiryElement options={cardElementOptions} />
//                         </div>
//                       </div>
//                       <div className="space-y-1.5">
//                         <label className="text-xs font-medium text-gray-700">
//                           CVC
//                         </label>
//                         <div className="p-2.5 border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
//                           <CardCvcElement options={cardElementOptions} />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-xs font-medium text-gray-700 flex items-center">
//                         Cardholder Name
//                       </label>
//                       <div className="relative">
//                         <input
//                           type="text"
//                           placeholder="Cardholder name"
//                           value={cardholderName}
//                           onChange={(e) => setCardholderName(e.target.value)}
//                           disabled={isProcessing}
//                           className="w-full pl-10 pr-4 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:opacity-50 transition-all outline-none"
//                         />
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {errorMessage && (
//                   <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
//                     <p className="text-red-700 text-xs font-medium flex items-center">
//                       <Shield className="w-4 h-4 mr-1.5 shrink-0" />
//                       {errorMessage}
//                     </p>
//                   </div>
//                 )}

//                 <Button
//                   type="button"
//                   onClick={handlePaymentConfirm}
//                   disabled={
//                     isProcessing ||
//                     isSavingCard ||
//                     isProcessingPayment ||
//                     (paymentMode === "saved" && !selectedCardId) ||
//                     (paymentMode === "new" && (!stripe || !clientSecret))
//                   }
//                   className="w-full py-2.5 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-gray-900 font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   {isProcessing || isSavingCard || isProcessingPayment ? (
//                     <span className="flex items-center justify-center">
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Processing...
//                     </span>
//                   ) : (
//                     `Pay $${totalAmount.toFixed(2)}`
//                   )}
//                 </Button>

//                 <div className="pt-2 border-t border-gray-200">
//                   <p className="text-center text-gray-500 text-[10px] flex items-center justify-center">
//                     <Lock className="w-3 h-3 mr-1" />
//                     Secured by Stripe. We never store your card details.
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default StripeCheckoutModal;