import { useState, useEffect } from "react";

export function useDonationTimer() {
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this session
    const popupShown = sessionStorage.getItem('donationPopupShown');
    if (popupShown) {
      setHasShownPopup(true);
      return;
    }

    // Set timer for 5 minutes (300,000 milliseconds)
    const timer = setTimeout(() => {
      if (!hasShownPopup) {
        setShowDonationPopup(true);
        setHasShownPopup(true);
        sessionStorage.setItem('donationPopupShown', 'true');
      }
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, [hasShownPopup]);

  const closeDonationPopup = () => {
    setShowDonationPopup(false);
  };

  const onDonationSuccess = () => {
    setShowDonationPopup(false);
    // Could add additional success handling here
  };

  return {
    showDonationPopup,
    closeDonationPopup,
    onDonationSuccess,
  };
}