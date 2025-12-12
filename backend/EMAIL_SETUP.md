# Email Configuration Setup

To enable password reset functionality, you need to configure email settings in your `.env` file.

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to `.env` file**:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## Other Email Providers

You can modify `backend/utils/emailService.js` to use other email services like:
- Outlook/Hotmail
- Yahoo
- Custom SMTP server

Example for custom SMTP:
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
```

## Testing

After configuration, test the forgot password feature:
1. Go to Login page
2. Click "Forgot Password?"
3. Enter your email
4. Check your email for the OTP

