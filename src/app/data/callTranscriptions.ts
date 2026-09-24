export interface CallTranscriptEntry {
  id: string;
  speaker: 'Agent' | 'Customer';
  text: string;
  timestamp: string;
}

export interface CallTranscriptData {
  callId: string;
  duration: string;
  summary: string;
  transcript: CallTranscriptEntry[];
  date?: string;
  time?: string;
  callType?: string;
}

// Mock call transcription database - each call has unique transcription
export const CALL_TRANSCRIPTIONS: Record<string, CallTranscriptData> = {
  'call-1': {
    callId: 'call-1',
    duration: '13m 0s',
    date: 'Feb 2, 2026',
    time: '2:25 PM',
    callType: 'Outbound',
    summary: '', // Empty summary - needs to be generated
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello, this is calling from customer support. Am I speaking with Priya Sharma?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Yes, this is Priya. How can I help you?', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'Hi Priya! I\'m following up on your recent inquiry about your order. I wanted to provide you with an update.', timestamp: '00:12' },
      { id: '4', speaker: 'Customer', text: 'Oh great! I\'ve been waiting to hear back. What\'s the status?', timestamp: '00:20' },
      { id: '5', speaker: 'Agent', text: 'Good news! Your order has been processed and is ready for shipment. It will be dispatched today and should arrive within 3-5 business days.', timestamp: '00:26' },
      { id: '6', speaker: 'Customer', text: 'That\'s wonderful! Will I receive tracking information?', timestamp: '00:40' },
      { id: '7', speaker: 'Agent', text: 'Absolutely! You\'ll receive an email with the tracking number as soon as the package is picked up by the courier, which should be later today.', timestamp: '00:45' },
      { id: '8', speaker: 'Customer', text: 'Perfect! Thank you so much for the update. I really appreciate you calling me.', timestamp: '00:58' },
      { id: '9', speaker: 'Agent', text: 'You\'re very welcome, Priya! Is there anything else I can help you with today?', timestamp: '01:06' },
      { id: '10', speaker: 'Customer', text: 'No, that\'s all I needed. Thanks again!', timestamp: '01:12' },
      { id: '11', speaker: 'Agent', text: 'Great! Have a wonderful day and thank you for being a valued customer.', timestamp: '01:16' }
    ]
  },
  'hist-1': {
    callId: 'hist-1',
    duration: '0m 15s',
    date: 'Feb 2, 2026',
    time: '2:30 PM',
    callType: 'Inbound',
    summary: '', // Empty summary - needs to be generated
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello, thank you for calling. This is Sarah speaking, how can I help you today?', timestamp: '00:01' },
      { id: '2', speaker: 'Customer', text: 'Hi Sarah, I just wanted to quickly check on...', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'Of course! Let me look that up for you right away.', timestamp: '00:13' }
    ]
  },
  'hist-2': {
    callId: 'hist-2',
    duration: '5m 32s',
    date: 'Feb 2, 2026',
    time: '10:15 AM',
    callType: 'Outbound',
    summary: 'Customer called regarding a billing discrepancy on their recent invoice. Agent reviewed the account and identified an incorrect charge. The issue was resolved by issuing a credit adjustment and the customer was satisfied with the resolution.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello, thank you for calling. How can I assist you today?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi, I noticed a charge on my invoice that doesn\'t look right. Can you help me understand it?', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'Of course! I\'d be happy to help you with that. Can you tell me which charge you\'re referring to?', timestamp: '00:15' },
      { id: '4', speaker: 'Customer', text: 'It\'s the $45.99 charge listed as "Service Fee". I don\'t remember signing up for any additional services.', timestamp: '00:22' },
      { id: '5', speaker: 'Agent', text: 'Let me pull up your account and take a look at that charge. One moment please.', timestamp: '00:35' },
      { id: '6', speaker: 'Customer', text: 'Thank you.', timestamp: '00:42' },
      { id: '7', speaker: 'Agent', text: 'I\'ve reviewed your account and I can see that charge was applied in error. You\'re absolutely right - you didn\'t sign up for that service. I apologize for the confusion.', timestamp: '00:48' },
      { id: '8', speaker: 'Customer', text: 'Oh good, I was worried I had missed something. So what happens now?', timestamp: '01:05' },
      { id: '9', speaker: 'Agent', text: 'I\'m going to issue a credit adjustment right away. The $45.99 will be refunded to your account within 3-5 business days.', timestamp: '01:12' },
      { id: '10', speaker: 'Customer', text: 'Perfect! Thank you so much for your help.', timestamp: '01:28' },
      { id: '11', speaker: 'Agent', text: 'You\'re very welcome! Is there anything else I can help you with today?', timestamp: '01:33' },
      { id: '12', speaker: 'Customer', text: 'No, that\'s all. Thanks again!', timestamp: '01:40' }
    ]
  },
  'hist-3': {
    callId: 'hist-3',
    duration: '3m 12s',
    date: 'Feb 1, 2026',
    time: '4:45 PM',
    callType: 'Inbound',
    summary: 'Customer requested a callback for technical support regarding connectivity issues with their device. Agent scheduled a technical support callback for the next business day and provided the ticket reference number.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Good afternoon! Thanks for reaching out. How may I help you?', timestamp: '00:01' },
      { id: '2', speaker: 'Customer', text: 'Hi, I\'m having trouble connecting my device to your service. It keeps dropping the connection.', timestamp: '00:06' },
      { id: '3', speaker: 'Agent', text: 'I\'m sorry to hear that. Let me get some information to help troubleshoot this. What type of device are you using?', timestamp: '00:15' },
      { id: '4', speaker: 'Customer', text: 'It\'s a Samsung Galaxy S21. The connection drops every few minutes.', timestamp: '00:23' },
      { id: '5', speaker: 'Agent', text: 'I understand how frustrating that must be. Based on your description, this might require our technical support team. Would you like me to schedule a callback from them?', timestamp: '00:32' },
      { id: '6', speaker: 'Customer', text: 'Yes, that would be great. When can they call me back?', timestamp: '00:48' },
      { id: '7', speaker: 'Agent', text: 'I can schedule a callback for tomorrow morning between 9 AM and 12 PM. Does that work for you?', timestamp: '00:53' },
      { id: '8', speaker: 'Customer', text: 'Yes, that works perfectly.', timestamp: '01:02' },
      { id: '9', speaker: 'Agent', text: 'Great! I\'ve created ticket #TS-2026-4521 for you. Our technical team will call you tomorrow morning at this number.', timestamp: '01:06' },
      { id: '10', speaker: 'Customer', text: 'Thank you so much for your help!', timestamp: '01:20' }
    ]
  },
  'hist-5': {
    callId: 'hist-5',
    duration: '8m 45s',
    date: 'Jan 31, 2026',
    time: '2:10 PM',
    callType: 'Outbound',
    summary: 'Customer inquired about upgrading their subscription plan. Agent explained the different plan options, pricing, and benefits. Customer decided to upgrade to the Premium plan, which was processed during the call.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Thank you for calling! This is Sarah. How can I help you today?', timestamp: '00:03' },
      { id: '2', speaker: 'Customer', text: 'Hi Sarah! I\'m interested in upgrading my subscription. Can you tell me about the different plans?', timestamp: '00:09' },
      { id: '3', speaker: 'Agent', text: 'Absolutely! I\'d be happy to walk you through our plan options. Currently, you\'re on our Basic plan at $9.99 per month. We also offer Standard at $19.99 and Premium at $29.99.', timestamp: '00:18' },
      { id: '4', speaker: 'Customer', text: 'What are the differences between these plans?', timestamp: '00:35' },
      { id: '5', speaker: 'Agent', text: 'Great question! The Standard plan includes everything in Basic, plus priority support and advanced features. Premium includes all of that, plus unlimited storage and team collaboration tools.', timestamp: '00:41' },
      { id: '6', speaker: 'Customer', text: 'The Premium plan sounds interesting. Does it include the analytics dashboard too?', timestamp: '01:02' },
      { id: '7', speaker: 'Agent', text: 'Yes! Premium includes our full analytics dashboard with custom reporting and data export features.', timestamp: '01:09' },
      { id: '8', speaker: 'Customer', text: 'Perfect! That\'s exactly what I need for my business. How do I upgrade?', timestamp: '01:18' },
      { id: '9', speaker: 'Agent', text: 'I can process that upgrade for you right now. You\'ll be charged the prorated difference for this month, and then $29.99 monthly going forward. Should I go ahead?', timestamp: '01:25' },
      { id: '10', speaker: 'Customer', text: 'Yes, please go ahead with the upgrade.', timestamp: '01:42' },
      { id: '11', speaker: 'Agent', text: 'Great! I\'m processing that now... All set! Your account has been upgraded to Premium. You\'ll have immediate access to all Premium features.', timestamp: '01:48' },
      { id: '12', speaker: 'Customer', text: 'Wonderful! Thank you for making this so easy.', timestamp: '02:05' },
      { id: '13', speaker: 'Agent', text: 'You\'re very welcome! Is there anything else I can help you with today?', timestamp: '02:10' },
      { id: '14', speaker: 'Customer', text: 'No, that\'s everything. Thanks again!', timestamp: '02:16' }
    ]
  },
  'hist-6': {
    callId: 'hist-6',
    duration: '4m 12s',
    date: 'Feb 2, 2026',
    time: '12:00 PM',
    callType: 'Outbound',
    summary: 'Customer called to update their payment method. Agent guided them through the process and successfully updated the payment information on file.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello! Thank you for calling. How can I assist you?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi, I need to update my credit card information. My old card expired.', timestamp: '00:07' },
      { id: '3', speaker: 'Agent', text: 'No problem! I can help you with that. For security purposes, can you verify your account email address?', timestamp: '00:14' },
      { id: '4', speaker: 'Customer', text: 'Sure, it\'s marcus.allen@email.com', timestamp: '00:22' },
      { id: '5', speaker: 'Agent', text: 'Perfect, thank you. I\'ll send you a secure link via email where you can update your payment method. It\'s the safest way to handle payment information.', timestamp: '00:28' },
      { id: '6', speaker: 'Customer', text: 'That sounds good. How long will it take to arrive?', timestamp: '00:42' },
      { id: '7', speaker: 'Agent', text: 'You should receive it within the next minute or two. The link will be valid for 24 hours.', timestamp: '00:47' },
      { id: '8', speaker: 'Customer', text: 'Great! Just got it. I\'ll update it right now.', timestamp: '01:05' },
      { id: '9', speaker: 'Agent', text: 'Wonderful! Take your time. I\'ll stay on the line if you need any help.', timestamp: '01:11' },
      { id: '10', speaker: 'Customer', text: 'All done! I\'ve submitted the new card information.', timestamp: '01:48' },
      { id: '11', speaker: 'Agent', text: 'Perfect! I can see the update has been processed. Your new payment method is now active on your account.', timestamp: '01:54' },
      { id: '12', speaker: 'Customer', text: 'Thank you for your help!', timestamp: '02:08' }
    ]
  },
  'hist-8': {
    callId: 'hist-8',
    duration: '2m 30s',
    date: 'Jan 30, 2026',
    time: '11:15 AM',
    callType: 'Inbound',
    summary: 'Brief call where customer confirmed their appointment for next week. Agent verified the date, time, and location details.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Good morning! Thanks for calling. How can I help you?', timestamp: '00:01' },
      { id: '2', speaker: 'Customer', text: 'Hi, I just wanted to confirm my appointment for next week.', timestamp: '00:06' },
      { id: '3', speaker: 'Agent', text: 'Of course! Let me pull up your appointment. Can I have your name please?', timestamp: '00:11' },
      { id: '4', speaker: 'Customer', text: 'It\'s Marcus Allen.', timestamp: '00:17' },
      { id: '5', speaker: 'Agent', text: 'Thank you, Marcus. I have your appointment scheduled for next Tuesday, January 30th at 2:00 PM. Is that correct?', timestamp: '00:21' },
      { id: '6', speaker: 'Customer', text: 'Yes, that\'s right. And it\'s at your downtown location?', timestamp: '00:32' },
      { id: '7', speaker: 'Agent', text: 'Correct! 123 Main Street, downtown location. You\'re all confirmed.', timestamp: '00:37' },
      { id: '8', speaker: 'Customer', text: 'Perfect! See you then.', timestamp: '00:45' },
      { id: '9', speaker: 'Agent', text: 'Great! We\'ll see you next Tuesday. Have a wonderful day!', timestamp: '00:48' }
    ]
  },
  'hist-10': {
    callId: 'hist-10',
    duration: '6m 15s',
    date: 'Jan 31, 2026',
    time: '1:20 PM',
    callType: 'Outbound',
    summary: 'Customer reported an issue with product quality. Agent initiated a return process and arranged for a replacement to be sent with expedited shipping.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello! Thank you for calling. This is Lisa. How may I help you today?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi Lisa, I received my order yesterday but there\'s a problem with one of the items.', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'I\'m sorry to hear that. Can you tell me more about the issue?', timestamp: '00:16' },
      { id: '4', speaker: 'Customer', text: 'The product seems damaged. There\'s a crack on the side and it\'s not working properly.', timestamp: '00:22' },
      { id: '5', speaker: 'Agent', text: 'I apologize for that experience. That\'s definitely not the quality we stand for. Do you have your order number handy?', timestamp: '00:32' },
      { id: '6', speaker: 'Customer', text: 'Yes, it\'s ORDER-2026-8876.', timestamp: '00:42' },
      { id: '7', speaker: 'Agent', text: 'Thank you. I\'m going to process a return and send you a replacement right away with expedited shipping at no extra cost.', timestamp: '00:48' },
      { id: '8', speaker: 'Customer', text: 'That would be great! Do I need to send the damaged one back?', timestamp: '01:02' },
      { id: '9', speaker: 'Agent', text: 'Yes, I\'ll email you a prepaid shipping label within the next hour. Just pack it up and drop it off at any shipping location.', timestamp: '01:08' },
      { id: '10', speaker: 'Customer', text: 'When should I expect the replacement?', timestamp: '01:22' },
      { id: '11', speaker: 'Agent', text: 'With expedited shipping, it should arrive within 2 business days. You\'ll receive tracking information via email.', timestamp: '01:27' },
      { id: '12', speaker: 'Customer', text: 'Excellent! Thank you for handling this so quickly.', timestamp: '01:40' },
      { id: '13', speaker: 'Agent', text: 'You\'re very welcome! Again, I apologize for the inconvenience. Is there anything else I can help with?', timestamp: '01:46' },
      { id: '14', speaker: 'Customer', text: 'No, that\'s all. Thanks again!', timestamp: '01:58' }
    ]
  },
  'hist-11': {
    callId: 'hist-11',
    duration: '3m 45s',
    date: 'Jan 30, 2026',
    time: '10:00 AM',
    callType: 'Inbound',
    summary: 'Customer asked about warranty coverage for their product. Agent explained the warranty terms and confirmed the item is still under warranty for another 8 months.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Good afternoon! How can I help you today?', timestamp: '00:01' },
      { id: '2', speaker: 'Customer', text: 'Hi, I have a question about the warranty on a product I purchased last year.', timestamp: '00:06' },
      { id: '3', speaker: 'Agent', text: 'I\'d be happy to help with that. Can you tell me which product you\'re asking about?', timestamp: '00:14' },
      { id: '4', speaker: 'Customer', text: 'It\'s the X-Series 5000 model. I bought it in April last year.', timestamp: '00:20' },
      { id: '5', speaker: 'Agent', text: 'Great! The X-Series 5000 comes with our standard 2-year warranty. Since you purchased in April 2025, your warranty is active until April 2027.', timestamp: '00:28' },
      { id: '6', speaker: 'Customer', text: 'Oh perfect! So I have about 8 more months. What does the warranty cover exactly?', timestamp: '00:42' },
      { id: '7', speaker: 'Agent', text: 'The warranty covers any manufacturing defects, malfunctions, and hardware failures. It includes free repairs or replacement if needed.', timestamp: '00:50' },
      { id: '8', speaker: 'Customer', text: 'That\'s good to know. If I do need service, what\'s the process?', timestamp: '01:02' },
      { id: '9', speaker: 'Agent', text: 'Just give us a call or submit a request online. We\'ll either send you a prepaid shipping label or arrange for an in-home service, depending on the issue.', timestamp: '01:08' },
      { id: '10', speaker: 'Customer', text: 'Excellent! Thank you for the information.', timestamp: '01:25' },
      { id: '11', speaker: 'Agent', text: 'You\'re welcome! Is there anything else I can help you with today?', timestamp: '01:30' },
      { id: '12', speaker: 'Customer', text: 'No, that answered my question. Thanks!', timestamp: '01:36' }
    ]
  },
  'hist-14': {
    callId: 'hist-14',
    duration: '7m 20s',
    date: 'Jan 29, 2026',
    time: '4:00 PM',
    callType: 'Inbound',
    summary: 'Customer called about account security concerns after receiving a suspicious email. Agent verified the email was indeed fraudulent, advised on security best practices, and reset the customer\'s password as a precaution.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello, thank you for calling our security line. How can I assist you?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi, I received an email that claims to be from your company asking me to verify my account. I\'m not sure if it\'s legitimate.', timestamp: '00:09' },
      { id: '3', speaker: 'Agent', text: 'I\'m glad you called to verify! Can you tell me what the email address it came from?', timestamp: '00:21' },
      { id: '4', speaker: 'Customer', text: 'It says it\'s from support@company-verify.net', timestamp: '00:28' },
      { id: '5', speaker: 'Agent', text: 'Thank you for checking! That is NOT a legitimate email from us. That\'s a phishing attempt. Please do not click any links in that email.', timestamp: '00:35' },
      { id: '6', speaker: 'Customer', text: 'Oh no! I haven\'t clicked anything yet. What should I do?', timestamp: '00:48' },
      { id: '7', speaker: 'Agent', text: 'You did exactly the right thing by calling us first. I recommend deleting the email and marking it as spam. Also, let\'s reset your password as a precaution.', timestamp: '00:54' },
      { id: '8', speaker: 'Customer', text: 'Yes, I\'d like to do that. How do we proceed?', timestamp: '01:08' },
      { id: '9', speaker: 'Agent', text: 'I\'ll send you a secure password reset link to your registered email address. Can you verify your email for me?', timestamp: '01:13' },
      { id: '10', speaker: 'Customer', text: 'It\'s sarah.johnson@email.com', timestamp: '01:22' },
      { id: '11', speaker: 'Agent', text: 'Perfect! I\'m sending that link now. You should receive it within a minute. Also, I want to give you some tips to spot phishing emails in the future.', timestamp: '01:27' },
      { id: '12', speaker: 'Customer', text: 'Yes, please! That would be helpful.', timestamp: '01:42' },
      { id: '13', speaker: 'Agent', text: 'Always check the sender\'s email address carefully. We only send emails from @company.com domains. Also, we\'ll never ask you to verify your account or enter your password via email link.', timestamp: '01:47' },
      { id: '14', speaker: 'Customer', text: 'Got it. I\'ll be more careful. I just received the password reset email.', timestamp: '02:08' },
      { id: '15', speaker: 'Agent', text: 'Great! Take a moment to reset your password now. Make sure it\'s strong and unique.', timestamp: '02:15' },
      { id: '16', speaker: 'Customer', text: 'Done! Password updated successfully.', timestamp: '02:52' },
      { id: '17', speaker: 'Agent', text: 'Excellent! Your account is now secure. Is there anything else I can help you with?', timestamp: '02:57' },
      { id: '18', speaker: 'Customer', text: 'No, that\'s everything. Thank you so much for your help!', timestamp: '03:08' }
    ]
  },
  'hist-16': {
    callId: 'hist-16',
    duration: '5m 15s',
    date: 'Feb 1, 2026',
    time: '11:00 AM',
    callType: 'Inbound',
    summary: 'Customer inquired about bulk pricing for their business. Agent explained the business pricing tiers and scheduled a follow-up call with the sales team to discuss custom enterprise solutions.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Good morning! Thank you for calling. How may I assist you?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi! I\'m interested in getting pricing information for my business. We need multiple accounts.', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'Excellent! I\'d be happy to help with that. How many user accounts are you looking for?', timestamp: '00:17' },
      { id: '4', speaker: 'Customer', text: 'We need about 50 accounts initially, but we might expand to 100 within the next year.', timestamp: '00:24' },
      { id: '5', speaker: 'Agent', text: 'That\'s great! For that volume, you\'d qualify for our business tier pricing. Accounts 1-50 get a 20% discount, and 51-100 get 30% off.', timestamp: '00:33' },
      { id: '6', speaker: 'Customer', text: 'That sounds good. Are there any additional features included with business accounts?', timestamp: '00:48' },
      { id: '7', speaker: 'Agent', text: 'Yes! Business tier includes advanced admin controls, dedicated support, custom integrations, and training sessions for your team.', timestamp: '00:55' },
      { id: '8', speaker: 'Customer', text: 'Perfect. What about enterprise-level features? We might need custom solutions.', timestamp: '01:10' },
      { id: '9', speaker: 'Agent', text: 'For enterprise solutions, I\'d like to connect you with our business sales team. They can discuss custom packages and additional features specific to your needs.', timestamp: '01:17' },
      { id: '10', speaker: 'Customer', text: 'That would be great. When can they call me?', timestamp: '01:32' },
      { id: '11', speaker: 'Agent', text: 'I can schedule a call for you this week. What day works best?', timestamp: '01:37' },
      { id: '12', speaker: 'Customer', text: 'Thursday afternoon would be ideal.', timestamp: '01:44' },
      { id: '13', speaker: 'Agent', text: 'Perfect! I\'ve scheduled a call with our enterprise team for Thursday at 2 PM. They\'ll call you at this number and send a calendar invite.', timestamp: '01:49' },
      { id: '14', speaker: 'Customer', text: 'Excellent! Thank you for your help.', timestamp: '02:05' },
      { id: '15', speaker: 'Agent', text: 'You\'re very welcome! Is there anything else I can help you with today?', timestamp: '02:10' },
      { id: '16', speaker: 'Customer', text: 'No, that\'s all for now. Thanks again!', timestamp: '02:16' }
    ]
  },
  'hist-17': {
    callId: 'hist-17',
    duration: '4m 50s',
    date: 'Jan 31, 2026',
    time: '3:45 PM',
    callType: 'Outbound',
    summary: 'Customer reported slow performance issues with the application. Agent walked through troubleshooting steps including clearing cache and updating the app, which resolved the issue.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hello! Technical support. How can I help you today?', timestamp: '00:01' },
      { id: '2', speaker: 'Customer', text: 'Hi, the app has been running really slowly lately. It takes forever to load anything.', timestamp: '00:06' },
      { id: '3', speaker: 'Agent', text: 'I\'m sorry to hear that. Let\'s troubleshoot this together. First, can you tell me which device you\'re using?', timestamp: '00:15' },
      { id: '4', speaker: 'Customer', text: 'I\'m using an iPhone 12 with the latest iOS.', timestamp: '00:23' },
      { id: '5', speaker: 'Agent', text: 'Thank you. Let\'s try clearing the app cache first. Go to Settings, then scroll down to our app and tap on it.', timestamp: '00:28' },
      { id: '6', speaker: 'Customer', text: 'Okay, I\'m there.', timestamp: '00:40' },
      { id: '7', speaker: 'Agent', text: 'Great! You should see an option to "Clear Cache". Can you tap that and then restart the app?', timestamp: '00:44' },
      { id: '8', speaker: 'Customer', text: 'Done. Let me try opening it... It does seem a bit faster now.', timestamp: '01:02' },
      { id: '9', speaker: 'Agent', text: 'That\'s good! Also, let me check what version of the app you have. Can you go back to Settings and tell me the version number?', timestamp: '01:12' },
      { id: '10', speaker: 'Customer', text: 'It says version 3.2.1', timestamp: '01:24' },
      { id: '11', speaker: 'Agent', text: 'There\'s actually a newer version available - 3.3.0 - which includes performance improvements. Can you update the app from the App Store?', timestamp: '01:29' },
      { id: '12', speaker: 'Customer', text: 'Sure, I\'m downloading it now... Okay, it\'s updated.', timestamp: '01:52' },
      { id: '13', speaker: 'Agent', text: 'Perfect! Try using the app now and let me know how it performs.', timestamp: '02:05' },
      { id: '14', speaker: 'Customer', text: 'Wow, much better! It\'s loading quickly now. Thank you!', timestamp: '02:18' },
      { id: '15', speaker: 'Agent', text: 'That\'s great to hear! The update included some optimizations that should help. Anything else I can assist with?', timestamp: '02:25' },
      { id: '16', speaker: 'Customer', text: 'No, that fixed it. Thanks for your help!', timestamp: '02:38' }
    ]
  },
  // ── VoIP call records (external VoIP API channel) ──
  'voip-1': {
    callId: 'voip-1',
    duration: '6m 42s',
    date: 'Feb 3, 2026',
    time: '9:12 AM',
    callType: 'Outbound',
    summary: 'Agent placed an outbound VoIP call to walk the customer through activating their new number. The porting request was confirmed, an activation window of 24 hours was set, and the customer was advised to keep their current line active until the switch completes.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hi Priya, this is Jordan calling on our VoIP line about your new number activation. Is now a good time?', timestamp: '00:03' },
      { id: '2', speaker: 'Customer', text: 'Yes, perfect timing. I was hoping to get this sorted today.', timestamp: '00:10' },
      { id: '3', speaker: 'Agent', text: 'Great. I can see your porting request came through this morning. I just need to confirm the number you want to bring over ends in 4471, correct?', timestamp: '00:16' },
      { id: '4', speaker: 'Customer', text: 'That\'s right, 4471.', timestamp: '00:27' },
      { id: '5', speaker: 'Agent', text: 'Perfect. The activation window is 24 hours. Please keep your current line active until you see the switch complete on your end.', timestamp: '00:32' },
      { id: '6', speaker: 'Customer', text: 'Understood. Will I get a notification when it\'s live?', timestamp: '00:44' },
      { id: '7', speaker: 'Agent', text: 'Yes, you\'ll get an email and an in-app alert the moment it goes live. If anything looks off, just call this same line back.', timestamp: '00:49' },
      { id: '8', speaker: 'Customer', text: 'Sounds good. Thank you for the clear walkthrough.', timestamp: '01:02' },
      { id: '9', speaker: 'Agent', text: 'My pleasure! Talk soon, Priya.', timestamp: '01:07' }
    ]
  },
  'voip-2': {
    callId: 'voip-2',
    duration: '3m 05s',
    date: 'Feb 3, 2026',
    time: '11:48 AM',
    callType: 'Inbound',
    summary: '', // Empty summary - needs to be generated
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Thanks for calling, you\'ve reached the VoIP support desk. This is Astra, the AI assistant — how can I help?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi Astra, my calls keep dropping after about a minute on the new line.', timestamp: '00:07' },
      { id: '3', speaker: 'Agent', text: 'Sorry to hear that. That usually points to a network issue. Are you on Wi-Fi or a wired connection right now?', timestamp: '00:14' },
      { id: '4', speaker: 'Customer', text: 'Wi-Fi at the moment.', timestamp: '00:22' },
      { id: '5', speaker: 'Agent', text: 'Let\'s try switching your codec to the low-bandwidth profile — I can push that to your device now.', timestamp: '00:27' }
    ]
  },
  'voip-3': {
    callId: 'voip-3',
    duration: '8m 18s',
    date: 'Feb 2, 2026',
    time: '4:20 PM',
    callType: 'Outbound',
    summary: 'Outbound VoIP call to review the customer\'s monthly call usage and recommend a plan change. Agent identified that international minutes were driving overage charges and moved the customer to the Global bundle, reducing their projected monthly cost.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hi David, calling to go over your VoIP usage this month. You\'ve been running into overage charges — mind if I walk you through it?', timestamp: '00:03' },
      { id: '2', speaker: 'Customer', text: 'Please do, those charges caught me off guard.', timestamp: '00:11' },
      { id: '3', speaker: 'Agent', text: 'Most of it is international minutes to the UK and Germany. On your current plan those bill at a premium rate.', timestamp: '00:17' },
      { id: '4', speaker: 'Customer', text: 'Ah, that makes sense. We opened an office in Berlin last month.', timestamp: '00:28' },
      { id: '5', speaker: 'Agent', text: 'That explains it. Our Global bundle includes those destinations at a flat rate. Switching would actually lower your projected bill.', timestamp: '00:34' },
      { id: '6', speaker: 'Customer', text: 'Let\'s do that. Can you switch it today?', timestamp: '00:47' },
      { id: '7', speaker: 'Agent', text: 'Done — it\'s active immediately and I\'ve credited the overage from this cycle.', timestamp: '00:52' },
      { id: '8', speaker: 'Customer', text: 'Fantastic, thank you for catching that.', timestamp: '01:04' }
    ]
  },
  'voip-4': {
    callId: 'voip-4',
    duration: '2m 47s',
    date: 'Feb 1, 2026',
    time: '1:05 PM',
    callType: 'Inbound',
    summary: 'Customer called the VoIP line to set up simultaneous ring across their desk phone and mobile app. Agent enabled the feature and confirmed both devices rang on a test call.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'VoIP support, this is Maya. How can I help today?', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi Maya, I\'d like my desk phone and the mobile app to ring at the same time.', timestamp: '00:08' },
      { id: '3', speaker: 'Agent', text: 'Absolutely, that\'s our simultaneous ring feature. I can enable it on your extension right now.', timestamp: '00:15' },
      { id: '4', speaker: 'Customer', text: 'Great, go ahead.', timestamp: '00:23' },
      { id: '5', speaker: 'Agent', text: 'All set. Let\'s do a quick test call so you can confirm both devices ring.', timestamp: '00:27' },
      { id: '6', speaker: 'Customer', text: 'Both are ringing now. That\'s exactly what I wanted.', timestamp: '00:39' },
      { id: '7', speaker: 'Agent', text: 'Perfect! You\'re all set up. Have a great day.', timestamp: '00:44' }
    ]
  }  ,
  'voip-6': {
    callId: 'voip-6',
    duration: '4m 51s',
    date: 'Feb 2, 2026',
    time: '2:35 PM',
    callType: 'Inbound',
    summary: 'Caller reported one-way audio on outbound calls from the mobile app. Astra traced it to a restrictive NAT setting on the office router and walked through enabling SIP ALG passthrough. A test call confirmed two-way audio.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'VoIP support, this is Astra, the AI assistant. What can I help you with?', timestamp: '00:03' },
      { id: '2', speaker: 'Customer', text: 'When I call out from the mobile app, they can hear me but I can\'t hear them.', timestamp: '00:09' },
      { id: '3', speaker: 'Agent', text: 'That one-way audio almost always points at the network. Are you on the office Wi-Fi right now?', timestamp: '00:18' },
      { id: '4', speaker: 'Customer', text: 'Yes, and it works fine when I switch to cellular.', timestamp: '00:27' },
      { id: '5', speaker: 'Agent', text: 'That confirms it. Your router is blocking the return audio stream. I\'ll walk you through the setting.', timestamp: '00:34' },
      { id: '6', speaker: 'Customer', text: 'Okay, I have the admin page open.', timestamp: '00:48' },
      { id: '7', speaker: 'Agent', text: 'Enable SIP ALG passthrough, then save and let it reboot. It takes about a minute.', timestamp: '00:53' },
      { id: '8', speaker: 'Customer', text: 'Done. Let me try a call... I can hear you both ways now.', timestamp: '02:41' },
      { id: '9', speaker: 'Agent', text: 'That\'s it. I\'ll note it on your account in case it comes back after a firmware update.', timestamp: '02:52' }
    ]
  },
  'voip-7': {
    callId: 'voip-7',
    duration: '11m 24s',
    date: 'Feb 2, 2026',
    time: '4:50 PM',
    callType: 'Outbound',
    summary: 'Agent called to review the account ahead of a 40-seat expansion. Discussed number porting timelines, per-seat pricing on the global bundle, and agreed to send a written quote. Customer wants to complete the move before end of quarter.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'Hi Addison, it\'s Maya from the VoIP team — is now still a good time?', timestamp: '00:04' },
      { id: '2', speaker: 'Customer', text: 'Perfect timing. We\'re adding about forty seats next quarter.', timestamp: '00:11' },
      { id: '3', speaker: 'Agent', text: 'Congratulations. Are those all in Toronto, or spread across offices?', timestamp: '00:19' },
      { id: '4', speaker: 'Customer', text: 'Roughly thirty here, ten in the London office.', timestamp: '00:26' },
      { id: '5', speaker: 'Agent', text: 'Then the global bundle is the right fit — international is included rather than metered.', timestamp: '00:33' },
      { id: '6', speaker: 'Customer', text: 'What happens to our existing numbers?', timestamp: '01:02' },
      { id: '7', speaker: 'Agent', text: 'We port them. Canadian numbers take about ten business days, UK closer to fifteen. No downtime — they cut over once everything is provisioned.', timestamp: '01:09' },
      { id: '8', speaker: 'Customer', text: 'That works. Can you put the pricing in writing?', timestamp: '03:20' },
      { id: '9', speaker: 'Agent', text: 'I\'ll send a quote with both tiers and the porting schedule today.', timestamp: '03:28' },
      { id: '10', speaker: 'Customer', text: 'Great. We want this done before end of quarter.', timestamp: '03:41' },
      { id: '11', speaker: 'Agent', text: 'Comfortably doable if we start the port in the next two weeks. I\'ll follow up Thursday.', timestamp: '03:47' }
    ]
  },
  'voip-9': {
    callId: 'voip-9',
    duration: '1m 39s',
    date: 'Feb 1, 2026',
    time: '3:15 PM',
    callType: 'Inbound',
    summary: 'Quick call to confirm the voicemail-to-email address on the account. Astra verified it and resent the most recent voicemail.',
    transcript: [
      { id: '1', speaker: 'Agent', text: 'VoIP support, this is Astra.', timestamp: '00:02' },
      { id: '2', speaker: 'Customer', text: 'Hi — my voicemails stopped arriving by email. Can you check the address on file?', timestamp: '00:06' },
      { id: '3', speaker: 'Agent', text: 'Of course. I have addison.smith@company.io — is that still right?', timestamp: '00:14' },
      { id: '4', speaker: 'Customer', text: 'That\'s the old one. It should be the .com domain now.', timestamp: '00:22' },
      { id: '5', speaker: 'Agent', text: 'Updated. I\'ll resend this morning\'s voicemail so you can confirm it lands.', timestamp: '00:31' },
      { id: '6', speaker: 'Customer', text: 'Got it. Thanks for the quick fix.', timestamp: '01:18' }
    ]
  }
};

