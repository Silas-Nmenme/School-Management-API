const Visit = require('../models/visit.model');
const { getEmailService } = require('../templates/email-service-instance');

// Create a new visit request
const createVisit = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            visitDate,
            visitTime,
            visitType,
            groupSize,
            interests,
            message
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !visitDate || !visitTime || !visitType) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Validate visit date is in the future
        const visitDateTime = new Date(visitDate);
        const now = new Date();
        if (visitDateTime <= now) {
            return res.status(400).json({
                success: false,
                message: 'Visit date must be in the future'
            });
        }

        // Create visit request
        const visit = new Visit({
            firstName,
            lastName,
            email,
            phone,
            visitDate: visitDateTime,
            visitTime,
            visitType,
            groupSize: groupSize || 1,
            interests: interests || [],
            message
        });

        await visit.save();

        // Send confirmation email to visitor
        try {
            const emailService = getEmailService();
            await emailService.sendVisitConfirmationEmail(visit);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        // Send notification email to admin
        try {
            const emailService = getEmailService();
            await emailService.sendVisitNotificationEmail(visit);
        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Visit request submitted successfully',
            data: {
                id: visit._id,
                status: visit.status,
                submittedAt: visit.submittedAt
            }
        });

    } catch (error) {
        console.error('Error creating visit request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit visit request',
            error: error.message
        });
    }
};

// Get all visit requests (admin only)
const getAllVisits = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, sortBy = 'visitDate', sortOrder = 'asc' } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const visits = await Visit.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Visit.countDocuments(query);

        res.json({
            success: true,
            data: visits,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalVisits: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch visit requests',
            error: error.message
        });
    }
};

// Get visit by ID
const getVisitById = async (req, res) => {
    try {
        const { id } = req.params;

        const visit = await Visit.findById(id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit request not found'
            });
        }

        res.json({
            success: true,
            data: visit
        });

    } catch (error) {
        console.error('Error fetching visit:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch visit request',
            error: error.message
        });
    }
};

// Update visit status (admin only)
const updateVisitStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const visit = await Visit.findByIdAndUpdate(
            id,
            {
                status,
                adminNotes,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit request not found'
            });
        }

        // Send status update email to visitor
        try {
            const emailService = getEmailService();
            await emailService.sendVisitStatusUpdateEmail(visit);
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }

        res.json({
            success: true,
            message: 'Visit status updated successfully',
            data: visit
        });

    } catch (error) {
        console.error('Error updating visit status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update visit status',
            error: error.message
        });
    }
};

// Delete visit request (admin only)
const deleteVisit = async (req, res) => {
    try {
        const { id } = req.params;

        const visit = await Visit.findByIdAndDelete(id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit request not found'
            });
        }

        // Send visit deletion notification email to visitor (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendVisitDeletionEmail(visit).catch(emailError => {
                console.error('Failed to send visit deletion email:', emailError);
                // Don't fail the deletion if email fails
            });
        } catch (emailInitError) {
            console.error('Email service not available:', emailInitError.message);
        }

        res.json({
            success: true,
            message: 'Visit request deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting visit:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete visit request',
            error: error.message
        });
    }
};

// Get visit statistics (admin only)
const getVisitStats = async (req, res) => {
    try {
        const stats = await Visit.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalVisits = await Visit.countDocuments();
        const upcomingVisits = await Visit.countDocuments({
            visitDate: { $gte: new Date() },
            status: { $in: ['pending', 'confirmed'] }
        });

        res.json({
            success: true,
            data: {
                totalVisits,
                upcomingVisits,
                statusBreakdown: stats
            }
        });

    } catch (error) {
        console.error('Error fetching visit stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch visit statistics',
            error: error.message
        });
    }
};

module.exports = {
    createVisit,
    getAllVisits,
    getVisitById,
    updateVisitStatus,
    deleteVisit,
    getVisitStats
};
