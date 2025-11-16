# KYC-System UI - CSS & Tailwind Classes Reference

## 🎨 Tailwind CSS Classes Used

### Background & Gradients
```css
/* Linear Gradients */
bg-gradient-to-br           /* Bottom-right gradient */
bg-gradient-to-r            /* Right gradient */
from-blue-600               /* Gradient start color */
via-blue-500                /* Gradient middle color */
to-blue-700                 /* Gradient end color */
to-indigo-600               /* End to indigo */

/* Background Colors */
bg-white                    /* Pure white */
bg-gray-50                  /* Light gray background */
bg-gray-100                 /* Medium light gray */
bg-gray-800                 /* Dark gray */
bg-red-50                   /* Light red background */
bg-blue-50                  /* Light blue background */
bg-blue-200                 /* Medium blue */
bg-blue-300                 /* Lighter blue */
bg-blue-500                 /* Medium-bright blue */
bg-blue-600                 /* Primary blue */
bg-blue-700                 /* Darker blue */
bg-blue-800                 /* Dark blue */

/* Opacity */
bg-opacity-10               /* 10% opacity */
bg-opacity-20               /* 20% opacity */
bg-opacity-30               /* 30% opacity */
```

### Text Colors & Typography
```css
/* Text Colors */
text-white                  /* White text */
text-gray-600               /* Gray text */
text-gray-700               /* Darker gray text */
text-gray-800               /* Very dark gray */
text-gray-100               /* Very light gray */
text-blue-50                /* Very light blue text */
text-blue-100               /* Light blue text */
text-blue-200               /* Medium light blue */
text-blue-600               /* Primary blue text */
text-blue-700               /* Darker blue text */
text-red-600                /* Red text */
text-red-700                /* Darker red text */
text-red-800                /* Very dark red */

/* Font Sizes */
text-xs                     /* Extra small (12px) */
text-sm                     /* Small (14px) */
text-base                   /* Base (16px) */
text-lg                     /* Large (18px) */
text-xl                     /* Extra large (20px) */
text-2xl                    /* 2XL (24px) */
text-3xl                    /* 3XL (30px) */
text-4xl                    /* 4XL (36px) */
text-5xl                    /* 5XL (48px) */

/* Font Weights */
font-semibold               /* Font weight 600 */
font-bold                   /* Font weight 700 */

/* Text Alignment */
text-center                 /* Center aligned */
text-left                   /* Left aligned */
```

### Spacing (Padding & Margin)
```css
/* Padding */
p-2                        /* 8px padding all sides */
p-3                        /* 12px padding */
p-4                        /* 16px padding */
p-6                        /* 24px padding */
p-8                        /* 32px padding */
p-10                       /* 40px padding */
px-4                       /* 16px horizontal padding */
px-8                       /* 32px horizontal padding */
py-2                       /* 8px vertical padding */
py-3                       /* 12px vertical padding */
py-6                       /* 24px vertical padding */
py-8                       /* 32px vertical padding */
py-10                      /* 40px vertical padding */
pl-10                      /* 40px left padding (for icons) */
pr-4                       /* 16px right padding */

/* Margin */
mb-2                       /* 8px margin bottom */
mb-4                       /* 16px margin bottom */
mb-6                       /* 24px margin bottom */
mt-1                       /* 4px margin top */
mt-2                       /* 8px margin top */
mt-4                       /* 16px margin top */
mt-6                       /* 24px margin top */
mt-20                      /* 80px margin top */
```

### Borders & Rounded Corners
```css
/* Border Radius */
rounded                    /* 4px border radius */
rounded-lg                 /* 8px border radius */
rounded-2xl                /* 16px border radius */

/* Border */
border                     /* 1px border */
border-2                   /* 2px border */
border-l-4                 /* 4px left border */
border-gray-200            /* Gray border */
border-blue-100            /* Light blue border */
border-white               /* White border */
border-red-500             /* Red border */

/* Border Radius Specific */
border-opacity-20          /* 20% border opacity */
```

### Shadow & Elevation
```css
shadow-md                  /* Medium shadow */
shadow-lg                  /* Large shadow */
shadow-xl                  /* Extra large shadow */
shadow-2xl                 /* 2XL shadow */
```

### Layout & Flexbox
```css
/* Display */
flex                       /* Flexbox container */
grid                       /* Grid container */
block                      /* Block display */
hidden                     /* Hide element */
absolute                   /* Absolute positioning */
sticky                     /* Sticky positioning */
relative                   /* Relative positioning */

/* Flex Properties */
flex-col                   /* Column direction */
flex-row                   /* Row direction */
flex-shrink-0              /* Don't shrink */
items-center               /* Center items vertically */
items-start                /* Align items to start */
justify-between            /* Space between items */
justify-center             /* Center items horizontally */
gap-2                      /* 8px gap between items */
gap-4                      /* 16px gap */
gap-6                      /* 24px gap */
gap-8                      /* 32px gap */
gap-12                     /* 48px gap */
space-x-2                  /* 8px horizontal space */
space-x-3                  /* 12px horizontal space */
space-x-4                  /* 16px horizontal space */
space-y-6                  /* 24px vertical space */

/* Grid */
grid-cols-1                /* 1 column */
grid-cols-2                /* 2 columns */
grid-cols-3                /* 3 columns */
grid-cols-4                /* 4 columns */

/* Responsive */
md:grid-cols-2             /* 2 columns on medium+ screens */
md:w-1/2                   /* 50% width on medium+ */
sm:block                   /* Block display on small+ */
hidden sm:block            /* Hidden by default, shown on small+ */
```

