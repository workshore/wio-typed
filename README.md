# Typed.js Attributes for Webflow by Workshore Team

## Core Features
- Configure any element with attributes
- Trigger interaction when the element enters into the view (similar to scroll into view)

## Setup
Add script
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/wio-typed@latest/build/index.min.js" />
```

## Attributes

- `data-wio-typed` mandatory to enable typed.js on the element | should be set as `true`
- `data-wio-typed-speed` type speed in milliseconds | `number`
- `data-wio-typed-start-delay`  time before typing starts in milliseconds | `number`
- `data-wio-typed-back-speed` backspacing speed in milliseconds | `number`
- `data-wio-typed-back-delay` time before backspacing in milliseconds | `number`
- `data-wio-typed-smart-backspace` only backspace what doesn't match the previous string | `true` or `false`
- `data-wio-typed-fade-out` Fade out instead of backspace | `true` or `false`
- `data-wio-typed-fade-out-class` css class for fade animation | `string`
- `data-wio-typed-fade-out-delay` Fade out delay in milliseconds | `number`
- `data-wio-typed-loop` loop typing animation | `-1` for infinite loop, `0` for no loop or any other `number` for loop count
- `data-wio-typed-cursor` for custom cursor | `none` for no cursor, add any other `string` to show as cursor example `|` for pipe cursor
- `data-wio-typed-auto-cursor-css` insert CSS for cursor and fadeOut into HTML | `true` or `false`
- `data-wio-typed-content-type` 'html' or 'text' for plaintext
- `data-wio-typed-enter-view` trigger typing on element is visible on screen
- `data-wio-typed-enter-view-offset` A value from 0 to 1 of how far from the bottom of the viewport to offset the trigger by. 0 = top of element crosses bottom of viewport (enters screen from bottom), 1 = top of element crosses top of viewport (exits screen top). | `0` to `1`
- `data-wio-typed-enter-view-once` Whether or not to trigger the animation just once. | `true` or `false`