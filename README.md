# Mini Marketplace

A full-stack e-commerce demo application combining **Vanilla JavaScript** for product management with **React** for cart functionality.




# creator Sarvarbek Sharipboyev 

# it took me to make this website about 5 hours it was amzing experience for me i ve learned some techniques also and thanks for giving me this opportunity for Click company 

#https://sarvardev035.github.io/onlinestore-click-intern/     here is the github pages link to see this  website 
### everything is full of fun no problem at all task was understandabla and some intelligence is enought 
## Overview

Mini Marketplace showcases a modern web architecture where:
- **Left Side**: Vanilla JavaScript fetches and displays products from FakeStore API
- **Right Side**: React application manages shopping cart with localStorage persistence
- **Communication**: Events bridge vanilla JS and React components seamlessly

### Key Features

✅ Responsive two-column layout (desktop) / stacked (mobile)  
✅ Real products from FakeStore API  
✅ Add/remove items from cart  
✅ Quantity management with increment/decrement controls  
✅ Cart persistence using localStorage  
✅ Smooth animations and transitions  
✅ Custom CSS (no frameworks)  
✅ Mobile-first design with breakpoints at 768px and 480px  

---

## Project Structure

```
mini-marketplace/
├── index.html                 # Main HTML file
├── styles.css                 # Responsive CSS for products & layout
├── products.js                # Vanilla JavaScript for products
├── react-cart/                # Separate React Vite app
│   ├── src/
│   │   ├── main.jsx          # React DOM entry point
│   │   ├── App.jsx           # Cart application component
│   │   ├── CartList.jsx      # List container component
│   │   ├── CartItem.jsx      # Individual cart item component
│   │   ├── App.css           # Cart styling
│   │   ├── CartList.css      # List styling
│   │   └── CartItem.css      # Item styling
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Dependencies
└── README.md                  # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 1. Clone or Download the Project

```bash
cd mini-marketplace
```

### 2. Install React Cart Dependencies

```bash
cd react-cart
npm install
cd ..
```

### 3. Start the Application

#### Option A: Using a Local Server

```bash
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js (if http-server is installed)
npx http-server -p 8000
```

Then open: **http://localhost:8000**

#### Option B: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → Select "Open with Live Server"

#### Option C: Using Vite Development Server (for React Cart Only)

```bash
cd react-cart
npm run dev
```

This runs the React app on **http://localhost:3000** (Note: You'll still need to serve the main page with a separate server)

---

## How to Use

### Adding Products to Cart

1. **Products Section** (left side):
   - Browse available products fetched from FakeStore API
   - Click "Add to Cart" button on any product
   - See a confirmation notification

### Managing Cart

2. **Cart Section** (right side):
   - View all added items
   - Adjust quantity with +/− buttons or direct input
   - See real-time price updates
   - Remove individual items with ✕ button
   - View cart subtotal and total price
   - Clear entire cart with "Clear Cart" button

### Data Persistence

- Cart data is saved to **localStorage** automatically
- Refresh the page and your cart will be restored
- Opens in browser DevTools: Storage → Local Storage

---

## Technologies Used

### Vanilla JavaScript (products.js)
- Fetch API for HTTP requests
- DOM manipulation with `document.createElement()` and `innerHTML`
- Event listeners for click handlers
- localStorage API for persistence
- Custom events for React communication
- CSS animations (slideIn/slideOut)

### React (react-cart/)
- **useState Hook**: Manage cart state
- **useEffect Hook**: Load cart on mount, listen to custom events
- Component-based architecture
- Props for data passing
- Event handling and conditional rendering

### Styling
- Custom CSS with Flexbox and CSS Grid
- normalize.css for cross-browser consistency
- Mobile-first responsive design
- CSS transitions and animations
- No external frameworks (Bootstrap, Tailwind, etc.)

### Build & Development
- **Vite**: Fast build tool for React
- **Node.js**: JavaScript runtime
- **npm**: Package manager

---

## Component Architecture

### Vanilla JS Structure
```
products.js
├── fetchProducts()         → Fetch from API
├── displayProducts()       → Render to DOM
├── createProductCard()    → Build product element
├── addToCart()            → Add to localStorage
├── getCartFromStorage()   → Retrieve cart
└── saveCartToStorage()    → Persist cart
```

### React Structure
```
App.jsx (Main)
├── State: cart
├── Effects: Load from storage, Listen to events
├── Functions: removeFromCart, updateQuantity, clearCart
└── Renders: CartList, Summary, Actions

CartList.jsx
└── Maps cart items → CartItem (for each item)

CartItem.jsx
├── Display: Image, Title, Price
├── Controls: Quantity buttons
├── Actions: Remove button
└── Interactions: Quantity changes, removal
```

---

## Data Flow

```
User clicks "Add to Cart" (Vanilla JS)
        ↓
products.js → addToCart()
        ↓
Save to localStorage
        ↓
Dispatch custom event "cartUpdated"
        ↓
App.jsx listens → Receives event
        ↓
setCart(updatedData)
        ↓
Components re-render with new items
```

---

## API Integration

**Endpoint**: `https://fakestoreapi.com/products`

**Response Sample**:
```json
{
  "id": 1,
  "title": "Fjallraven - Backpack",
  "price": 109.95,
  "image": "https://...",
  "category": "electronics"
}
```

