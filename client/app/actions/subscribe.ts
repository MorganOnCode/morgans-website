"use server";

import { z } from "zod";

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

/**
 * Handles the email subscription form submission
 * In a real application, this would connect to a newsletter service like Mailchimp or SendGrid
 */
export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Extract email from form data
    const email = formData.get("email") as string;
    
    // Validate the email
    const validatedData = subscribeSchema.parse({ email });
    
    // In a real application, you would send this to your newsletter service
    console.log("Subscribing email:", validatedData.email);
    
    // Simulate a delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return { success: true, message: "Successfully subscribed to the newsletter!" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    
    return { success: false, message: "Failed to subscribe. Please try again later." };
  }
} 