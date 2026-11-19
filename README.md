# CareerKit

CareerKit is a responsive, static storefront for digital career resources. It uses HTML, CSS, Bootstrap 5.3, Bootstrap Icons, Google Fonts, and vanilla JavaScript. Orders are handled manually through WhatsApp.

## Run locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.

The external font and Bootstrap resources load from their CDNs, so an internet connection is needed for those assets.

## Configure ordering

Open `assets/js/script.js` and update the two configuration constants at the top:

```js
const WHATSAPP_NUMBER = "91XXXXXXXXXX";
const UPI_ID = "yourupi@bank";
```

Replace the WhatsApp placeholder with your full international phone number using digits only (country code included). Replace the UPI placeholder with your verified UPI ID. Confirm your payment details with customers in WhatsApp before they pay. The UPI ID is a configuration value for your ordering workflow; the site does not initiate payments or verify them. Product delivery is manual after payment verification. No paid download links are exposed.

## Customize products

Edit the `products` array in `assets/js/script.js` to change names, descriptions, prices, included topics, or categories. Product illustrations are CSS based and do not use copyrighted previews.
