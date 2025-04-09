import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A component to easily translate text
 * @param {Object} props
 * @param {string} props.text - The translation key
 * @param {Object} [props.values] - Optional values for interpolation
 * @returns {React.ReactNode} The translated text
 */
const I18nText = ({ text, values = {}, ...rest }) => {
  const { t } = useTranslation();
  return <span {...rest}>{t(text, values)}</span>;
};

export default I18nText; 