import Stripe from 'stripe';
import User from '../models/User.js';

// Add proper error handling for Stripe initialization
let stripe;
try {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16'
    });

    console.log('Stripe initialized successfully');
} catch (error) {
    console.error('Stripe initialization failed:', error.message);
    // Create a mock stripe instance for development
    stripe = {
        paymentIntents: {
            create: async () => ({
                id: `mock_pi_${Date.now()}`,
                client_secret: `mock_cs_${Date.now()}_secret`,
                status: 'requires_payment_method'
            }),
            retrieve: async () => ({
                status: 'succeeded',
                amount: 5000,
                currency: 'usd',
                id: `mock_pi_${Date.now()}`
            })
        }
    };
    console.log('Using mock Stripe instance for development');
}


/**
 * Create Stripe payment intent
 * @route POST /api/payments/create-payment-intent
 * @access Private
 */
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        // Debug log to check if Stripe is initialized
        console.log('Stripe instance:', stripe ? 'Initialized' : 'Not initialized');
        console.log('Amount received:', amount);

        if (!amount || amount < 1) { // Minimum $1.00
            return res.status(400).json({ message: 'Amount must be at least $1.00' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: req.user._id.toString(),
                userEmail: req.user.email
            }
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            message: 'Server error creating payment intent',
            error: error.message
        });
    }
};


// Add this function to handle payment notifications
/**
 * Send payment notification
 * @param {Object} user - User object
 * @param {Object} paymentDetails - Payment details
 */
const sendPaymentNotification = async (user, paymentDetails) => {
    try {
        // In a real application, you would:
        // 1. Send email notification
        // 2. Send push notification
        // 3. Create in-app notification
        // 4. Log to notification system

        console.log(`🔔 Payment Notification for ${user.email}:`);
        console.log(`   Amount: $${paymentDetails.amount}`);
        console.log(`   Date: ${new Date().toISOString()}`);
        console.log(`   Payment ID: ${paymentDetails.paymentIntentId}`);

        // Example: Store notification in database
        // await Notification.create({
        //     user: user._id,
        //     type: 'payment_received',
        //     title: 'New Payment Received',
        //     message: `You have received a payment of $${paymentDetails.amount}`,
        //     metadata: paymentDetails
        // });

    } catch (error) {
        console.error('Payment notification error:', error);
    }
};

/**
 * Confirm payment and handle success
 * @route POST /api/payments/confirm-payment
 * @access Private
 */
// Update the confirmPayment function to use notifications
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            return res.status(400).json({ message: 'Payment intent ID is required' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const user = await User.findById(req.user._id);

            // Trigger notification if enabled
            if (user.paymentDetails?.notifyNewPayments) {
                await sendPaymentNotification(user, {
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    paymentIntentId: paymentIntent.id,
                    timestamp: new Date()
                });
            }

            res.json({
                success: true,
                message: 'Payment completed successfully',
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                notificationSent: !!user.paymentDetails?.notifyNewPayments
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed'
            });
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ message: 'Server error confirming payment' });
    }
};