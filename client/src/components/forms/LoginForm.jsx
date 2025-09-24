import React, { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import { Button, Input } from '../ui/base';
import { User, Mail } from 'lucide-react';

const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true); // toggle between Login/Register
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
    });

    // handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log("Logging in with:", formData);
        } else {
            console.log("Registering with:", formData);
        }
    };

    return (
        <AuthLayout>
            {/* Logo */}
            <div className="text-center mb-6">
                <img
                    src="/src/assets/Logo.png" // replace with your logo path
                    alt="Logo"
                    className="mx-auto h-18 w-auto"
                />
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6 space-x-4">
                <Button
                    variant={isLogin ? "primary" : "ghost"}
                    size="md"
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </Button>
                <Button
                    variant={!isLogin ? "primary" : "ghost"}
                    size="md"
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon={Mail
                        
                    }
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    showPasswordToggle
                    required
                />

                <Button type="submit" variant="primary" size="md" className="w-full">
                    {isLogin ? "Login" : "Register"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default LoginForm;
