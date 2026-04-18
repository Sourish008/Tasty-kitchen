Restaurant Ordering Platform
Web App + Android · React + Vite · Supabase · Capacitor (MCP Server is connected to Supabase , Project name: Tasty Kitchen)
FieldValueVersion1.0 — Initial ReleaseDateApril 2025StatusDraft — Ready for ReviewAuthorProduct & Architecture TeamPlatformWeb (cPanel) + Android (Capacitor)BackendSupabase (Auth · DB · Storage · API)

SECTION 1 — Product Overview
The Restaurant Ordering Platform is a modern, full-stack digital ordering solution designed for restaurant businesses. It operates as a responsive web application accessible on all devices and converts seamlessly into a native Android app via Capacitor — all from a single React + Vite codebase.
The platform serves two primary user types: customers who browse menus, place orders, and receive invoices; and administrators who manage food items, pricing, orders, and customer reviews through a dedicated admin panel.
1.1 Goals & Objectives

Deliver a production-ready, mobile-first restaurant ordering experience
Support both web and Android with a single codebase using Capacitor
Automate the full order-to-invoice lifecycle for customers
Provide administrators with full operational control from a secure panel
Deploy reliably on shared cPanel hosting with Supabase as the cloud backend

1.2 Tech Stack
LayerTechnologyPurposeFrontendReact + ViteSPA with fast builds and HMRMobileCapacitorAndroid APK wrapperBackendSupabaseAuth, DB, Storage, REST APIsDatabasePostgreSQL (via Supabase)Relational data with RLSStorageSupabase StorageFood item images (public CDN)DeploymentcPanel (shared hosting)Static Vite build in public_htmlUICustom CSS / TailwindModern, mobile-first design

SECTION 2 — User Personas
2.1 Customer (End User)
FieldDetailNameAisha — Regular DinerAge Range18–45DeviceMobile browser (primary) and desktopGoalsBrowse the menu easily, place an order quickly, receive an invoicePain PointsSlow menus, unclear pricing, no order confirmation or receiptNeedsFast load times, clear item details, instant invoice after ordering
2.2 Restaurant Admin
FieldDetailNameRavi — Restaurant ManagerRoleOwner or manager responsible for daily operationsDeviceDesktop (primary), tabletGoalsManage menu items, track orders, control what customers seePain PointsManual order tracking, outdated menus, no control over reviewsNeedsQuick CRUD for items, live order status updates, review moderation

SECTION 3 — Feature Breakdown
3.1 User-Facing Features
3.1.1 Navigation

Top navbar: Home, Menu, Special Menu, Reviews, Account, Cart (with item count badge)
Footer: Contact info, Terms & Conditions, social media links
Fully responsive — hamburger menu on mobile

3.1.2 Home Page

Hero section with restaurant branding, tagline, and call-to-action
Featured dishes section (curated by admin)
Special Items highlight carousel or grid
Customer reviews preview (latest 3 published reviews)

3.1.3 Menu Sections (Regular & Special)

Two distinct pages/sections: Regular items and Special (premium) items
Each item card shows: name, image, price, short description, availability status
Out-of-stock items displayed with disabled state (not orderable)
Filter or category navigation within each section

3.1.4 Food Item Detail Page

Full item view: name, large image, full description, price
Quantity selector (increment/decrement, minimum 1)
Add to Cart button (disabled if out of stock)
Breadcrumb navigation back to menu section

3.1.5 Cart & Checkout

Cart drawer or page: list of added items with quantities and line totals
Ability to update quantity or remove items
Real-time subtotal, tax (if applicable), and grand total calculation
Checkout button triggers order submission to Supabase
Order confirmation screen shown on success

3.1.6 Invoice System

Automatically generated upon successful order placement
Invoice contains: unique Order ID, customer name and email, item list with quantities and prices, grand total, date and time of order
Invoice rendered on-screen immediately after checkout
Download option: PDF export or print-friendly view
Invoice accessible from the Account > Order History page

3.1.7 Reviews Page

Grid or card layout showing approved customer reviews
Each card shows: reviewer name, star rating, comment text, date
Only admin-published reviews are visible

3.1.8 Account Page

Authenticated users only — redirect to login if unauthenticated
Display name, email, profile details
Full order history with dates, totals, and status badges
Link to view/download invoice for each past order

3.1.9 Authentication

Google OAuth via Supabase (one-click login)
Email and password signup/login
Secure session management via Supabase JWT tokens
Password reset via email link
Persistent login across sessions

3.2 Admin Panel Features
3.2.1 Item Management

