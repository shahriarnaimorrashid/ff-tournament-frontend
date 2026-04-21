// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navbar
      "navbar.tournaments": "Tournaments",
      "navbar.dashboard": "Dashboard",
      "navbar.adminPanel": "Admin Panel",
      "navbar.login": "Login",
      "navbar.register": "Sign Up",
      "navbar.logout": "Logout",
      
      // Home page
      "home.title": "E-Sports Tournament Arena",
      "home.subtitle": "Join the battle, prove your skills!",
      "home.viewTournaments": "View Tournaments",
      "home.whyChoose": "Why Choose",
      "home.brandName": "E-Sports Arena",
      "home.feature1.title": "Pro Tournaments",
      "home.feature1.desc": "Join competitive tournaments with real prizes",
      "home.feature2.title": "10K+ Players",
      "home.feature2.desc": "Join a growing community of gamers",
      "home.feature3.title": "Secure Escrow",
      "home.feature3.desc": "Safe transactions with escrow protection",
      "home.feature4.title": "Daily Rewards",
      "home.feature4.desc": "Earn coins and exclusive rewards",
      "home.stats.tournaments": "Tournaments",
      "home.stats.players": "Active Players",
      "home.stats.prize": "Prize Distributed",
      "home.stats.satisfaction": "Satisfaction",
      
      // Auth (Login/Register)
      "auth.name": "Full Name",
      "auth.email": "Email Address",
      "auth.password": "Password",
      "auth.loginTitle": "Welcome Back",
      "auth.registerTitle": "Create Account",
      "auth.haveAccount": "Already have an account?",
      "auth.noAccount": "Don't have an account?",
      "auth.loginButton": "Sign In",
      "auth.registerButton": "Sign Up",
      "auth.loginSubtitle": "Sign in to your account",
      "auth.registerSubtitle": "Join the E-Sports Arena",
      
      // Tournaments page
      "tournaments.upcoming": "Upcoming Tournaments",
      "tournaments.game": "Game",
      "tournaments.date": "Date",
      "tournaments.prize": "Prize",
      "tournaments.participants": "Participants",
      "tournaments.viewDetails": "View Details",
      "tournaments.join": "Join Tournament",
      "tournaments.joined": "You are registered",
      "tournaments.full": "Full",
      "tournaments.description": "Description",
      "tournaments.registrationDeadline": "Registration Deadline",
      "tournaments.maxParticipants": "Max Participants",
      "tournaments.noTournaments": "No tournaments available right now.",
      "tournaments.checkBack": "Check back soon for exciting events!",
      
      // Admin Dashboard
      "admin.dashboard": "Admin Dashboard",
      "admin.createTournament": "Create New Tournament",
      "admin.edit": "Edit",
      "admin.delete": "Delete",
      "admin.title": "Title",
      "admin.description": "Description",
      "admin.maxParticipants": "Max Participants",
      "admin.create": "Create",
      "admin.update": "Update",
      "admin.cancel": "Cancel",
      "admin.actions": "Actions",
      "admin.allTournaments": "All Tournaments",
      
      // User Dashboard
      "dashboard.myTournaments": "My Registered Tournaments",
      "dashboard.noTournaments": "You haven't joined any tournament yet.",
      "dashboard.browseTournaments": "Browse Tournaments",
      
      // Profile
      "profile.tab.info": "Profile Info",
      "profile.tab.password": "Change Password",
      "profile.tab.tournaments": "My Tournaments",
      "profile.name": "Display Name",
      "profile.bio": "Bio",
      "profile.location": "Location",
      "profile.socialLinks": "Social Links",
      "profile.changePhoto": "Change Photo",
      "profile.save": "Save Changes",
      "profile.saved": "Profile saved!",
      "profile.photoUpdated": "Photo updated!",
      "profile.photoTooLarge": "Photo must be under 5MB",
      "profile.loadError": "Failed to load profile",
      "profile.passwordMismatch": "Passwords do not match",
      "profile.passwordChanged": "Password updated!",
      "profile.currentPassword": "Current Password",
      "profile.newPassword": "New Password",
      "profile.confirmPassword": "Confirm Password",
      "profile.updatePassword": "Update Password",
      "profile.noTournaments": "No registered tournaments yet.",
      "profile.facebook": "Facebook",
      "profile.instagram": "Instagram",
      "profile.whatsapp": "WhatsApp",
      
      // Wallet
      "wallet.balance": "Your Balance",
      "wallet.deposit": "Top Up E-Coins",
      "wallet.proceed": "Proceed",
      "wallet.history": "Transaction History",
      "wallet.noTransactions": "No transactions yet.",
      "wallet.loadError": "Failed to load wallet",
      "wallet.sendTo": "Send payment to",
      "wallet.sendSuffix": "via",
      "wallet.amount": "Amount",
      "wallet.mockNote": "⚠️ Development mode: Admin will approve manually.",
      "wallet.txRef": "Transaction Reference",
      "wallet.confirmDeposit": "Submit Request",
      "wallet.requestSent": "Request Submitted!",
      "wallet.adminApproval": "Admin will verify and credit your wallet.",
      "wallet.newDeposit": "Make another deposit",
      
      // Comments
      "comment.title": "Comments",
      "comment.placeholder": "Write a comment...",
      "comment.loginRequired": "Log in to comment",
      "comment.post": "Post",
      "comment.reply": "Reply",
      "comment.delete": "Delete",
      "comment.send": "Send",
      "comment.replyPlaceholder": "Write a reply...",
      "comment.confirmDelete": "Delete this comment?",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error occurred",
      "common.save": "Save",
      "common.confirm": "Confirm",
      "common.cancel": "Cancel",
      "common.back": "Back",
      "common.saving": "Saving...",
      "common.submitting": "Submitting..."
    }
  },
  bn: {
    translation: {
      // Navbar
      "navbar.tournaments": "টুর্নামেন্ট",
      "navbar.dashboard": "ড্যাশবোর্ড",
      "navbar.adminPanel": "অ্যাডমিন প্যানেল",
      "navbar.login": "লগইন",
      "navbar.register": "সাইন আপ",
      "navbar.logout": "লগআউট",
      
      // Home page
      "home.title": "ই-স্পোর্টস টুর্নামেন্ট এরিনা",
      "home.subtitle": "যুদ্ধে যোগ দিন, নিজের দক্ষতা প্রমাণ করুন!",
      "home.viewTournaments": "টুর্নামেন্ট দেখুন",
      "home.whyChoose": "কেন বেছে নেবেন",
      "home.brandName": "ই-স্পোর্টস এরিনা",
      "home.feature1.title": "প্রো টুর্নামেন্ট",
      "home.feature1.desc": "রিয়েল পুরস্কার সহ প্রতিযোগিতামূলক টুর্নামেন্টে যোগ দিন",
      "home.feature2.title": "১০ হাজারের বেশি খেলোয়াড়",
      "home.feature2.desc": "গেমিং কমিউনিটির অংশ হন",
      "home.feature3.title": "সুরক্ষিত লেনদেন",
      "home.feature3.desc": "এসক্রো সুরক্ষা সহ নিরাপদ লেনদেন",
      "home.feature4.title": "দৈনিক রিওয়ার্ড",
      "home.feature4.desc": "কয়েন ও এক্সক্লুসিভ রিওয়ার্ড উপার্জন করুন",
      "home.stats.tournaments": "টুর্নামেন্ট",
      "home.stats.players": "সক্রিয় খেলোয়াড়",
      "home.stats.prize": "পুরস্কার বিতরণ",
      "home.stats.satisfaction": "সন্তুষ্টির হার",
      
      // Auth
      "auth.name": "পূর্ণ নাম",
      "auth.email": "ইমেইল ঠিকানা",
      "auth.password": "পাসওয়ার্ড",
      "auth.loginTitle": "স্বাগতম",
      "auth.registerTitle": "অ্যাকাউন্ট তৈরি করুন",
      "auth.haveAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      "auth.noAccount": "অ্যাকাউন্ট নেই?",
      "auth.loginButton": "লগইন",
      "auth.registerButton": "সাইন আপ",
      "auth.loginSubtitle": "আপনার অ্যাকাউন্টে সাইন ইন করুন",
      "auth.registerSubtitle": "ই-স্পোর্টস এরিনায় যোগ দিন",
      
      // Tournaments
      "tournaments.upcoming": "আসন্ন টুর্নামেন্টসমূহ",
      "tournaments.game": "গেম",
      "tournaments.date": "তারিখ",
      "tournaments.prize": "পুরস্কার",
      "tournaments.participants": "অংশগ্রহণকারী",
      "tournaments.viewDetails": "বিস্তারিত দেখুন",
      "tournaments.join": "টুর্নামেন্টে যোগ দিন",
      "tournaments.joined": "আপনি নিবন্ধিত",
      "tournaments.full": "পূর্ণ",
      "tournaments.description": "বিবরণ",
      "tournaments.registrationDeadline": "রেজিস্ট্রেশনের শেষ তারিখ",
      "tournaments.maxParticipants": "সর্বোচ্চ অংশগ্রহণকারী",
      "tournaments.noTournaments": "বর্তমানে কোনো টুর্নামেন্ট নেই।",
      "tournaments.checkBack": "শীঘ্রই নতুন ইভেন্টের জন্য আবার দেখুন!",
      
      // Admin
      "admin.dashboard": "অ্যাডমিন ড্যাশবোর্ড",
      "admin.createTournament": "নতুন টুর্নামেন্ট তৈরি",
      "admin.edit": "সম্পাদনা",
      "admin.delete": "মুছুন",
      "admin.title": "শিরোনাম",
      "admin.description": "বিবরণ",
      "admin.maxParticipants": "সর্বোচ্চ অংশগ্রহণকারী",
      "admin.create": "তৈরি করুন",
      "admin.update": "আপডেট করুন",
      "admin.cancel": "বাতিল",
      "admin.actions": "কার্যক্রম",
      "admin.allTournaments": "সকল টুর্নামেন্ট",
      
      // Dashboard
      "dashboard.myTournaments": "আমার নিবন্ধিত টুর্নামেন্ট",
      "dashboard.noTournaments": "আপনি এখনো কোনো টুর্নামেন্টে যোগ দেননি।",
      "dashboard.browseTournaments": "টুর্নামেন্ট ব্রাউজ করুন",
      
      // Profile
      "profile.tab.info": "প্রোফাইল তথ্য",
      "profile.tab.password": "পাসওয়ার্ড পরিবর্তন",
      "profile.tab.tournaments": "আমার টুর্নামেন্ট",
      "profile.name": "প্রদর্শনী নাম",
      "profile.bio": "পরিচয়",
      "profile.location": "অবস্থান",
      "profile.socialLinks": "সোশ্যাল লিংক",
      "profile.changePhoto": "ছবি পরিবর্তন",
      "profile.save": "সংরক্ষণ করুন",
      "profile.saved": "প্রোফাইল সংরক্ষিত!",
      "profile.photoUpdated": "ছবি আপডেট হয়েছে!",
      "profile.photoTooLarge": "ছবি ৫MB এর কম হতে হবে",
      "profile.loadError": "প্রোফাইল লোড ব্যর্থ",
      "profile.passwordMismatch": "পাসওয়ার্ড মিলছে না",
      "profile.passwordChanged": "পাসওয়ার্ড আপডেট হয়েছে!",
      "profile.currentPassword": "বর্তমান পাসওয়ার্ড",
      "profile.newPassword": "নতুন পাসওয়ার্ড",
      "profile.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
      "profile.updatePassword": "পাসওয়ার্ড আপডেট করুন",
      "profile.noTournaments": "এখনো কোনো টুর্নামেন্টে নিবন্ধিত নন।",
      "profile.facebook": "ফেসবুক",
      "profile.instagram": "ইনস্টাগ্রাম",
      "profile.whatsapp": "হোয়াটসঅ্যাপ",
      
      // Wallet
      "wallet.balance": "আপনার ব্যালেন্স",
      "wallet.deposit": "ই-কয়েন যোগ করুন",
      "wallet.proceed": "এগিয়ে যান",
      "wallet.history": "লেনদেনের ইতিহাস",
      "wallet.noTransactions": "এখনো কোনো লেনদেন নেই।",
      "wallet.loadError": "ওয়ালেট লোড ব্যর্থ",
      "wallet.sendTo": "পেমেন্ট পাঠান",
      "wallet.sendSuffix": "এর মাধ্যমে",
      "wallet.amount": "পরিমাণ",
      "wallet.mockNote": "⚠️ ডেভেলপমেন্ট মোড: অ্যাডমিন ম্যানুয়ালি অনুমোদন করবেন।",
      "wallet.txRef": "ট্রানজেকশন রেফারেন্স",
      "wallet.confirmDeposit": "অনুরোধ জমা দিন",
      "wallet.requestSent": "অনুরোধ জমা হয়েছে!",
      "wallet.adminApproval": "অ্যাডমিন যাচাই করে আপনার ওয়ালেটে যোগ করবেন।",
      "wallet.newDeposit": "আবার টপআপ করুন",
      
      // Comments
      "comment.title": "মন্তব্য",
      "comment.placeholder": "মন্তব্য লিখুন...",
      "comment.loginRequired": "মন্তব্য করতে লগইন করুন",
      "comment.post": "পোস্ট করুন",
      "comment.reply": "উত্তর দিন",
      "comment.delete": "মুছুন",
      "comment.send": "পাঠান",
      "comment.replyPlaceholder": "উত্তর লিখুন...",
      "comment.confirmDelete": "এই মন্তব্য মুছবেন?",
      
      // Common
      "common.loading": "লোড হচ্ছে...",
      "common.error": "ত্রুটি ঘটেছে",
      "common.save": "সংরক্ষণ",
      "common.confirm": "নিশ্চিত করুন",
      "common.cancel": "বাতিল",
      "common.back": "পিছনে",
      "common.saving": "সংরক্ষণ হচ্ছে...",
      "common.submitting": "জমা হচ্ছে..."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'bn',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;