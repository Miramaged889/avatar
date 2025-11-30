# Admin Dashboard - Next.js 14

**UI generated referencing `/mnt/data/Screenshot 2025-11-23 184407.png`**

A production-ready Next.js 14 admin dashboard with full bilingual support (English/Arabic) and RTL capabilities. Built with JavaScript, Tailwind CSS, shadcn/ui components, and Redux for state management. Fully integrated with REST APIs for real-time data management.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **JavaScript only** (no TypeScript)
- ✅ **Bilingual Support** (English/Arabic) with client-side language toggle
- ✅ **RTL Support** - Proper RTL layout when Arabic is selected
- ✅ **Tailwind CSS** with custom color palette and gradients
- ✅ **shadcn/ui Components** - Wrapped in JavaScript
- ✅ **Redux Toolkit** - State management with async thunks
- ✅ **REST API Integration** - Full CRUD operations for all entities
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Locale Persistence** - Language preference saved to localStorage

## System Modules

### Dashboard

- Real-time statistics from APIs
- Total businesses, clients, admins, and payments
- Total revenue calculation
- Active businesses and clients count
- Recent activities feed (last 3 activities)
- System overview with key metrics

### Business Management

- View all businesses
- Add new business
- Edit business details
- View business information
- Delete business
- Filter and search capabilities

### Clients Management

- View all clients
- Add new client
- Edit client information
- View client details
- Delete client
- Business association

### Admins Management

- View all admins by business
- Add new admin (with password)
- Edit admin information
- Delete admin
- Max admins validation per business
- Business-based filtering

### Payments Management

- View all payments
- Add new payment
- Edit payment details
- Delete payment
- Business-based filtering
- Payment method tracking
- Revenue calculation

### Knowledge Base

- Manage questions and answers
- Upload documents
- Business-specific knowledge
- Multi-step form workflow
- File upload support

## Color Palette

- Primary: `#000537`, `#112CA3`, `#16294E`, `#0464ED`, `#3F4661`
- Accent: `#EBC359`, `#FFC324`, `#10FAF8`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

## Project Structure

```
app/
 ├─ (auth)/
 │   └─ login/page.jsx          # Login page
 ├─ (dashboard)/
 │   ├─ layout.jsx               # Dashboard layout (Sidebar + Topbar)
 │   ├─ dashboard/page.jsx       # Dashboard home with real-time stats
 │   ├─ business/page.jsx         # Business management
 │   ├─ clients/page.jsx         # Clients management
 │   ├─ admins/page.jsx          # Admins management
 │   ├─ payments/page.jsx        # Payments management
 │   ├─ knowledge/page.jsx       # Knowledge base
 │   ├─ settings/page.jsx        # Settings page
 │   └─ logout/page.jsx          # Logout page
 ├─ globals.css                  # Global styles + Tailwind
 └─ layout.jsx                   # Root layout with StoreProvider

components/
 ├─ shadcn/                      # shadcn/ui wrapper components
 │    ├─ ButtonWrapper.jsx
 │    ├─ CardWrapper.jsx
 │    ├─ InputWrapper.jsx
 │    ├─ DialogWrapper.jsx
 │    ├─ TableWrapper.jsx
 │    ├─ BadgeWrapper.jsx
 │    ├─ AvatarWrapper.jsx
 │    ├─ SelectWrapper.jsx
 │    └─ LabelWrapper.jsx
 ├─ layout/
 │    ├─ Sidebar.jsx             # Left sidebar navigation
 │    └─ Topbar.jsx              # Top header with language toggle
 ├─ cards/
 │    └─ StatCard.jsx            # Statistics card component
 ├─ tables/
 │    ├─ BusinessTable.jsx       # Business data table
 │    ├─ ClientsTable.jsx        # Clients data table
 │    ├─ AdminsTable.jsx         # Admins data table
 │    ├─ PaymentsTable.jsx       # Payments data table
 │    └─ KnowledgeBaseTable.jsx # Knowledge base table
 ├─ modals/
 │    ├─ business/
 │    │   ├─ AddBusinessModal.jsx
 │    │   └─ ViewBusinessModal.jsx
 │    ├─ clients/
 │    │   ├─ AddClientModal.jsx
 │    │   └─ ViewClientModal.jsx
 │    ├─ admins/
 │    │   ├─ AddAdminModal.jsx
 │    │   └─ EditAdminModal.jsx
 │    ├─ payments/
 │    │   ├─ AddPaymentModal.jsx
 │    │   └─ EditPaymentModal.jsx
 │    └─ knowledge/
 │        ├─ AddKnowledgeBaseModal.jsx
 │        └─ EditAnswerModal.jsx
 └─ utils/
      ├─ useLocale.js            # i18n hook with RTL support
      └─ cn.js                   # className utility

forms/
 ├─ LoginForm.jsx                # Login form
 ├─ AddBusinessForm.jsx          # Add business form
 ├─ AddClientForm.jsx            # Add client form
 ├─ AddAdminForm.jsx            # Add admin form
 ├─ AddPaymentForm.jsx          # Add payment form
 ├─ EditPaymentForm.jsx         # Edit payment form
 ├─ EditAnswerForm.jsx          # Edit answer form
 ├─ KnowledgeBaseForm.jsx        # Knowledge base multi-step form
 └─ form-controls/
     ├─ TextInput.jsx
     ├─ TextareaInput.jsx
     ├─ SelectInput.jsx
     └─ DatePickerPlaceholder.jsx

lib/
 ├─ api/                         # API layer
 │   ├─ axios.js                 # Axios instance with auth
 │   ├─ authApi.js               # Authentication APIs
 │   ├─ businessApi.js           # Business CRUD APIs
 │   ├─ clientApi.js             # Client CRUD APIs
 │   ├─ adminApi.js              # Admin CRUD APIs
 │   ├─ paymentApi.js            # Payment CRUD APIs
 │   ├─ knowledgeApi.js          # Knowledge base APIs
 │   └─ dashboardApi.js          # Dashboard statistics APIs
 ├─ store/                       # Redux store
 │   ├─ slices/
 │   │   ├─ businessSlice.js     # Business state management
 │   │   ├─ clientSlice.js       # Client state management
 │   │   ├─ adminSlice.js        # Admin state management
 │   │   ├─ paymentSlice.js      # Payment state management
 │   │   ├─ knowledgeSlice.js    # Knowledge base state management
 │   │   └─ dashboardSlice.js    # Dashboard statistics state
 │   └─ store.js                 # Redux store configuration
 └─ StoreProvider.js             # Redux provider wrapper

locales/
 ├─ en.json                      # English translations
 └─ ar.json                      # Arabic translations
```