Add new food item: name, description, image upload, price, category, availability
Edit existing item (all fields editable)
Delete item (with confirmation dialog)
Toggle availability: Available / Out of Stock (instant update, no page reload)
Category assignment: Regular or Special
Images uploaded to Supabase Storage; URL stored in DB

3.2.2 Order Management

Paginated table of all orders (newest first)
Each row shows: Order ID, customer name, total, status, date
Click order to view full invoice detail
Update order status: Pending → Preparing → Delivered
Filter orders by status

3.2.3 Review Management

View all submitted and manually added reviews
Add review manually: name, rating, comment, date
Edit any review field
Delete review
Toggle is_published to control frontend visibility


SECTION 4 — Database Schema
All tables are managed in Supabase (PostgreSQL). Row Level Security (RLS) is enabled on all tables. Admin access is controlled via a role field on the users table.
4.1 users
FieldTypeConstraintDescriptioniduuidPK, FK → auth.usersSupabase Auth user IDemailtextNOT NULL, UNIQUEUser email addressdisplay_nametextFull name or display nameroletextDEFAULT 'customer''customer' or 'admin'created_attimestamptzDEFAULT now()Account creation time
4.2 food_items
FieldTypeConstraintDescriptioniduuidPK, DEFAULT gen_random_uuid()Item unique IDnametextNOT NULLDisplay name of the dishdescriptiontextFull description textpricenumeric(10,2)NOT NULLFixed price set by admincategorytextCHECK IN ('regular','special')Menu section assignmentimage_urltextSupabase Storage public URLis_availablebooleanDEFAULT trueAvailability togglecreated_attimestamptzDEFAULT now()Item creation time
4.3 orders
FieldTypeConstraintDescriptioniduuidPK, DEFAULT gen_random_uuid()Order unique IDuser_iduuidFK → users.idOrdering customeritemsjsonbNOT NULLSnapshot: [{id, name, price, qty}]total_pricenumeric(10,2)NOT NULLCalculated grand totalstatustextCHECK IN ('pending','preparing','delivered')Order lifecycle statuscreated_attimestamptzDEFAULT now()Order placement time
4.4 reviews
FieldTypeConstraintDescriptioniduuidPK, DEFAULT gen_random_uuid()Review unique IDuser_iduuidFK → users.id, nullableNull for manually addedreviewer_nametextNOT NULLDisplay name on review cardratingintegerCHECK 1–5Star ratingcommenttextNOT NULLReview body textis_publishedbooleanDEFAULT falseAdmin approval gatecreated_attimestamptzDEFAULT now()Review submission time

SECTION 5 — API Structure
The platform uses Supabase's auto-generated REST API and RPC (PostgreSQL functions) where needed. All requests include the Supabase anon key in headers; admin operations additionally validate the user role via RLS policies.
5.1 Authentication Endpoints (Supabase Auth)
EndpointMethodDescription/auth/v1/signupPOSTRegister with email + password/auth/v1/token?grant_type=passwordPOSTLogin with email + password/auth/v1/userGETGet current session user/auth/v1/logoutPOSTInvalidate session tokenGoogle OAuthRedirectVia Supabase OAuth provider flow
5.2 Food Items API
EndpointMethodAuthDescription/rest/v1/food_itemsGETPublicFetch all items (filter by category)/rest/v1/food_items?id=eq.{id}GETPublicFetch single item detail/rest/v1/food_itemsPOSTAdminCreate new item/rest/v1/food_items?id=eq.{id}PATCHAdminEdit item fields/rest/v1/food_items?id=eq.{id}DELETEAdminDelete item
5.3 Orders API
EndpointMethodAuthDescription/rest/v1/ordersPOSTCustomerPlace new order/rest/v1/orders?user_id=eq.{id}GETCustomerFetch own order history/rest/v1/ordersGETAdminFetch all orders (paginated)/rest/v1/orders?id=eq.{id}PATCHAdminUpdate order status
5.4 Reviews API
EndpointMethodAuthDescription/rest/v1/reviews?is_published=eq.trueGETPublicFetch published reviews/rest/v1/reviewsGETAdminFetch all reviews/rest/v1/reviewsPOSTAdminAdd review manually/rest/v1/reviews?id=eq.{id}PATCHAdminEdit or toggle publish/rest/v1/reviews?id=eq.{id}DELETEAdminRemove review

SECTION 6 — Application Flow
6.1 Customer Order Flow

User lands on Home page → sees featured dishes and special items
User navigates to Menu (Regular) or Special Menu page
User clicks an item → Item Detail page loads
User selects quantity → clicks "Add to Cart"
User opens Cart → reviews items and total → clicks "Checkout"
If not logged in → redirected to Login page (Google or email)
After login → returned to Checkout
User confirms order → POST to /orders → order created in Supabase
Invoice screen displayed immediately with Order ID, items, total, timestamp
User can download invoice as PDF or view in Account > Order History

