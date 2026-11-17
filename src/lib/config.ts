/**
 * Form delivery. Set PUBLIC_FORM_ENDPOINT (e.g. a Formspree/Basin/own API URL that accepts
 * JSON POST) in the deploy environment. Without it, forms fall back to opening the visitor's
 * e-mail client with the request pre-filled, so no submission is ever lost silently.
 */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';
export const FORM_TO = 'info@maviprotein.com.tr';
