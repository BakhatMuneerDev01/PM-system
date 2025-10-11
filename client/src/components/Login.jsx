import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({}); // <-- store inline errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // reset errors
        setFieldErrors({});

        try {
            const { usernameOrEmail, password } = formData;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // inline validation
            if (!usernameOrEmail) {
                setFieldErrors((prev) => ({
                    ...prev,
                    usernameOrEmail: "Username or Email is required",
                }));
                setLoading(false);
                return;
            }
            if (usernameOrEmail.includes("@") && !emailRegex.test(usernameOrEmail)) {
                setFieldErrors((prev) => ({
                    ...prev,
                    usernameOrEmail: "Please enter a valid email address",
                }));
                setLoading(false);
                return;
            }
            if (!password) {
                setFieldErrors((prev) => ({
                    ...prev,
                    password: "Password is required",
                }));
                setLoading(false);
                return;
            }

            // call backend
            await login(formData);
            toast.success("Login successful");
            navigate("/patients");
        } catch (err) {
            const message =
                err.response?.data?.message || "An error occurred during login";
            toast.error(message); // backend errors still shown in toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Logo */}
            <div className="text-center mb-6">
                <img
                    src="/Logo.png" // replace with your logo path
                    alt="Logo"
                    className="mx-auto"
                />
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6 space-x-1">
                <Button
                    variant='primary'
                    size="large"
                    disabled
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    variant='ghost'
                    size="large"
                    onClick={() => navigate('/signup')}
                >
                    Register
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username or Email"
                    name="usernameOrEmail"
                    placeholder="Enter your username or email"
                    value={formData.usernameOrEmail}
                    icon={Mail}
                    onChange={handleChange}
                    error={fieldErrors.usernameOrEmail}
                    required
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
                />

                <Button
                    type="submit"
                    size="medium"
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;