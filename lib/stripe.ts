import Stripe from "stripe";
import { serverEnv } from "./env";

export const stripe = new Stripe(serverEnv.stripeSecretKey, {
  apiVersion: "2024-06-20",
});
