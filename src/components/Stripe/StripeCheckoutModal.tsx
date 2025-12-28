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
// import toast from "react-hot-toast";
import { 
  useCreateSetupIntentMutation,
  useSaveCardMutation,
  // useWalletPayMutation
} from "@/redux/features/payment/paymentApi";
import { CheckCircle } from "lucide-react";
import { useWalletPayMutation } from "@/redux/features/wallet/walletApi";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: () => void;
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
        color: "#374151",
        "::placeholder": { color: "#9CA3AF" },
      },
    },
  };

  // Fetch client secret when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchClientSecret();
      setShowSuccessModal(false);
    } else {
      // Reset states when modal closes
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
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || "Failed to initialize payment"
      );
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
      // Step 1: Confirm card setup with Stripe
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
        
        // Step 2: Save card to backend and get integer payment_method_id
        try {
          const saveResponse = await saveCard({ 
            paymentMethodId: stripePaymentMethodId 
          }).unwrap();
          
          // Extract the payment method ID from response
          const numericPaymentMethodId = (saveResponse as any)?.data?.id || 
                                         (saveResponse as any)?.id ||
                                         (saveResponse as any)?.payment_method_id;
          
          if (!numericPaymentMethodId) {
            setErrorMessage("Failed to save payment method. Please try again.");
            setIsProcessing(false);
            return;
          }

          // Step 3: Process wallet payment
          try {
            await walletPay({
              paymentMethodId: String(numericPaymentMethodId),
              amount: totalAmount,
              payType: "PAYMENT"
            }).unwrap();

            // Show success modal
            setShowSuccessModal(true);
            
            // Clear form
            setCardholderName("");
            elements.getElement(CardNumberElement)?.clear();
            elements.getElement(CardExpiryElement)?.clear();
            elements.getElement(CardCvcElement)?.clear();
            
            // Wait 2 seconds then proceed with order
            setTimeout(() => {
              setShowSuccessModal(false);
              onPaymentSuccess();
              onClose();
            }, 2000);
            
          } catch (paymentError: any) {
            const msg = paymentError?.data?.message;
            setErrorMessage(
              Array.isArray(msg) ? msg[0] : msg || "Payment processing failed"
            );
            setIsProcessing(false);
          }
          
        } catch (saveError: any) {
          const msg = saveError?.data?.message;
          setErrorMessage(
            Array.isArray(msg) ? msg[0] : msg || "Failed to save card"
          );
          setIsProcessing(false);
        }
      } else {
        setErrorMessage("Card verification was not successful. Please try again.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      const msg = err?.data?.message || err?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || "An unexpected error occurred"
      );
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

  // Success Modal Content
  if (showSuccessModal) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-600 text-center">
              Your payment of ${totalAmount.toFixed(2)} has been processed successfully.
              <br />
              Creating your order...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mt-4"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-lg font-semibold text-gray-700">
            Total Amount: ${totalAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        {!clientSecret && isCreatingIntent ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            <span className="ml-3 text-gray-600">Loading payment...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg space-y-6 py-4">
            <h3 className="text-xl text-center font-bold text-gray-800">
              Enter Card Details
            </h3>

            {/* Card Number */}
            <div className="pl-2 py-3 border border-gray-300 rounded-md">
              <CardNumberElement options={cardElementOptions} />
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-gray-300 rounded-md">
                <CardExpiryElement options={cardElementOptions} />
              </div>
              <div className="p-3 border border-gray-300 rounded-md">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>

            {/* Cardholder Name */}
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isProcessing}
              className="w-full pl-2 pr-5 py-3 outline-none border border-gray-300 rounded-md focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
            />

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-600 text-center font-medium bg-red-50 p-3 rounded-md">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing || isSavingCard || isProcessingPayment}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePaymentConfirm}
                disabled={!stripe || isProcessing || !clientSecret || isSavingCard || isProcessingPayment}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold disabled:opacity-50"
              >
                {isProcessing || isSavingCard || isProcessingPayment ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StripeCheckoutModal;