// Default transcription for calls without specific data
export const DEFAULT_TRANSCRIPTION: CallTranscriptData = {
  callId: 'default',
  duration: '1m 15s',
  summary: 'Customer contacted support regarding a delayed order (ORDER-2024-001234). The issue was resolved by identifying a warehouse delay and providing tracking information for the package that shipped yesterday. The customer expressed satisfaction with the resolution and no follow-up is required.',
  transcript: [
    { id: '1', speaker: 'Agent', text: 'Hello, thank you for calling. How can I assist you today?', timestamp: '00:02' },
    { id: '2', speaker: 'Customer', text: 'Hi, I\'m calling about my recent order. I haven\'t received it yet and it\'s been over a week.', timestamp: '00:08' },
    { id: '3', speaker: 'Agent', text: 'I understand your concern. Let me look up your order details. Can you please provide me with your order number?', timestamp: '00:15' },
    { id: '4', speaker: 'Customer', text: 'Yes, it\'s ORDER-2024-001234.', timestamp: '00:23' },
    { id: '5', speaker: 'Agent', text: 'Thank you. I can see your order here. It looks like there was a delay in our warehouse. The good news is that your package was shipped yesterday and should arrive within 2-3 business days.', timestamp: '00:28' },
    { id: '6', speaker: 'Customer', text: 'Okay, that\'s a relief. Will I receive a tracking number?', timestamp: '00:45' },
    { id: '7', speaker: 'Agent', text: 'Absolutely! I\'m sending you the tracking information right now via email. You should receive it within the next few minutes. Is there anything else I can help you with today?', timestamp: '00:52' },
    { id: '8', speaker: 'Customer', text: 'No, that covers everything. Thank you so much for your help!', timestamp: '01:05' },
    { id: '9', speaker: 'Agent', text: 'You\'re very welcome! Have a great day and thank you for choosing our service.', timestamp: '01:10' }
  ]
};