---
id: add_your_dapp
title: Adding your DApp to Status
---

# Instructions

We accept submissions to our DApp list via pull request. 

Once you've tested your DApp thoroughly on Status and addressed any issues, make a pull request to [status-react](https://github.com/status-im/status-react) with the following:

- Add a square icon for your DApp (180x180 png) with a colored (non-white) background to `resources/images/contacts`. The file name should match your DApp, e.g. `my-dapp.png`. Please do not include any text. Note that the icon will be round cropped.

- Add information about your icon to `src/status_im/react_native/resources.cljs`. For example:
```
:my-dapp (js/require "./resources/images/contacts/my-dapp.png")
```
- Add your DApp to the appropriate category list in  `src/status_im/ui/screens/browser/default_dapps.cljs`:

```
{:title (i18n/label :t/default-dapps-fun-games)
 :data [{:name        "CryptoKitties"
         :dapp-url    "https://www.cryptokitties.co"
         :photo-path  "contacts://cryptokitties"
         :description "Collect and breed adorable digital cats."}
```
- Once submitted, please ping in #status-core-dapps to ensure that your PR is reviewed.

## Link to your DApp

You can deep link to any DApp in Status using this format:

```
https://get.status.im/browse/website.com
```

You can also use the `Share link` button from the options menu within the Status browser. 

## A note on curation

Due to official Store policies, we unfortunately face certain restrictions on which DApps we can accept. Gambling & pornography DApps are not accepted.

For more details on these restrictions, please read the [Play Store](https://play.google.com/about/restricted-content/) and [Apple Store guidelines](https://developer.apple.com/app-store/review/guidelines/).

Users always have the freedom to visit any DApp or website in our browser.

## Need support?

If you have any questions, ping us in [#status](https://get.status.im/chat/public/status).
