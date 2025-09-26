import Button from "./Button.jsx";

const GoogleButton = ({ onClick, className = "" }) => (
  <Button
    icon="/images/google-icon.svg" // Add a Google icon SVG to /public/images (or use text)
    className={`w-full py-3 mt-3 bg-white text-black border border-gray-300 hover:bg-gray-50 ${className}`}
    onClick={onClick}
  >
    Sign in with Google
  </Button>
);

export default GoogleButton;