## API Integration

### API Base URL

The API base URL is configured in `lib/api/axios.js` and can be set via environment variable `NEXT_PUBLIC_API_BASE_URL`.

### Authentication

- Superuser login: `POST /api/superuser/login/`
- Token-based authentication with Bearer tokens
- Tokens stored and managed automatically

### API Endpoints

#### Business

- `GET /api/dashboard/business/` - List all businesses
- `GET /api/dashboard/business/{id}/` - Get business details
- `POST /api/dashboard/business/` - Create business
- `PATCH /api/dashboard/business/{id}/` - Update business
- `DELETE /api/dashboard/business/{id}/` - Delete business

#### Clients

- `GET /api/dashboard/clients/` - List all clients
- `GET /api/dashboard/clients/{id}/` - Get client details
- `POST /api/dashboard/clients/` - Create client
- `PATCH /api/dashboard/clients/{id}/` - Update client
- `DELETE /api/dashboard/clients/{id}/` - Delete client

#### Admins

- `GET /api/dashboard/admins?business={id}` - List admins by business
- `POST /api/dashboard/admin/create/` - Create admin
- `PUT /api/dashboard/admin/manage/` - Update admin
- `DELETE /api/dashboard/admin/manage/` - Delete admin

#### Payments

- `GET /api/dashboard/business/payments/` - List payments
- `GET /api/dashboard/business/payments/{id}/` - Get payment details
- `POST /api/dashboard/business/payments/` - Create payment
- `PATCH /api/dashboard/business/payments/{id}/` - Update payment
- `DELETE /api/dashboard/business/payments/{id}/` - Delete payment

#### Knowledge Base

- `GET /api/dashboard/knowledge/questions/` - List questions
- `GET /api/dashboard/knowledge/answers/` - List answers
- `POST /api/dashboard/knowledge/answers/` - Create answer
- `POST /api/dashboard/knowledge/documents/` - Upload documents

## State Management (Redux)

The application uses Redux Toolkit for state management with the following slices:

- **businessSlice** - Manages business data and operations
- **clientSlice** - Manages client data and operations
- **adminSlice** - Manages admin data and operations
- **paymentSlice** - Manages payment data and operations
- **knowledgeSlice** - Manages knowledge base data
- **dashboardSlice** - Aggregates statistics from all modules

### Usage Example

```jsx
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBusinesses } from "../lib/store/slices/businessSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  // Use businesses data...
}
```

## Language Toggle & i18n

### How It Works

1. **Language Toggle**: Located in the Sidebar component. Click to switch between English and Arabic.

2. **Persistence**: Language preference is saved to `localStorage` with key `'locale'`. On page load, the saved preference is applied immediately to prevent FOUC (Flash of Unstyled Content).

3. **RTL Behavior**:

   - When Arabic is selected: `dir="rtl"` is set on `<html>`
   - Sidebar remains visually on the left (as per design requirements)
   - Text alignment switches to right for Arabic content
   - Font switches from Inter (EN) to Cairo (AR)

