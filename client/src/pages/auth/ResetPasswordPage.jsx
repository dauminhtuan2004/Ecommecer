import { useParams } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

function ResetPasswordPage() {
  const { token } = useParams();

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
