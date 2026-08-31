/**
 * Safe cross-platform Haptic Feedback utility for Web & Mobile
 * Uses the Web Vibration API (navigator.vibrate) when supported on mobile devices.
 */

export type HapticType = 
  | 'light'      // Simple click/tap, subtle selection
  | 'medium'     // Action confirmation, toggle, tab switch
  | 'heavy'      // Critical action (Confirm Ride, Accept Trip)
  | 'success'    // Ride confirmed, payment completed, reward redeemed
  | 'warning'    // Alert, counter-offer
  | 'error'      // Rejection, validation error
  | 'sos'        // Emergency SOS alarm pulse pattern
  | 'selection'; // Minor selection change

export function triggerHaptic(type: HapticType = 'medium'): boolean {
  if (typeof window === 'undefined' || !('navigator' in window) || typeof navigator.vibrate !== 'function') {
    return false;
  }

  try {
    switch (type) {
      case 'light':
      case 'selection':
        return navigator.vibrate(18);
      case 'medium':
        return navigator.vibrate(45);
      case 'heavy':
        // Double punch for major commitment actions
        return navigator.vibrate([60, 40, 70]);
      case 'success':
        // Ascending pleasant cadence
        return navigator.vibrate([35, 45, 75]);
      case 'warning':
        return navigator.vibrate([50, 40, 50]);
      case 'error':
        return navigator.vibrate([70, 50, 70, 50, 70]);
      case 'sos':
        // Emergency vibration sequence
        return navigator.vibrate([120, 60, 120, 60, 120, 100, 250, 100, 250, 100, 250, 100, 120, 60, 120]);
      default:
        return navigator.vibrate(35);
    }
  } catch {
    return false;
  }
}
