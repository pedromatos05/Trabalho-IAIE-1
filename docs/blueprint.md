# **App Name**: Game Commerce Automator

## Core Features:

- Real-time Sales & Stock Reduction: Upon payment confirmation, a Firebase Cloud Function will trigger the Moloni API to create an invoice and automatically deduct stock in real-time.
- Stock Level Sync: A scheduled function regularly pulls stock levels from Moloni to Firestore (products.stock_online) to prevent overselling. An additional user interface screen shows administrators the actual inventory level.
- SAP Customer Data Sync: Upon new user registration, a Cloud Function sends user data (Name, Email, NIF, Address, Registration Date) to SAP CRM and stores the SAP Customer ID in Firestore.
- Point Transaction Recording: Every point transaction (earn/redeem) is sent to SAP for CLV analytics, maintaining Firebase as the single source of truth for point balances (users.pontos_saldo).
- Admin Area Security: Firebase Security Rules restrict access to the admin area, ensuring only users with the 'admin' role (configured via Firebase Auth Custom Claims) can manage the platform.
- Invoice Number Retrieval: The Firebase Cloud Function retrieves the invoice ID/Number from Moloni and updates the 'pedidos' document in Firestore with this information.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2), evoking a sense of trust, reliability, and technological advancement.
- Background color: Light blue (#E1F5FE), a softer shade of the primary color, creating a calming and professional atmosphere.
- Accent color: A light violet (#9C66FF), positioned to the left of the primary color on the color wheel, draws attention to important interactive elements without overwhelming the user interface.
- Headline font: 'Space Grotesk' sans-serif font; body text: 'Inter' sans-serif font.
- Crisp, modern icons to represent game genres, account functions, and transactional statuses.
- A clean, grid-based layout promoting ease of navigation and a focus on key information such as stock levels, order statuses, and customer data.
- Subtle transitions and loading animations to provide feedback during data synchronization processes.