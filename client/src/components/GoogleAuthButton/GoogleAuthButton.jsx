import { GoogleLogin } from '@react-oauth/google';

/**
 * Official Google Sign-In button powered by @react-oauth/google.
 * Uses Google Identity Services modal overlay to avoid browser popup blocker restrictions.
 */
export default function GoogleAuthButton({
  onSuccess,
  onError,
  disabled = false,
  text = 'Continue with Google',
  id = 'google-auth-btn',
}) {
  return (
    <div
      id={id}
      className="google-auth-button-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: '44px',
      }}
    >
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse?.credential) {
            onError?.('Google authentication failed: no credential received.');
            return;
          }
          try {
            await onSuccess({ credential: credentialResponse.credential });
          } catch (err) {
            onError?.(err.message || 'Google authentication failed.');
          }
        }}
        onError={() => {
          onError?.('Google sign-in was blocked or interrupted. Please check browser pop-up permissions.');
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