6.2 Admin Management Flow

Admin logs in via email (role = 'admin' in users table)
Redirected to Admin Dashboard → overview of recent orders and items
Item Management: add/edit/delete items, upload images, toggle availability
Order Management: view all orders, update status (Pending → Preparing → Delivered)
Review Management: add reviews manually, toggle is_published, delete

6.3 Route Map
RoutePage/Home/menuRegular Menu/specialSpecial Menu/item/:idItem Detail/cartCart/checkoutCheckout/invoice/:orderIdInvoice View/reviewsReviews/accountAccount & Order History/loginAuthentication/adminAdmin Dashboard (protected)/admin/itemsItem Management/admin/ordersOrder Management/admin/reviewsReview Management

SECTION 7 — UI Page List
PageAccessKey ComponentsHomePublicHero, featured items, special highlights, reviews previewRegular MenuPublicItem grid with category filter, availability badgesSpecial MenuPublicPremium item grid, highlighted stylingItem DetailPublicFull image, description, price, quantity selector, Add to CartCartPublic/AuthItem list, quantity controls, subtotal, Checkout buttonCheckoutAuthOrder summary, confirm buttonInvoiceAuthAuto-generated order summary, PDF downloadReviewsPublicReview cards grid with star ratingsAccountAuthProfile info, order history list with invoice linksLogin / SignupPublicGoogle OAuth button, email/password formAdmin DashboardAdminSummary cards: total orders, items, revenueAdmin: ItemsAdminData table, add/edit form, image uploader, availability toggleAdmin: OrdersAdminOrders table, status dropdown, invoice detail modalAdmin: ReviewsAdminReviews table, publish toggle, manual add form

SECTION 8 — Technical Architecture
8.1 Frontend Architecture

React 18 with Vite for fast builds and HMR in development
React Router v6 for client-side navigation with protected routes
Supabase JS SDK (@supabase/supabase-js) for all API and Auth calls
Context API or Zustand for global state: cart, auth session, user profile
Component structure: pages/, components/, hooks/, utils/, lib/
Environment variables via import.meta.env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

8.2 Android (Capacitor) Architecture

npx cap add android — adds native Android project alongside web build
StatusBar plugin configured: non-fullscreen, overlay disabled
SafeArea plugin for proper spacing on notched/punch-hole screens
npx cap sync — copies Vite dist/ to Android assets after each build
Web: http://localhost → Native: file:///android_asset/public/index.html

8.3 Supabase Backend Architecture

Auth: Supabase Auth with JWT tokens; Google OAuth configured in dashboard
Database: PostgreSQL with Row Level Security on all tables
RLS Policy: customers can only read/write their own orders; admins bypass via role check
Storage: food-images bucket (public read, admin-only write)
REST API: auto-generated from schema; no custom server needed
RPC: PostgreSQL functions for complex queries (e.g. order summary aggregates)

8.4 Admin Route Guard

All /admin/* routes wrapped in an AdminRoute component
AdminRoute checks user session and role === 'admin' from the users table
Unauthorized access redirects to Home with an error toast


SECTION 9 — Deployment Plan
9.1 Web Deployment (cPanel)

Run npm run build — Vite outputs to /dist
Upload contents of /dist to public_html via cPanel File Manager or FTP
Create .htaccess in public_html with the following SPA rewrite rule:

RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

Set environment variables at build time via .env file

9.2 Android Build

Complete web build: npm run build
Sync to Android: npx cap sync android
Open in Android Studio: npx cap open android
Build APK: Build → Generate Signed Bundle/APK
Test on physical device or emulator before distribution

9.3 Supabase Setup

Create Supabase project and note URL + anon key
Run schema SQL to create all four tables with RLS policies
Enable Google OAuth in Supabase Auth → Providers
Create food-images storage bucket with public read policy
Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env


SECTION 10 — Future Enhancements
FeaturePriorityNotesOnline Payment (Stripe / Razorpay)HighIntegrate payment gateway at checkoutReal-time Order TrackingHighSupabase Realtime subscriptions for live statusPush Notifications (Android)MediumCapacitor Push Notifications pluginCustomer Review SubmissionMediumAllow customers to submit reviews post-orderMulti-language Support (i18n)Mediumreact-i18next for regional menusiOS App (Capacitor)MediumCapacitor supports iOS with minimal changesLoyalty / Rewards ProgramLowPoints system linked to user ordersAnalytics Dashboard (Admin)LowRevenue charts, popular items, peak hoursTable QR Code OrderingLowQR code per table pre-fills order context