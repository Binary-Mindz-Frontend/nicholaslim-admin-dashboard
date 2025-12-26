
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreditCard, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  useAddMoneyToWalletMutation,
  useCreateSetupIntentMutation,
  useSaveCardMutation,
  useGetWalletCardsQuery,
  useDeleteCardMutation,

} from "@/redux/features/payment/paymentApi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import toast from "react-hot-toast";


/* Stripe instance */
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function AddFundsFormContent() {
  const stripe = useStripe();
  const elements = useElements();

  const [addMoneyToWallet, { isLoading, isError, isSuccess, error }] =
    useAddMoneyToWalletMutation();

  // Mutations & Queries
  const [createSetupIntent, { isLoading: isCreatingIntent }] = useCreateSetupIntentMutation();
  const [saveCard, { isLoading: isSavingCard }] = useSaveCardMutation();
  const { data: walletCards, isLoading: isCardsLoading } = useGetWalletCardsQuery();

  const [selectedAmount, setSelectedAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new" | "">("");
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>(""); // Track specific card ID
  const [cardholderName, setCardholderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  const [deleteCard] = useDeleteCardMutation();

  // console.log(walletCards)
  useEffect(() => {
    if (walletCards && Array.isArray(walletCards) && walletCards.length > 0) {
      // Find the card marked as default, or fallback to the first card
      const defaultCard = walletCards.find((c: any) => c.isDefault) || walletCards[0];

      // Use the correct key: stripeMethodId
      if (defaultCard?.stripeMethodId) {
        setSelectedSavedCardId(defaultCard.stripeMethodId);
        setPaymentMethod("saved");
      }
    }
  }, [walletCards]);


  const handleSaveCard = async () => {
    setErrorMessage("");
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement || !cardholderName) {
      setErrorMessage("Please fill in card details and cardholder name");
      return;
    }

    try {
      const response = await createSetupIntent().unwrap();
      const clientSecret = (response as any).clientSecret || response.data?.clientSecret;

      if (!clientSecret) {
        setErrorMessage("Secure session could not be initialized.");
        return;
      }

      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: { name: cardholderName },
          },
        }
      );

      if (stripeError) {
        setErrorMessage(stripeError.message || "Failed to verify card");
        return;
      }

      if (setupIntent?.status === "succeeded") {
        const payload = { paymentMethodId: setupIntent.payment_method as string };
        await saveCard(payload).unwrap();
        toast.success("Card saved successfully!");


        setPaymentMethod("saved");
        setCardholderName("");
        elements.getElement(CardNumberElement)?.clear();
        elements.getElement(CardExpiryElement)?.clear();
        elements.getElement(CardCvcElement)?.clear();
      }
    } catch (err: any) {
      const msg = err?.data?.message;
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "An error occurred while saving the card");
    }
  };

  const handleRemoveCard = async () => {
  if (!cardToDelete) return;

  try {
    await deleteCard(cardToDelete).unwrap();

    toast.success("Card removed successfully!");

    const deletedCardStripeId =
      walletCards?.find(c => c.id === cardToDelete)?.stripeMethodId;

    if (selectedSavedCardId === deletedCardStripeId) {
      setSelectedSavedCardId("");
      setPaymentMethod("");
    }
  } catch (err: any) {
    toast.error(err?.data?.message || "Failed to remove card");
  } finally {
    setCardToDelete(null);
  }
};

  useEffect(() => {
    if (isSuccess) {
      toast.success("Funds added successfully!");
      setCardholderName("");
      setCustomAmount("");
      setSelectedAmount(20);
      setPaymentMethod("");

      elements?.getElement(CardNumberElement)?.clear();
      elements?.getElement(CardExpiryElement)?.clear();
      elements?.getElement(CardCvcElement)?.clear();
    }
  }, [isSuccess, elements]);

  useEffect(() => {
    if (isError && error) {
      setErrorMessage((error as any)?.data?.message || "Failed to add funds");
    }
  }, [isError, error]);

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-xl text-gray-600 animate-pulse">
          Connecting to secure payment gateway...
        </div>
      </div>
    );
  }

  const getCardBrandImage = (brand: string) => {
    if (!brand) return null;
    const brandLower = brand.toLowerCase();
    const baseUrl = "https://js.stripe.com/v3/fingerprinted/img";

    switch (brandLower) {
      case "visa":
        return `${baseUrl}/visa-729c05c240c4bdb47b03ac81d9945bfe.svg`;
      case "mastercard":
        return `${baseUrl}/mastercard-729c05c240c4bdb47b03ac81d9945bfe.svg`;
      case "american express":
        return `${baseUrl}/amex-a719155989104199320e192776c594d2.svg`;
      case "discover":
        return `${baseUrl}/discover-ff1ca479532506a77d13f99e82110c73.svg`;
      case "diners club":
        return `${baseUrl}/diners-fbcbd30a0f6e7099c405cb6763777583.svg`;
      case "jcb":
        return `${baseUrl}/jcb-729c05c240c4bdb47b03ac81d9945bfe.svg`; // example
      default:
        return null;
    }
  };


  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setErrorMessage("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmount(value);
    setSelectedAmount(0);
    setErrorMessage("");
  };

  const handleAddFund = async () => {
    // 1. Calculate final amount
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    // 2. Validation
    if (!amount || amount <= 0) {
      setErrorMessage("Please select or enter a valid amount");
      return;
    }

    if (!paymentMethod) {
      setErrorMessage("Please select a payment method");
      return;
    }

    try {
      // CASE 1: USER SELECTED A SAVED CARD
      if (paymentMethod === "saved") {
        if (!selectedSavedCardId) {
          setErrorMessage("Please select a saved card from the list");
          return;
        }

        // Call the same mutation using the ID from your database
        await addMoneyToWallet({
          amount,
          paymentMethodId: selectedSavedCardId, // This is the pm_... ID from your getWalletCards
        }).unwrap();
      }

      // CASE 2: USER IS ADDING A NEW CARD
      if (paymentMethod === "new") {
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) return;

        // Create temporary PaymentMethod with Stripe
        const { error: stripeError, paymentMethod: pm } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: { name: cardholderName },
        });

        if (stripeError) {
          setErrorMessage(stripeError.message || "Stripe validation failed");
          return;
        }

        // Call the same mutation using the fresh ID from Stripe
        await addMoneyToWallet({
          amount,
          paymentMethodId: pm.id, // This is the fresh pm_... ID from Stripe
        }).unwrap();
      }
    } catch (err: any) {
      // Error is handled by your useEffect [isError]
      console.error("Payment Error:", err);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#374151",
        "::placeholder": { color: "#9CA3AF" },
      },
    },
  };

  return (
    <div className="m-6">
      <h2 className="text-2xl font-bold text-gray-900 py-8">Add Funds</h2>

      <div className="bg-white rounded-2xl overflow-hidden">
        {/* AMOUNT SELECTION */}
        <div className="overflow-x-auto flex flex-col items-center justify-center">
          <p className="text-2xl my-6 font-medium text-gray-600">
            How much do you want to add?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[10, 20, 40, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountClick(amount)}
                className={`px-14 py-1 rounded-md font-medium text-lg transition-all border-2 ${selectedAmount === amount
                  ? "bg-yellow-400 border-yellow-400 text-yellow-900 shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* CUSTOM AMOUNT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a custom amount
            </label>
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="$0.00"
            />
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <h3 className="text-xl text-center font-bold text-gray-800 mb-4">
              Choose Payment Method
            </h3>

            {/* Dynamic Saved Cards */}
            {isCardsLoading ? (
              <div className="text-center p-4 text-gray-500">Loading cards...</div>
            ) : (
              walletCards?.map((card: any) => {
                const brandImgUrl = getCardBrandImage(card.brand);

                return (
                  <label
                    key={card.id}
                    className="flex items-center justify-between p-4 border-y border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 flex items-center justify-center overflow-hidden">
                        {brandImgUrl ? (
                          <img
                            src={brandImgUrl}
                            className="w-full h-full object-contain"
                            alt={card.brand}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).parentElement!.appendChild(
                                document.createElement("span")
                              ); // optional fallback
                            }}
                          />
                        ) : (
                          <CreditCard className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium capitalize">
                          {card.brand} ****{card.last4}
                        </p>
                        {card.isDefault && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={
                          paymentMethod === "saved" &&
                          selectedSavedCardId === card.stripeMethodId
                        }
                        onChange={() => {
                          setPaymentMethod("saved");
                          setSelectedSavedCardId(card.stripeMethodId);
                          setErrorMessage("");
                        }}
                        className="w-5 h-5 accent-yellow-400"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => setCardToDelete(card.id)} // ✅ store id
                        className="text-red-600 text-sm font-bold px-1 py-1 border border-red-600 rounded-full hover:bg-red-50"
                      >
                        <Minus size={12} />
                      </button>



                    </div>
                  </label>
                );
              })
            )}

            <label className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <p className="font-medium">Add new card</p>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "new"}
                onChange={() => setPaymentMethod("new")}
                className="w-5 h-5 accent-yellow-400"
              />
            </label>
          </div>

          {/* ADD NEW CARD FORM */}
          {paymentMethod === "new" && (
            <div className="border-gray-200 rounded-xl p-6 space-y-6">
              <div className="pl-2 py-2 border rounded-md">
                <CardNumberElement options={cardElementOptions} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 border rounded-md">
                  <CardExpiryElement options={cardElementOptions} />
                </div>
                <div className="p-2 border rounded-md">
                  <CardCvcElement options={cardElementOptions} />
                </div>
              </div>

              <input
                type="text"
                placeholder="Name on card"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full pl-2 pr-5 py-2 outline-none border border-gray-200 rounded-md"
              />

              <button
                type="button"
                onClick={handleSaveCard}
                disabled={isCreatingIntent || isSavingCard}
                className="w-full py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold disabled:opacity-50"
              >
                {isSavingCard || isCreatingIntent ? "Saving..." : "Save Card"}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-600 text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* ADD FUND BUTTON */}
          <button
            onClick={handleAddFund}
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl"
          >
            {isLoading ? "Processing..." : "Add Fund"}
          </button>
        </div>
      </div>
      <AlertDialog open={!!cardToDelete} onOpenChange={() => setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleRemoveCard}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default function AddFundsModal() {
  return (
    <Elements stripe={stripePromise}>
      <AddFundsFormContent />
    </Elements>
  );
}