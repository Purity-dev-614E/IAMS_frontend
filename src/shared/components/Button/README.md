# Button Component

A reusable button component that follows the IAMS app theme and supports icons.

## Usage

```jsx
import Button from '../../../shared/components/Button';

// Basic button
<Button onClick={handleClick}>Click me</Button>

// With icon (left position - default)
<Button icon={PlusIcon}>Add New</Button>

// With icon (right position)
<Button icon={ArrowIcon} iconPosition="right">Continue</Button>

// Different variants
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Cannot Click</Button>
```

## Props

- `children` (ReactNode): Button text/content
- `onClick` (Function): Click handler
- `variant` (String): Button style variant
  - `'primary'` (default) - Blue background
  - `'secondary'` - Gray background with border
  - `'outline'` - Transparent with blue border
  - `'ghost'` - Transparent, shows background on hover
  - `'danger'` - Red background
  - `'success'` - Green background
- `size` (String): Button size
  - `'small'` - 32px height
  - `'medium'` (default) - 40px height
  - `'large'` - 48px height
- `icon` (Component): Icon component to display
- `iconPosition` (String): Where to place the icon
  - `'left'` (default)
  - `'right'`
- `disabled` (Boolean): Disable the button
- `loading` (Boolean): Show loading spinner
- `type` (String): Button type (default: 'button')
- `className` (String): Additional CSS classes

## Icons

The button accepts any icon component that renders an SVG. Icons should be 16x16px by default but will be scaled appropriately.

```jsx
import { Plus, ArrowRight } from 'lucide-react';

<Button icon={Plus}>Add New</Button>
<Button icon={ArrowRight} iconPosition="right">Continue</Button>
```
