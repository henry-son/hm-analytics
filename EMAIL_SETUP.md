# 📧 Email Notifications Setup Guide

## Overview
When users submit the **Contact Form** or **Subscribe to Newsletter**, the admin automatically receives email notifications about:
- **Contact submissions**: Name, email, message from inquiries
- **Newsletter signups**: Email addresses of new subscribers

---

## ✅ How It Works

### Without Configuration (Demo Mode)
- ✅ Forms still work perfectly
- ✅ Success modals appear to users
- ✅ Data logs to browser console
- ❌ Admin doesn't receive emails

### With EmailJS Configuration (Recommended)
- ✅ Forms work perfectly
- ✅ Success modals appear to users
- ✅ Data logs to console
- ✅ **Admin receives email notifications automatically**

---

## 🚀 Setup Instructions (5 Minutes)

### Step 1: Create EmailJS Account (FREE)

1. Visit: https://www.emailjs.com/
2. Click **"Sign Up Free"**
3. Create account with your email
4. Verify email

---

### Step 2: Get Your Credentials

After login, go to your **Dashboard** and find:

#### A. Service ID
- Click **"Email Services"** → **"Add Service"** → Select **"Gmail"** or **"SMTP"**
- Copy the **Service ID** (format: `service_xxxxxxxxxxxxxxx`)

#### B. Public Key
- Go to **Account** → **API Keys**
- Copy your **Public Key** (format: `xxxxxxxxxxxxxxxxxxxxxxxx`)

#### C. Template IDs
We'll create these next...

---

### Step 3: Create Email Templates

#### Template 1: Contact Form Notification

1. Go to **Email Templates** → **"Create New Template"**
2. Name it: `template_contact`
3. Set recipient: `{{to_email}}`
4. Subject: `New Contact Form: {{from_name}}`
5. Email body:
```
New Message from: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent via HM Analytics Contact Form
```

6. **Save Template** → Copy the **Template ID** (format: `template_xxxxxxx`)

#### Template 2: Newsletter Subscription

1. Go to **Email Templates** → **"Create New Template"**
2. Name it: `template_newsletter`
3. Set recipient: `{{to_email}}`
4. Subject: `New Newsletter Subscriber: {{subscriber_email}}`
5. Email body:
```
New subscriber added!

Email: {{subscriber_email}}
Date: {{date}}

You can now add them to your mailing list or send them a welcome email.

---
HM Analytics Newsletter
```

6. **Save Template** → Copy the **Template ID** (format: `template_xxxxxxx`)

---

### Step 4: Update Your Website Code

Open: `assets/js/script.js`

Find these lines (around line 6-10):
```javascript
const EMAILJS_SERVICE_ID = 'service_hm_analytics'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_contact'; // Replace with your template ID
const EMAILJS_TEMPLATE_ID_NEWSLETTER = 'template_newsletter'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // Replace with your public key
```

Replace with YOUR credentials:
```javascript
const EMAILJS_SERVICE_ID = 'service_abcd1234efgh5678'; // Your service ID
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_contact_xyz123'; // Your contact template ID
const EMAILJS_TEMPLATE_ID_NEWSLETTER = 'template_newsletter_abc456'; // Your newsletter template ID
const EMAILJS_PUBLIC_KEY = 'your1234public5678key9012here'; // Your public key
```

---

### Step 5: Test It!

1. Go to **http://localhost:8001**
2. Try the **Contact Form** at the bottom
3. Fill in: name, email, message
4. Click **Send Message**
5. Check your email (hmanalyticsagency@gmail.com)
6. You should receive the notification email! ✅

---

## 🔒 Security Notes

- ✅ EmailJS handles all email safely
- ✅ Public Key is meant to be public (on frontend)
- ✅ User data is only sent to EmailJS, then to your email
- ✅ EmailJS is GDPR compliant
- ✅ You can always revoke your Public Key from EmailJS dashboard

---

## 📊 EmailJS Free Tier Limits

- ✅ 200 emails per month (FREE)
- ✅ Great for small to medium websites
- ✅ Paid plans available if you need more

---

## ✨ What Users See

### Contact Form Success
```
✓ Message Received!

Thank you, John! We've received your message and will get back to you 
shortly at john@example.com.

We typically respond within 24 hours. Our team has been notified and 
will review your request.
```

### Newsletter Success
```
✓ Subscription Confirmed!

Welcome! We've sent a confirmation email to jane@example.com.

You'll now receive our monthly insights, case studies, and analytics tips.

Check your inbox for our latest report: "2024 Kenyan Market Trends"
```

---

## 🆘 Troubleshooting

### "I'm not receiving emails"
1. Check EmailJS dashboard - verify service is active
2. Check spam/promotions folder
3. Verify Public Key is correct in `script.js`
4. Open browser console (F12) → check for error messages

### "I forgot my EmailJS credentials"
1. Log into https://www.emailjs.com/
2. Go to **Account** → **API Keys** for Public Key
3. Go to **Email Services** for Service ID
4. Go to **Email Templates** to find Template IDs

### "I want to change the email recipient"
In templates, change `{{to_email}}` to your actual email, or keep it as variable for flexibility.

---

## 📞 Support

- EmailJS Help: https://www.emailjs.com/docs/
- HM Analytics: hmanalyticsagency@gmail.com
- Phone: +254 793802464

---

## ✅ Checklist

- [ ] Created EmailJS account
- [ ] Got Service ID
- [ ] Got Public Key
- [ ] Created Contact Template (got Template ID)
- [ ] Created Newsletter Template (got Template ID)
- [ ] Updated `script.js` with all credentials
- [ ] Tested contact form
- [ ] Received email notification ✓
- [ ] Tested newsletter signup
- [ ] Received subscription notification ✓

**Once all checked, you're ready to deploy! 🚀**
