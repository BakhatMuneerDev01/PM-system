import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        try {
            const { email, password } = formData;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validation (business logic unchanged)
            if (!email) {
                setFieldErrors({ email: "Email is required" });
                setLoading(false);
                return;
            }
            if (!emailRegex.test(email)) {
                setFieldErrors({ email: "Please enter a valid email address" });
                setLoading(false);
                return;
            }
            if (!password) {
                setFieldErrors({ password: "Password is required" });
                setLoading(false);
                return;
            }

            await login(formData);
            toast.success("Logged in successfully");
            navigate("/");
        } catch (err) {
            const message = err.response?.data?.message || "An error occurred during login";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Logo */}
            <div className="text-center mb-4 sm:mb-6">
                <img
                    src="/Logo.png"
                    alt="Logo"
                    className="mx-auto w-32 h-12 sm:w-40 sm:h-14 object-contain"
                />
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-4 sm:mb-6 space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                    variant='primary'
                    size="medium"
                    disabled
                    className="flex-1 min-w-0 text-sm sm:text-base"
                >
                    Login
                </Button>
                <Button
                    variant='ghost'
                    size="medium"
                    onClick={() => navigate('/signup')}
                    className="flex-1 min-w-0 text-sm sm:text-base"
                >
                    Register
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    required
                    icon={Mail}
                    className="text-sm sm:text-base"
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    required
                    showPasswordToggle
                    className="text-sm sm:text-base"
                />

                <Button
                    type="submit"
                    size="medium"
                    variant="primary"
                    disabled={loading}
                    className="w-full text-sm sm:text-base py-3"
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary-600 hover:underline font-medium">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;