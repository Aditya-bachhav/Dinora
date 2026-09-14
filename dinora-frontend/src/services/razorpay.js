// Loads the Razorpay Checkout script once and exposes a promise-based
// wrapper around it. Checkout is a script-injected global (window.Razorpay)
// — there's no npm package for it, this is how Razorpay's own docs
// integrate it: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise = null;

function loadCheckoutScript() {
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the payment provider. Check your connection."));
    document.body.appendChild(script);
  });

  return loadPromise;
}

/**
 * Opens Razorpay Checkout for one payment attempt.
 *
 * @param {object} init - the exact response from POST /api/orders/{id}/pay/init
 *   { razorpay_key_id, razorpay_order_id, amount_subunits, currency }
 * @param {object} opts - { name, description, prefillEmail, prefillContact }
 * @returns {Promise<object>} resolves with
 *   { razorpay_order_id, razorpay_payment_id, razorpay_signature } on success.
 *   Rejects if the user closes the sheet without paying, or the script fails
 *   to load. A rejection here does NOT mean the payment failed server-side —
 *   the server is always the source of truth via /pay/verify.
 */
export async function openRazorpayCheckout(init, opts = {}) {
  await loadCheckoutScript();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: init.razorpay_key_id,
      order_id: init.razorpay_order_id,
      amount: init.amount_subunits,
      currency: init.currency,
      name: opts.name || "Dinora",
      description: opts.description || "Order payment",
      prefill: {
        email: opts.prefillEmail || "",
        contact: opts.prefillContact || "",
      },
      theme: { color: "#d4622a" },
      handler: (response) => {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(new Error(response?.error?.description || "Payment failed"));
    });

    rzp.open();
  });
}
