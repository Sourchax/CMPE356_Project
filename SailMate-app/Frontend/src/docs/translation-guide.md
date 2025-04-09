# Translation Guide for SailMate App

This document explains how to use the internationalization (i18n) system implemented in the SailMate app.

## Overview

The SailMate app uses `react-i18next` for internationalization. The following languages are currently supported:

- English (en) - Default
- Turkish (tr)

## Adding Translations

All translations are stored in JSON files under `src/locales/[language-code]/translation.json`.

### Translation Structure

Translations are organized in a nested structure by feature or page. For example:

```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login"
  },
  "homepage": {
    "hero": {
      "title": "Sail with Comfort & Style"
    }
  }
}
```

## Using Translations in Components

### Method 1: Using the useTranslation Hook

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('homepage.hero.title')}</p>
    </div>
  );
}
```

### Method 2: Using the I18nText Component

```jsx
import I18nText from '../components/I18nText';

function MyComponent() {
  return (
    <div>
      <h1><I18nText text="common.welcome" /></h1>
      <p><I18nText text="homepage.hero.title" /></p>
    </div>
  );
}
```

## Handling Variables in Translations

You can include variables in your translations:

In your translation file:
```json
{
  "greetings": {
    "hello": "Hello, {{name}}!"
  }
}
```

In your component:
```jsx
// Using the hook
t('greetings.hello', { name: 'John' })

// Using the component
<I18nText text="greetings.hello" values={{ name: 'John' }} />
```

## Language Switcher

The app includes a language switcher component that allows users to change the language. It's already integrated into the header and mobile menu.

## Adding New Languages

To add a new language:

1. Create a new translation file in `src/locales/[language-code]/translation.json`
2. Add the language to the resources object in `src/i18n.js`
3. Add a new button to the `LanguageSwitcher` component

## Best Practices

1. Use translation keys that reflect the structure of your application
2. Keep translations organized by feature or page
3. Use common prefixes for shared UI elements
4. Test your application in all supported languages
5. Make sure all user-facing text is translated 