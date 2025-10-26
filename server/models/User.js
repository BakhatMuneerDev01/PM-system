import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const PaymentDetailsSchema = new mongoose.Schema({
    enableAutoPayout: { type: Boolean, default: false },
    notifyNewPayments: { type: Boolean, default: false },
    cardHolderName: { type: String },
    creditCardNumber: { type: String }, // In a real app, this would be tokenized/encrypted
    country: { type: String },
});

const userSchema = new mongoose.Schema({
    fullName: { type: String },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profileImage: {
        type: String,
        default: null, // ✅ FIX: Changed from invalid URL to null
    },
    role: { type: String, enum: ['admin', 'doctor'], default: 'admin' },
    phoneNumber: { type: String },
    paymentDetails: PaymentDetailsSchema
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

const User = mongoose.model("User", userSchema);
export default User;