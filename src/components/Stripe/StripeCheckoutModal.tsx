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
import { useCreateSetupIntentMutation } from "@/redux/features/payment/paymentApi";
import { useSaveCardMutation } from "@/redux/features/payment/paymentApi";
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

  const [createSetupIntent, { isLoading: isCreatingIntent }] = useCreateSetupIntentMutation();
  const [saveCard, { isLoading: isSavingCard }] = useSaveCardMutation();
  const [walletPay, { isLoading: isProcessingPayment }] = useWalletPayMutation();

  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
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
    } else {
      setClientSecret("");
      setCardholderName("");
      setErrorMessage("");
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  const fetchClientSecret = async () => {
    try {
      const response = await createSetupIntent().unwrap();
      const secret = (response as any).clientSecret || response.data?.clientSecret;

      if (secret) {
        setClientSecret(secret);
      } else {
        setErrorMessage("Failed to initialize payment. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.data?.message;
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "Failed to initialize payment");
    }
  };

  const handlePaymentConfirm = async () => {
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
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (setupIntent && setupIntent.status === "succeeded") {
        const stripePaymentMethodId = setupIntent.payment_method as string;
        console.log("Stripe Payment Method ID:", stripePaymentMethodId);

        try {
          const saveResponse = await saveCard({
            paymentMethodId: stripePaymentMethodId,
          }).unwrap();
          console.log("Save card response:", saveResponse);

          const numericPaymentMethodId =
            (saveResponse as any)?.data?.id ||
            (saveResponse as any)?.id ||
            (saveResponse as any)?.payment_method_id;

          if (!numericPaymentMethodId) {
            setErrorMessage("Failed to save payment method. Please try again.");
            setIsProcessing(false);
            return;
          }

          console.log("Numeric Payment Method ID:", numericPaymentMethodId);

          try {
            await walletPay({
              paymentMethodId: String(numericPaymentMethodId),
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
              // Pass the Stripe payment method ID to the parent component
              onPaymentSuccess(stripePaymentMethodId);
              onClose();
            }, 2000);
          } catch (paymentError: any) {
            const msg = paymentError?.data?.message;
            setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "Payment processing failed");
            setIsProcessing(false);
          }
        } catch (saveError: any) {
          const msg = saveError?.data?.message;
          setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "Failed to save card");
          setIsProcessing(false);
        }
      } else {
        setErrorMessage("Card verification was not successful. Please try again.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message;
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing && !showSuccessModal) {
      setErrorMessage("");
      setCardholderName("");
      onClose();
    }
  };

  if (showSuccessModal) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-linear-to-br from-emerald-50 to-green-50 border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center px-8 py-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-75"></div>
              <div className="relative rounded-full bg-linear-to-br from-emerald-500 to-green-600 p-5 shadow-lg">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-bold text-emerald-800">Payment Successful!</h3>
              <p className="text-emerald-700 text-lg">${totalAmount.toFixed(2)} has been processed</p>
              <div className="pt-4">
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-emerald-100 rounded-full">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span className="text-emerald-700 font-medium">Confirming your order...</span>
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
      <DialogContent className="sm:max-w-[520px] p-0 z-9999 overflow-hidden to-gray-50 border border-gray-200 shadow-2xl">
        <div className="relative">
          <div className="bg-linear-to-r from-amber-500 to-yellow-400 px-6 py-3">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-white">Secure Payment</DialogTitle>
              </div>
              <DialogDescription className="text-white/95 text-lg font-semibold">
                Total Amount: <span className="text-2xl">${totalAmount.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-7 space-y-7">
            {!clientSecret && isCreatingIntent ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-t-amber-400 border-r-amber-400 border-b-transparent border-l-transparent"></div>
                <div className="text-center space-y-2">
                  <p className="text-gray-700 font-medium">Initializing secure payment</p>
                  <p className="text-gray-500 text-sm">Please wait a moment...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">Enter Card Information</h3>
                    <p className="text-gray-600 text-sm">Your payment details are encrypted and secure</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                      Card Number
                    </label>
                    <div className="p-3 border-2 border-gray-300 rounded-xl bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all duration-200">
                      <CardNumberElement options={cardElementOptions} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                      <div className="p-3 border-2 border-gray-300 rounded-xl bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all duration-200">
                        <CardExpiryElement options={cardElementOptions} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">CVC / CVV</label>
                      <div className="p-3 border-2 border-gray-300 rounded-xl bg-white hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all duration-200">
                        <CardCvcElement options={cardElementOptions} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        disabled={isProcessing}
                        className="w-full pl-12 pr-5 py-2.5 outline-none border-2 border-gray-300 rounded-xl bg-white hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:opacity-50 transition-all duration-200"
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-red-700 font-medium flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={handlePaymentConfirm}
                      disabled={
                        !stripe ||
                        isProcessing ||
                        !clientSecret ||
                        isSavingCard ||
                        isProcessingPayment
                      }
                      className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isProcessing || isSavingCard || isProcessingPayment ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Pay $${totalAmount.toFixed(2)}`
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-xs flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Your payment is secure and encrypted. We never store your card details.
                    </p>
                  </div>
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