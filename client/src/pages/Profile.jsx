import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, CreditCard, Camera, Save, Trash2, AlertTriangle } from 'lucide-react';
import { Title, Input, Button, Modal } from '../components/ui/base';
import CountrySelector from '../components/CountrySelector';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // ✅ FIX: Improved useEffect with proper image preview initialization
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

            // ✅ CRITICAL FIX: Initialize image preview with better validation
            updateImagePreviewFromUser(user);
        }
    }, [user]);


    // ✅ NEW: Enhanced image preview update function
    const updateImagePreviewFromUser = (userData) => {
        if (userData?.profileImage && isValidImageUrl(userData.profileImage)) {
            setImagePreview(userData.profileImage);
            setImageLoadError(false);
            console.log('🔄 Image preview set from user data:', userData.profileImage);
        } else {
            setImagePreview('');
            setImageLoadError(false);
            console.log('🔄 Image preview cleared - no valid user image');
        }
    };

    // ✅ FIX: Enhanced image URL validation
    const isValidImageUrl = (url) => {
        if (!url) return false;

        // ✅ CRITICAL: Check for placeholder Cloudinary URLs
        if (url.includes('your_cloud_name') || url.includes('cloudinary.com/your_cloud_name')) {
            console.warn('❌ Invalid Cloudinary URL detected:', url);
            return false;
        }

        // Allow ui-avatars.com URLs
        if (url.includes('ui-avatars.com')) return true;

        // Allow valid Cloudinary URLs
        if (url.includes('res.cloudinary.com')) {
            try {
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                // Check if it has proper Cloudinary structure
                return pathParts.length >= 4 && pathParts[1] === 'image' && pathParts[2] === 'upload';
            } catch {
                return false;
            }
        }

        // General URL validation
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    // ✅ FIX: Enhanced image error handler
    const handleImageError = (imageUrl) => {
        console.warn('❌ Image failed to load:', imageUrl);
        setImageLoadError(true);

        // Don't clear imagePreview entirely, just mark it as having load error
        // This allows retries if it was a temporary network issue
    };

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

    // ✅ FIX: Enhanced image change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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

        console.log('📸 New image selected:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        setProfileImage(file);
        setImageLoadError(false); // Reset error state for new image
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    };
    // ✅ FIX: Complete submit handler rewrite with proper file handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            // Add basic fields
            submitData.append('username', formData.username);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);

            // Add payment details
            const paymentDetails = {
                enableAutoPayout: formData.paymentDetails.enableAutoPayout,
                notifyNewPayments: formData.paymentDetails.notifyNewPayments,
                cardHolderName: formData.paymentDetails.cardHolderName,
                creditCardNumber: formData.paymentDetails.creditCardNumber,
                country: formData.paymentDetails.country
            };
            submitData.append('paymentDetails', JSON.stringify(paymentDetails));

            // ✅ CRITICAL FIX: Ensure file is properly appended to FormData
            if (profileImage instanceof File) {
                submitData.append('profileImage', profileImage);
                console.log('📤 Uploading new profile image:', profileImage.name);
            } else {
                console.log('ℹ️ No new image selected - keeping existing');
            }

            // Add password only if changed
            if (formData.password && formData.password.trim()) {
                submitData.append('password', formData.password);
            }

            // ✅ Call update and handle response
            console.log('🔄 Sending update request...');
            const response = await update(submitData);
            console.log('✅ Update response received:', {
                username: response.username,
                hasProfileImage: !!response.profileImage,
                profileImage: response.profileImage
            });

            // ✅ CRITICAL FIX: Update image preview with the actual response from backend
            if (response.profileImage && isValidImageUrl(response.profileImage)) {
                setImagePreview(response.profileImage);
                setImageLoadError(false);
                console.log('🔄 Image preview updated from response:', response.profileImage);
            } else {
                setImagePreview('');
                setImageLoadError(false);
            }

            toast.success('Profile updated successfully');

            // ✅ Reset only the temporary states
            setFormData(prev => ({ ...prev, password: '' }));
            setProfileImage(null); // Clear file input

        } catch (error) {
            console.error('❌ Profile update error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            toast.error(errorMessage);

            // ✅ Revert image preview to current user state on error
            updateImagePreviewFromUser(user);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIX: Updated remove image handler
    const handleRemoveImage = () => {
        setProfileImage(null);
        setImageLoadError(false);
        // Revert to user's existing image
        updateImagePreviewFromUser(user);
        toast.info('Image change cancelled');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            toast.error('Please type "DELETE" to confirm');
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
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    // ✅ FIX: Generate fallback avatar based on username
    const getFallbackAvatar = () => {
        const initial = user?.username?.charAt(0).toUpperCase() || 'U';
        return (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold">
                {initial}
            </div>
        );
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
                {/* Profile Image Upload - ✅ FIXED */}
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden border-2 border-gray-300">
                            {imagePreview && !imageLoadError ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={() => handleImageError(imagePreview)}
                                    onLoad={() => setImageLoadError(false)}
                                />
                            ) : (
                                getFallbackAvatar()
                            )}
                        </div>
                        <label
                            htmlFor="profileImage"
                            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                        >
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
                        {profileImage && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="text-sm text-red-600 hover:text-red-700 mt-1"
                            >
                                Cancel upload
                            </button>
                        )}
                        {imageLoadError && (
                            <p className="text-sm text-orange-600 mt-1">
                                Could not load profile image - showing fallback
                            </p>
                        )}
                    </div>
                </div>

                {/* Rest of the form - Personal Information */}
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
                            placeholder="Leave blank to keep current"
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

                {/* Payment Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
                    </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Card Holder Name"
                            name="paymentDetails.cardHolderName"
                            value={formData.paymentDetails.cardHolderName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
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
                                value={formData.paymentDetails.country}
                                onChange={handleCountryChange}
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

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6 mt-8">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                </div>

                <p className="text-red-700 mb-4">
                    Once you delete your account, there is no going back.
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

            {/* Delete Modal */}
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
                        <p className="text-red-700 text-sm">
                            This action cannot be undone. Type "DELETE" to confirm.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="DELETE"
                    />

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