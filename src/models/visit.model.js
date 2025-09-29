const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    visitTime: {
        type: String,
        required: true,
        enum: ['morning', 'afternoon', 'evening']
    },
    visitType: {
        type: String,
        required: true,
        enum: ['individual', 'group', 'virtual']
    },
    groupSize: {
        type: Number,
        min: 1,
        max: 50,
        default: 1
    },
    interests: [{
        type: String,
        enum: ['undergraduate', 'graduate', 'transfer', 'international', 'campus_tour', 'admissions_info', 'financial_aid', 'housing', 'academic_programs']
    }],
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
visitSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
visitSchema.index({ visitDate: 1, status: 1 });
visitSchema.index({ email: 1 });

module.exports = mongoose.model('Visit', visitSchema);
