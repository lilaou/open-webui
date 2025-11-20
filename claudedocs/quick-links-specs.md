# Quick Links Visual Specifications

## Design Measurements

### Link Card (Pill Shape)
- Height: 24px minimum
- Padding: 4px (vertical) × 12px (horizontal)
- Border: 1px solid
- Border radius: 24px (full pill)
- Gap between cards: 8px
- Font size: 14px
- Font weight: 500

### Icon
- Size: 18px × 18px
- Types: Emoji or image URL
- Position: Left side of card

### Delete Button
- Size: 16px × 16px
- Opacity: 0 (default) → 1 (on card hover)
- Position: Right side of card
- Margin-left: 4px

### Add Button
- Size: 36px × 36px
- Border radius: 24px
- Icon: Material "add" (24px)

## Colors (Light Mode)

### Card Colors
- Background: #F8F9FA
- Border: #E8EAED
- Text: #1F1F1F

### Hover State
- Background: rgba(0, 0, 0, 0.04)
- Border: #4285F4
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Transform: translateY(-2px)

### Delete Button
- Default: #80868B
- Hover BG: #D93025
- Hover Text: white

## Layout

### Container
- Width: 100%
- Max-width: 720px
- Margin-top: 24px
- Position: Centered

### Grid
- Display: flex
- Flex-wrap: wrap
- Justify-content: center
- Gap: 8px

## Animations

### Transition
```css
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### Effects
- Hover: Lift 2px up
- Shadow appears
- Border color changes to blue

## Mobile (< 768px)

- Font size: 13px (from 14px)
- Padding: 4px 8px (from 4px 12px)
- Icon: 16px (from 18px)

## Example Links

1. OA - https://oa.lal.link/ [favicon]
2. 合同助手 - /DocSmart/ [🌐]
3. 文档翻译 - /DocSmart/translate.html [🌍]
4. NAS - https://192.168.45.222:5001/ [folder SVG]
5. Teambition - [team URL] [logo PNG]

