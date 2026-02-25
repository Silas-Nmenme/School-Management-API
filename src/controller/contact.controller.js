const Contact = require('../models/contact.schema.js');
const { getEmailService } = require("../emails/service.js");

// Create a new contact message
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    // Create new contact
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save to database
    const savedContact = await newContact.save();
    console.log('✓ Contact saved to database:', savedContact._id);

    // Send emails (non-blocking) - don't await to avoid blocking response
    const emailService = getEmailService();
    
    // Check if email credentials are configured
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    if (isEmailConfigured) {
      // Send confirmation email to the user (recipient)
      emailService.sendContactConfirmationEmail({
        name,
        email,
        subject,
        message
      }).then(result => {
        if (result.success) {
          console.log(`✓ Contact confirmation sent to ${email}`);
        } else {
          console.error(`✗ Failed to send contact confirmation:`, result.error);
        }
      }).catch(emailError => {
        console.error("✗ Error sending contact confirmation email:", emailError.message || emailError);
      });

      // Send notification email to admin
      emailService.sendAdminContactNotificationEmail(
        process.env.SUPPORT_EMAIL || 'support@example.com',
        {
          name,
          email,
          subject,
          message
        }
      ).then(result => {
        if (result.success) {
          console.log(`✓ Contact notification sent to admin at ${process.env.SUPPORT_EMAIL || 'support@example.com'}`);
        } else {
          console.error(`✗ Failed to send contact notification:`, result.error);
        }
      }).catch(emailError => {
        console.error("✗ Error sending admin contact notification email:", emailError.message || emailError);
      });
    } else {
      console.warn("⚠️ Email credentials not configured. Skipping email sending.");
    }

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully.',
      data: savedContact
    });
  } catch (error) {
    console.error('✗ Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message.'
    });
  }
};

// Get all contacts (for admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts.'
    });
  }
};

module.exports = {
  createContact,
  getAllContacts
};
