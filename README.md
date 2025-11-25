# Admin Dashboard - Next.js 14

**UI generated referencing `/mnt/data/Screenshot 2025-11-23 184407.png`**

A production-ready Next.js 14 admin dashboard with full bilingual support (English/Arabic) and RTL capabilities. Built with JavaScript, Tailwind CSS, and shadcn/ui components.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **JavaScript only** (no TypeScript)
- ✅ **Bilingual Support** (English/Arabic) with client-side language toggle
- ✅ **RTL Support** - Proper RTL layout when Arabic is selected (sidebar stays on left as per design)
- ✅ **Tailwind CSS** with custom color palette and gradients
- ✅ **shadcn/ui Components** - Wrapped in JavaScript
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Locale Persistence** - Language preference saved to localStorage

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

## Project Structure

```
app/
 ├─ (auth)/
 │   └─ login/page.jsx          # Login page
 ├─ (dashboard)/
 │   ├─ layout.jsx               # Dashboard layout (Sidebar + Topbar)
 │   ├─ dashboard/page.jsx       # Dashboard home
 │   ├─ customers/page.jsx       # Customers list
 │   └─ settings/page.jsx        # Settings page
 ├─ globals.css                  # Global styles + Tailwind
 └─ layout.jsx                   # Root layout

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
 │    └─ CustomersTable.jsx      # Customers data table
 ├─ modals/
 │    └─ AddCustomerModal.jsx    # Add customer dialog
 └─ utils/
      ├─ useLocale.js            # i18n hook with RTL support
      └─ cn.js                   # className utility

forms/
 ├─ LoginForm.jsx                # Login form
 ├─ AddCustomerForm.jsx         # Add customer form
 └─ form-controls/
     ├─ TextInput.jsx
     ├─ SelectInput.jsx
     └─ DatePickerPlaceholder.jsx

locales/
 ├─ en.json                      # English translations
 └─ ar.json                      # Arabic translations
```

## Language Toggle & i18n

### How It Works

1. **Language Toggle**: Located in the Topbar component. Click to switch between English and Arabic.

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
   {t('mySection.myKey')}
   ```

## shadcn/ui Components

All shadcn/ui components are wrapped in JavaScript under `/components/shadcn/`. To regenerate or add new components:

1. Install shadcn/ui CLI (if needed)
2. Add components using the shadcn CLI
3. Convert TypeScript to JavaScript
4. Apply project design system (colors, spacing, etc.)

## Pages

### Login (`/login`)
- Left panel: Login form
- Right panel: Gradient background with animated shapes

### Dashboard (`/dashboard`)
- Greeting header (time-based)
- Three stat cards with gradients
- Customers list
- Growth chart placeholder
- Key metrics cards

### Customers (`/customers`)
- Data table with sorting
- Add customer button (opens modal)
- Pagination controls

### Settings (`/settings`)
- Placeholder page

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

## Notes

- All form validation is client-side
- Chart placeholders use SVG for visual representation
- Avatar images should be placed in `/public/avatars/`
- The project uses Next.js 14 App Router with route groups `(auth)` and `(dashboard)`
- RTL support keeps sidebar on the left as per design requirements
- Language toggle includes screen reader announcements for accessibility

## Reference Image

The UI design is based on the reference image located at:
`/mnt/data/Screenshot 2025-11-23 184407.png`

## License

This project is private and proprietary.