### Size & Dimensions
```css
w-full                     /* 100% width */
w-5                        /* 20px width */
w-6                        /* 24px width */
w-10                       /* 40px width */
h-5                        /* 20px height */
h-6                        /* 24px height */
h-10                       /* 40px height */
h-16                       /* 64px height */
min-h-screen               /* Minimum 100vh height */
max-w-md                   /* Maximum 28rem width */
max-w-lg                   /* Maximum 32rem width */
max-w-xl                   /* Maximum 36rem width */
```

### Effects & Filters
```css
backdrop-blur-lg           /* Blur background effect */
opacity-25                 /* 25% opacity */
opacity-50                 /* 50% opacity */
opacity-75                 /* 75% opacity */
hover:opacity-20           /* 20% opacity on hover */
```

### Transitions & Animations
```css
transition                 /* Enable transition */
duration-300               /* 300ms duration */
ease                       /* Easing function */
hover:bg-opacity-20        /* Change on hover */
hover:bg-opacity-30        /* More opaque on hover */
hover:text-blue-700        /* Text color change on hover */
hover:shadow-lg            /* Shadow increase on hover */
hover:underline            /* Underline on hover */
focus:outline-none         /* Remove outline on focus */
focus:border-blue-500      /* Blue border on focus */
focus:ring-2               /* 2px ring on focus */
focus:ring-blue-100        /* Light blue ring */
disabled:opacity-50        /* 50% opacity when disabled */
disabled:cursor-not-allowed /* Not-allowed cursor */
animate-spin               /* Spinning animation */
```

### Form Elements
```css
border-2                   /* 2px border for inputs */
border-gray-200            /* Light gray input border */
focus:border-blue-500      /* Blue border on focus */
focus:ring-2               /* Ring on focus */
focus:ring-blue-100        /* Light blue ring */
rounded-lg                 /* Rounded corners on inputs */
px-4                       /* Horizontal padding in inputs */
py-3                       /* Vertical padding in inputs */
py-2                       /* Smaller vertical padding */
w-full                     /* Full width input */
placeholder-gray-400       /* Placeholder text color */
```

### Positioning
```css
absolute                   /* Absolute positioning */
left-4                     /* 16px from left (for icons) */
top-3.5                    /* 14px from top */
right-0                    /* 0px from right */
z-50                       /* z-index: 50 (for dropdowns) */
z-index: 50                /* Alternate notation */
```

### Containers & Groups
```css
container                  /* Max-width container */
mx-auto                    /* Horizontal auto margin (center) */
px-4                       /* Horizontal padding */
py-20                      /* Vertical padding */
overflow-hidden            /* Hide overflow content */
```

---

## 🎨 Common Component Patterns

### Button Styles
```jsx
/* Primary Button */
className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg 
           hover:bg-blue-50 transition duration-300 shadow-lg"

/* Secondary Button */
className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg 
           hover:bg-blue-800 transition duration-300 border-2 border-white"

/* Icon Button */
className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
```

### Card Styles
```jsx
/* Glassmorphic Card */
className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 
           text-white border border-white border-opacity-20 
           hover:bg-opacity-20 transition"

/* Standard Card */
className="bg-white rounded-2xl shadow-2xl overflow-hidden"
```

### Input Styles
```jsx
/* Text Input with Icon */
className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg 
           focus:outline-none focus:border-blue-500 
           focus:ring-2 focus:ring-blue-100 transition"
```

### Error Box
```jsx
/* Error Alert */
className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded"
```

### Grid Layout
```jsx
/* Responsive Grid */
className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"

/* 3-Column Grid */
className="grid grid-cols-3 gap-8 text-center text-white"
```

---

## 📊 Responsive Design

### Mobile-First Breakpoints
```css
/* Default: Mobile (< 640px) */
/* sm: 640px and up */
/* md: 768px and up */
/* lg: 1024px and up */
/* xl: 1280px and up */
/* 2xl: 1536px and up */
```

### Example Responsive Classes
```css
w-full                     /* 100% on mobile */
md:w-1/2                   /* 50% on medium+ */
grid-cols-1                /* 1 column on mobile */
md:grid-cols-2             /* 2 columns on medium+ */
hidden sm:block            /* Hidden on mobile, shown on small+ */
text-sm md:text-base       /* Small text on mobile, base on medium+ */
```

---

## 🎯 Color Reference

### Blue Palette (Primary)
```
blue-50:  #EFF6FF
blue-100: #DBEAFE
blue-200: #BFDBFE
blue-300: #93C5FD
blue-400: #60A5FA
blue-500: #3B82F6
blue-600: #2563EB  ← Primary Brand Color
blue-700: #1D4ED8
blue-800: #1E40AF
```

### Gray Palette (Neutral)
```
gray-50:  #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-600: #4B5563
gray-700: #374151
gray-800: #1F2937
```

### Red Palette (Error)
```
red-50:   #FEF2F2
red-100:  #FEE2E2
red-500:  #EF4444
red-600:  #DC2626
```

---

## 💡 Tips & Best Practices

1. **Use consistent spacing:** Stick to 4px, 8px, 16px, 24px, 32px intervals
2. **Color contrast:** Ensure text has sufficient contrast (WCAG AA minimum)
3. **Responsive design:** Test on mobile, tablet, and desktop
4. **Accessibility:** Use semantic HTML and focus states
5. **Performance:** Use utility classes to avoid CSS overhead
6. **Hover states:** Always provide visual feedback on interactive elements
7. **Loading states:** Show feedback during async operations

---

**Created:** November 16, 2025
**Tailwind Version:** 3.x
**React Version:** 18.x
