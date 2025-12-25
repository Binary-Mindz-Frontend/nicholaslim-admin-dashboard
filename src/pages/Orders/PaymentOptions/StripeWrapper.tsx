import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddFundsModal from "./AddFundsModal";

/* ✅ Load Stripe ONCE using env */
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function StripeWrapper() {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-10 text-center text-red-500">
        Stripe publishable key is missing
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <AddFundsModal />
    </Elements>
  );
}
