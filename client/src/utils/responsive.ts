/**
 * Responsive utility functions for CivicOS
 * Ensures consistent mobile and desktop experience
 */

export const responsiveClasses = {
  // Container classes
  container: "w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8",
  
  // Grid layouts
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6",
  statsGrid: "grid grid-cols-2 sm:grid-cols-4 gap-4",
  
  // Typography
  pageTitle: "text-2xl sm:text-3xl md:text-4xl font-bold font-serif",
  sectionTitle: "text-lg sm:text-xl md:text-2xl font-semibold",
  cardTitle: "text-base sm:text-lg font-medium",
  
  // Spacing
  pageSpacing: "py-4 sm:py-6 lg:py-8",
  sectionSpacing: "mb-6 sm:mb-8",
  cardSpacing: "p-3 sm:p-4 lg:p-6",
  
  // Interactive elements
  button: "px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base",
  buttonGroup: "flex flex-col sm:flex-row gap-2 sm:gap-3",
  
  // Layout helpers
  flexResponsive: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4",
  hideOnMobile: "hidden sm:block",
  showOnMobile: "block sm:hidden",
  
  // Forms
  searchContainer: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4",
  
  // Modals and dialogs
  modal: "w-[95vw] sm:w-full max-w-4xl max-h-[90vh] p-4 sm:p-6",
  
  // Navigation
  nav: "px-3 sm:px-4 py-2 sm:py-3",
};

export const getResponsiveText = (mobile: string, desktop: string) => {
  return `${mobile} sm:${desktop}`;
};

export const getResponsiveSpacing = (mobile: number, desktop: number) => {
  return `p-${mobile} sm:p-${desktop}`;
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};