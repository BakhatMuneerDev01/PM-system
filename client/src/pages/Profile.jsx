import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, CreditCard, Camera, Save, Trash2, AlertTriangle } from 'lucide-react';
import { Title, Input, Button, Modal } from '../components/ui/base';
import CountrySelector from '../components/CountrySelector'
import StripePaymentForm from '../components/PaymentForm';;
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const { user, update, logout } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        paymentDetails: {
            enableAutoPayout: false,
            notifyNewPayments: false,
            cardHolderName: '',
            creditCardNumber: '',
            country: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                password: '',
                phoneNumber: user.phoneNumber || '',
                paymentDetails: {
                    enableAutoPayout: user.paymentDetails?.enableAutoPayout || false,
                    notifyNewPayments: user.paymentDetails?.notifyNewPayments || false,
                    cardHolderName: user.paymentDetails?.cardHolderName || '',
                    creditCardNumber: user.paymentDetails?.creditCardNumber || '',
                    country: user.paymentDetails?.country || ''
                }
            });
            setImagePreview(user.profileImage || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('paymentDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                paymentDetails: {
                    ...prev.paymentDetails,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleCountryChange = (e) => {
        setFormData(prev => ({
            ...prev,
            paymentDetails: {
                ...prev.paymentDetails,
                country: e.target.value
            }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Add delete function
    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            toast.error('Please type "DELETE" to confirm account deletion');
            return;
        }

        try {
            await api.delete('/auth/account', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success('Account deleted successfully');
            logout();
            navigate('/login');
        } catch (error) {
            // Log richer diagnostics (status, data) to aid debugging
            console.error('Failed to delete account:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });

            // Prefer backend-provided message, fall back to axios/network message, then to generic.
            const serverMessage = error.response?.data?.message;
            const networkMessage = error.message;
            toast.error(serverMessage || networkMessage || 'Failed to delete account');
        }

    };

    // In the handleSubmit function, ensure paymentDetails is properly structured
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('username', formData.username);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);

            // Ensure paymentDetails is properly stringified with all fields
            const paymentDetails = {
                enableAutoPayout: formData.paymentDetails.enableAutoPayout,
                notifyNewPayments: formData.paymentDetails.notifyNewPayments,
                cardHolderName: formData.paymentDetails.cardHolderName,
                creditCardNumber: formData.paymentDetails.creditCardNumber,
                country: formData.paymentDetails.country // Ensure country is included
            };
            submitData.append('paymentDetails', JSON.stringify(paymentDetails));

            if (profileImage) {
                submitData.append('profileImage', profileImage);
            }
            if (formData.password) {
                submitData.append('password', formData.password);
            }

            await update(submitData);
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, password: '' }));
            setProfileImage(null);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveImage = () => {
        setProfileImage(null);
        setImagePreview(user?.profileImage || '');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Title
                    title={`Welcome, ${user?.username || 'User'}`}
                    className="text-3xl"
                />
            </div>

            <p className="text-gray-600 text-lg -mt-6">
                Manage your profile to keep your information up-to-date.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Image Upload - FIXED */}
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden border-2 border-gray-300">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : null}
                            {!imagePreview && (
                                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                                id="profileImage"
                                name="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Profile Photo</p>
                        <p className="text-sm text-gray-500">Click the camera icon to upload a new photo</p>
                        {imagePreview && imagePreview !== user?.profileImage && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="text-sm text-red-600 hover:text-red-700 mt-1"
                            >
                                Remove photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            icon={User}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            icon={Mail}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter new password (leave blank to keep current)"
                            value={formData.password}
                            onChange={handleInputChange}
                            icon={Lock}
                            showPasswordToggle
                        />

                        <Input
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            icon={Phone}
                            placeholder="0333-12345678"
                        />
                    </div>
                </div>

                {/* Payments Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
                    </div>

                    <p className="text-gray-600 mb-6">
                        You can change your payment credentials here.
                    </p>

                    {/* Payment Options */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="enableAutoPayout"
                                name="paymentDetails.enableAutoPayout"
                                checked={formData.paymentDetails.enableAutoPayout}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                            />
                            <div>
                                <label htmlFor="enableAutoPayout" className="block text-sm font-medium text-gray-700">
                                    Enable Auto Payout
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    Autopayout occurs at the end of each month.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="notifyNewPayments"
                                name="paymentDetails.notifyNewPayments"
                                checked={formData.paymentDetails.notifyNewPayments}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                            />
                            <div>
                                <label htmlFor="notifyNewPayments" className="block text-sm font-medium text-gray-700">
                                    Notify New Payments
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    You will be notified when a payment has been made.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Card Holder Name"
                            name="paymentDetails.cardHolderName"
                            value={formData.paymentDetails.cardHolderName}
                            onChange={handleInputChange}
                            placeholder="Azusa Nakano"
                        />

                        <Input
                            label="Credit Card"
                            name="paymentDetails.creditCardNumber"
                            value={formData.paymentDetails.creditCardNumber}
                            onChange={handleInputChange}
                            placeholder="1111 2222 3333 4444"
                            icon={CreditCard}
                        />

                        <div className="md:col-span-2">
                            <CountrySelector
                                label="Country"
                                name="paymentDetails.country"
                                value={formData.paymentDetails.country}
                                onChange={handleCountryChange}
                                placeholder="United Kingdom"
                            />
                        </div>
                    </div>
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        size="small"
                        icon={Save}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>

            <div className="bg-white rounded-lg border border-red-200 p-6 mt-8">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                </div>

                <p className="text-red-700 mb-4">
                    Once you delete your account, there is no going back. All your data including patients, visits, and messages will be permanently deleted.
                </p>

                <Button
                    variant="danger"
                    size="small"
                    icon={Trash2}
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    Delete Account
                </Button>
            </div>

            {/* Delete Account Modal */}
            <Modal
                title="Delete Account"
                Icon={AlertTriangle}
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmation('');
                }}
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                            <span className="text-red-800 font-medium">Warning</span>
                        </div>
                        <p className="text-red-700 text-sm mt-2">
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type "DELETE" to confirm
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="DELETE"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeleteConfirmation('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="small"
                            icon={Trash2}
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== 'DELETE'}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;