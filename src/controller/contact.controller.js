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

    await newContact.save();

    // Send contact notification email to admin (non-blocking)
    try {
        const emailService = getEmailService();
        emailService.sendEmail(
            process.env.SUPPORT_EMAIL || 'support@example.com',
            `New Contact Message from ${name}`,
            `<h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>`
        ).then(result => {
            if (result.success) {
                console.log(`✓ Contact notification sent to admin`);
            } else {
                console.error(`✗ Failed to send contact notification:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending contact notification email:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully.',
      data: newContact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
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