4. **Translation Function**: Use the `useLocale` hook:

   ```jsx
   const { t, locale, setLocale, formatDate, formatNumber, isRTL } = useLocale()

   // Translate
   <h1>{t('greetings.goodEvening')}</h1>

   // Format dates
   <p>{formatDate(new Date())}</p>

   // Format numbers
   <p>{formatNumber(1234.56)}</p>
   ```

5. **Changing Default Locale**: Edit `components/utils/useLocale.js` and change the default in the `useState` initialization, or modify the `localStorage.getItem(STORAGE_KEY) || 'en'` fallback.

### Adding New Translations

1. Add keys to `locales/en.json`:

   ```json
   {
     "mySection": {
       "myKey": "My English Text"
     }
   }
   ```

2. Add corresponding Arabic translations to `locales/ar.json`:

   ```json
   {
     "mySection": {
       "myKey": "نصي العربي"
     }
   }
   ```

3. Use in components:
   ```jsx
   {
     t("mySection.myKey");
   }
   ```

## Pages

### Login (`/login`)

- Left panel: Login form with username/password
- Right panel: Gradient background with animated shapes
- Superuser authentication
- Token management

### Dashboard (`/dashboard`)

- **Real-time Statistics**:
  - Total businesses, clients, admins, payments
  - Total revenue calculation
  - Active businesses and clients
- **Recent Activities**: Last 3 system activities (payments, new clients)
- **System Overview**: Quick metrics summary
- All data fetched from APIs

### Business (`/business`)

- View all businesses in a table
- Add new business with full details
- Edit business information
- View business details modal
- Delete business
- Filter and search capabilities

### Clients (`/clients`)

- View all clients in a table
- Add new client
- Edit client information
- View client details modal
- Delete client
- Business association

### Admins (`/admins`)

- View all admins filtered by business
- Add new admin (requires password)
- Edit admin information (full name, email)
- Delete admin
- Max admins validation per business
- Business-based filtering

### Payments (`/payments`)

- View all payments in a table
- Add new payment
- Edit payment details
- Delete payment
- Business-based filtering
- Payment method tracking
- Amount formatting

### Knowledge Base (`/knowledge`)

- Multi-step form workflow
- Select business
- Answer questions
- Upload documents
- Business-specific knowledge management

### Settings (`/settings`)

- Account settings
- Profile management
- Security settings
- Notification preferences

## Form Validation

### Client-Side Validation

- Required field validation
- Email format validation
- Password strength (minimum 6 characters for admins)
- Number range validation
- Date validation
- Business-specific validations (e.g., max admins limit)

### API Error Handling

- Network error handling
- Validation error display
- User-friendly error messages
- Automatic retry for failed requests

## Styling

### Tailwind Configuration

Custom colors, gradients, and utilities are defined in `tailwind.config.js`:

- `bg-gradient-stat-1`, `bg-gradient-stat-2`, `bg-gradient-stat-3` - Stat card gradients
- `bg-gradient-login` - Login page gradient
- Color utilities: `primary-dark`, `primary-DEFAULT`, `primary-accent`, etc.

### Fonts

- **English**: Inter (from Google Fonts)
- **Arabic**: Cairo (from Google Fonts)

Fonts are loaded in `app/globals.css` and applied based on locale.

## Development

### Running Locally

```bash
npm run dev
```

### Building

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Key Features & Validations

### Admin Management

- Password required (minimum 6 characters)
- Business association required
- Max admins validation per business (from business API)
- Email validation
- Full name required

### Payment Management

- Amount validation
- Payment method selection
- Payment date selection
- Business association
- Currency formatting

### Business Management

- Name in English and Arabic
- Legal name fields
- Tax number and commercial register
- Domain URL validation
- Max admins configuration

### Client Management

- Name in English and Arabic
- Email and phone validation
- Business association
- Active/inactive status

## Notes

- All form validation includes both client-side and API validation
- API responses are cached in Redux store
- Loading states are handled for all async operations
- Error states are displayed with user-friendly messages
- The project uses Next.js 14 App Router with route groups `(auth)` and `(dashboard)`
- RTL support keeps sidebar on the left as per design requirements
- Language toggle includes screen reader announcements for accessibility
- All API calls use Bearer token authentication
- Dashboard statistics are aggregated from multiple API endpoints
- Recent activities are sorted by date (newest first)

## API Response Handling

The application handles various API response formats:

- Array responses: `[{...}, {...}]`
- Paginated responses: `{ results: [...], count: N, next: "...", previous: "..." }`
- Single object responses: `{...}`

All API functions normalize responses to a consistent format.

## Reference Image

The UI design is based on the reference image located at:
`/mnt/data/Screenshot 2025-11-23 184407.png`

## License

This project is private and proprietary.
