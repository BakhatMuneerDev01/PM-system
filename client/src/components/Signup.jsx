import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Signup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({}); // inline errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        try {
            const { username, email, password, confirmPassword } = formData;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // inline validation
            if (!username) {
                setFieldErrors((prev) => ({
                    ...prev,
                    username: "Username is required",
                }));
                setLoading(false);
                return;
            }
            if (!email) {
                setFieldErrors((prev) => ({
                    ...prev,
                    email: "Email is required",
                }));
                setLoading(false);
                return;
            }
            if (!emailRegex.test(email)) {
                setFieldErrors((prev) => ({
                    ...prev,
                    email: "Please enter a valid email address",
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
            if (password.length < 8) {
                setFieldErrors((prev) => ({
                    ...prev,
                    password: "Password must be at least 8 characters",
                }));
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Passwords do not match",
                }));
                setLoading(false);
                return;
            }

            // call backend
            await register(formData);
            toast.success("Account created successfully");
            navigate("/");
        } catch (err) {
            const message =
                err.response?.data?.message || "An error occurred during registration";
            toast.error(message); // backend error
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Logo */}
            <div className="text-center mb-6">
                <img
                    src="../public/Logo.png" // replace with actual logo path
                    alt="Logo"
                    className="mx-auto"
                />
            </div>
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6 space-x-1">
                <Button
                    variant='ghost'
                    size="large"
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    variant='primary'
                    size="large"
                    disabled
                    onClick={() => navigate('/signup')}
                >
                    Register
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    error={fieldErrors.username}
                    required
                    icon={User}
                />

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

                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={fieldErrors.confirmPassword}
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
                    {loading ? "Registering..." : "Sign Up"}
                </Button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-600 hover:underline">
                    Login
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Signup;