All 20 products are fetched and displayed with error handling.

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|-----------|-------|---------|
| Desktop   | 768px+ | Two-column layout |
| Tablet    | 481-767px | Single column, optimized product cards |
| Mobile    | ≤480px | Stack layout, condensed spacing |

---

## Key Features Explained

### 1. Two-Way Communication (Vanilla ↔ React)
- Vanilla JS triggers custom event when item added
- React listens for events via `useEffect`
- localStorage keeps both in sync

### 2. localStorage Integration
```javascript
// Reading
const cart = JSON.parse(localStorage.getItem('marketplace_cart'));

// Writing
localStorage.setItem('marketplace_cart', JSON.stringify(cart));
```

### 3. Responsive Design
- CSS Grid for products (auto-columns)
- Flexbox for cart items
- Media queries for mobile transforms
- Custom scrollbars for cart list

### 4. Error Handling
- API error messages displayed to user
- Image fallback for broken product images
- localStorage error catching
- Graceful degradation

---

## What Was Challenging

1. **Cross-Framework Communication**: Bridging vanilla JS and React without shared state management (Redux/Context) required custom event implementation
2. **Responsive Layout**: Making the two-column layout work on mobile required careful CSS Grid restructuring
3. **Image Loading**: Some FakeStore product images load slowly; implemented error fallback
4. **localStorage Sync**: Ensuring both vanilla JS and React stay synchronized with the same data
5. **CSS Without Frameworks**: Building polished UI without Bootstrap/Tailwind required detailed CSS work (buttons, forms, spacing)

---

## Time Spent

**Estimated Time**: 3-4 hours (including development, testing, and documentation)

- Project structure & setup: 15 min
- HTML/CSS layout: 45 min
- Vanilla JS products: 30 min
- React cart setup: 45 min
- Styling & responsive design: 45 min
- Testing & debugging: 30 min
- Documentation: 30 min

---

## Screenshots

### Desktop View (Products + Cart)
```
┌─────────────────────────────────────────────────────────┐
│                   Mini Marketplace                       │
├──────────────────────────┬──────────────────────────────┤
│  PRODUCTS                │  SHOPPING CART               │
│  ┌──────────────────┐    │  Items in Cart: 2            │
│  │ [IMG] Backpack   │    │  ┌──────────────────────┐   │
│  │ $109.95          │    │  │ [IMG] Backpack    qty │   │
│  │ [Add to Cart] ✓  │    │  │       $109.95     [1]│   │
│  └──────────────────┘    │  │              $109.95 │   │
│  ┌──────────────────┐    │  └──────────────────────┘   │
│  │ [IMG] T-shirt    │    │  ┌──────────────────────┐   │
│  │ $22.99           │    │  │ [IMG] T-shirt     qty│   │
│  │ [Add to Cart] ✓  │    │  │       $22.99      [1]│   │
│  └──────────────────┘    │  │               $22.99 │   │
│                          │  └──────────────────────┘   │
│  ... more products       │  Subtotal:  $132.94        │
│                          │  Total:     $132.94        │
│                          │  [Proceed to Checkout]    │
│                          │  [Clear Cart]             │
└──────────────────────────┴──────────────────────────────┘
```

### Mobile View (Stacked)
```
┌──────────────────────────────┐
│   Mini Marketplace           │
├──────────────────────────────┤
│  PRODUCTS                    │
│  [IMG] Backpack              │
│        $109.95               │
│        [Add to Cart]         │
│                              │
│  [IMG] T-shirt               │
│        $22.99                │
│        [Add to Cart]         │
└──────────────────────────────┘
┌──────────────────────────────┐
│  SHOPPING CART               │
│  Items: 2                    │
│  [IMG] Backpack      qty [1] │
│        $109.95       [Remove]│
│  [IMG] T-shirt       qty [1] │
│        $22.99        [Remove]│
│                              │
│  Total: $132.94              │
│  [Proceed to Checkout]       │
│  [Clear Cart]                │
└──────────────────────────────┘
```

---

## Demo Link

**Live Demo**: [https://your-deployment-url.com](https://your-deployment-url.com)

*Placeholder: Deploy using Netlify, Vercel, or GitHub Pages*

---

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6+ support and Fetch API.

---

## Future Enhancements

- [ ] Product filtering by category
- [ ] Search functionality
- [ ] Coupon/discount codes
- [ ] Checkout form with payment integration
- [ ] Order history
- [ ] User authentication
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Dark mode toggle
- [ ] Analytics integration

---

## Troubleshooting

### Cart Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check DevTools → Storage → Local Storage

### Products Not Loading
- Check internet connection
- Verify FakeStore API is accessible (https://fakestoreapi.com/products)
- Check browser console for CORS errors

### React Cart Not Showing
- Ensure Node dependencies installed: `cd react-cart && npm install`
- Check console for JavaScript errors
- Verify `main.jsx` is properly loaded

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Check if CSS file is being served (DevTools → Network)
- Verify normalize.css CDN is accessible

---

## License

This project is open source and available for educational purposes.

---

## Author

**Created**: December 11, 2025

**Technologies**: Vanilla JavaScript, React, Vite, CSS3, HTML5

---

## Getting Help

For questions or issues:
1. Check the console for error messages
2. Review the code comments in each file
3. Check browser DevTools Network and Console tabs
4. Verify all dependencies are installed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-11 | Initial release |

---

**Happy Shopping! 🛒**
