import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

function GoogleLoginButton() {
  const { handleGoogleLogin } = useGoogleLogin();

  return (
    <GoogleLogin
      onSuccess={(res) => handleGoogleLogin(res.credential)}
      onError={() => console.log('Google login failed!')}
    />
  );
}

export default GoogleLoginButton;