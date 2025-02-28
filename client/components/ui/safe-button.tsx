"use client";

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";

export interface SafeButtonProps extends ButtonProps {
  // No additional props needed
}

/**
 * SafeButton is a wrapper around the Button component that adds attributes
 * to prevent password manager extensions like LastPass from injecting elements
 * that can cause hydration errors.
 */
const SafeButton = React.forwardRef<HTMLButtonElement, SafeButtonProps>(
  (props, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        data-lpignore="true"
        suppressHydrationWarning
      />
    );
  }
);

SafeButton.displayName = "SafeButton";

export { SafeButton }; 