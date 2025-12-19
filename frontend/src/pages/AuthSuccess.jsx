import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
      return;
    }

    // 🔐 Save token
    localStorage.setItem("gitbounty_token", token);

    // 🔥 Notify navbar
    window.dispatchEvent(new Event("tokenUpdated"));

    // 🔁 Redirect to home
    navigate("/", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      Signing you in...
    </div>
  );
};

export default AuthSuccess;
