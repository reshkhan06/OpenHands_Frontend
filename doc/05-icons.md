# Icons

The frontend uses **Lucide React** for all iconography.

## Library

- **Package**: `lucide-react` (see `package.json`).
- **Usage**: Named imports; icons are React components. Example: `import { Heart, ChevronDown } from 'lucide-react'`.

## Icons by Area

### Layout & Navigation

| Icon | Used In | Purpose |
|------|---------|---------|
| `Menu`, `X` | Navbar | Mobile menu open / close |
| `ChevronDown` | Navbar, UserProfileDropdown | Dropdown indicator |
| `ChevronLeft`, `ChevronRight` | HeroCarousel | Carousel arrows |
| `ArrowUp` | BackToTop | Scroll to top |
| `ArrowLeft` | Register | Back / navigation |
| `ArrowRight` | NGODashboard | Next / link |

### Auth & User

| Icon | Used In | Purpose |
|------|---------|---------|
| `User`, `UserCircle` | Register, DonorDashboard, NgoLayout, ProfileForm, etc. | User/profile |
| `Mail`, `Lock` | Login, Register | Email, password fields |
| `Eye`, `EyeOff` | Login, Register | Password visibility toggle |
| `MailCheck`, `Clock` | Login | Verification/pending state |
| `Heart` | Logo, Donate, Home | Brand / donation |
| `LogOut` | NgoLayout, UserProfileDropdown, NgoPickups, NGODashboard | Logout action |
| `Settings` | UserProfileDropdown, PreferencesForm | Settings |
| `ChevronDown` | UserProfileDropdown | Dropdown |

### Donation & Pickups

| Icon | Used In | Purpose |
|------|---------|---------|
| `Gift`, `Package` | DonationTable, Home | Donations / items |
| `Truck` | NgoPickups, NGODashboard, DonationTable, About | Pickups / delivery |
| `CheckCircle` | DonationTable, Verify, Donate, PickupDetail, etc. | Success / completed |
| `Hourglass` | DonationTable | Pending |
| `Eye` | DonationTable, NGOCard, PickupDetail, NgoPickups | View details |
| `Filter` | DonationTable, NgoPickups, NGODashboard | Filter |
| `ClipboardList` | NgoPickups, NGODashboard | List / pickups |
| `Calendar` | DOBPicker, NgoPickups, NGODashboard | Date / schedule |
| `MapPin` | Register, Contact, NGOs, NgoPickups, NGODashboard, Home | Location / address |
| `RotateCw` | NgoPickups | Refresh |

### NGO & Admin

| Icon | Used In | Purpose |
|------|---------|---------|
| `Building2` | NGOs | NGO/organization |
| `LayoutDashboard` | NGODashboard, NgoPickups, NgoLayout | Dashboard nav |
| `Plus` | NGOCard | Add / CTA |
| (Admin dashboard uses a set of Lucide icons for stats and tables) | AdminDashboard | Various admin actions and metrics |

### Forms & Feedback

| Icon | Used In | Purpose |
|------|---------|---------|
| `User`, `Mail`, `MessageSquare`, `FileText`, `Star`, `Send` | Feedback | Form fields and submit |
| `Send` | Contact | Submit message |
| `Pencil`, `Check`, `X` | ProfileForm | Edit / save / cancel |
| `Check` | PreferencesForm | Preference selected |

### Marketing & Static Pages

| Icon | Used In | Purpose |
|------|---------|---------|
| `Shield`, `Eye`, `Truck`, `TrendingUp`, `Search`, `Upload`, `CheckCircle`, `Star`, `UserPlus`, `Package`, `MapPin` | Home | Hero / features |
| `Shield`, `Eye`, `Truck`, `TrendingUp`, `Heart`, `Building` | About | Values / features |
| `Mail`, `Phone`, `MapPin`, `Clock`, `Send`, `Facebook`, `Twitter`, `Instagram`, `Linkedin` | Contact, Footer | Contact info and social |

### Status & Loading

| Icon | Used In | Purpose |
|------|---------|---------|
| `Loader` | Verify | Loading state |
| `AlertCircle` | Verify | Error state |

## Consistency

- Use Lucide React for any new icons to keep the set consistent.
- Import only the icons you need: `import { IconName } from 'lucide-react'`.
- Size and color are controlled via props (e.g. `size={20}`, `className="text-muted-foreground"`) or wrapper `className`.

## Reference

- [Lucide Icons](https://lucide.dev/) — full list and names. Use the exact name in PascalCase for the import (e.g. `ArrowUp`, `ChevronDown`).
