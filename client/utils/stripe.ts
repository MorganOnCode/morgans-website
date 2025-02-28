import Stripe from "stripe";
import { config } from "@/config";

// Create a dummy Stripe instance if the secret key is the default value
// This allows the build to complete even if environment variables are missing
const secretKey = config.stripe.secretKey;
const isDefaultKey = secretKey === "default_secret_key";

export const stripe = isDefaultKey 
  ? new Stripe("sk_test_dummy", { apiVersion: "2024-09-30.acacia" })
  : new Stripe(secretKey, { apiVersion: "2024-09-30.acacia" });
